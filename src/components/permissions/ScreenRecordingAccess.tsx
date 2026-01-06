import React, { useEffect, useRef, useState } from 'react';

const ScreenRecordingAccess: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSecureContext, setIsSecureContext] = useState(true);

  const startScreenShare = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar se a API está disponível
      if (!window.isSecureContext) {
        throw new Error('Compartilhamento de tela exige conexão segura (HTTPS ou localhost)');
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Compartilhamento de tela não suportado neste navegador');
      }
      
      // Solicitar acesso à tela
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' } as any,
        audio: false
      });
      
      // Configurar o vídeo com estilo visível
      if (videoRef.current) {
        videoRef.current.srcObject = displayStream;
        videoRef.current.style.display = 'block'; // Garantir que o vídeo esteja visível
      }
      
      setStream(displayStream);
      
      // Detectar quando o usuário cancela o compartilhamento
      displayStream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
      
    } catch (err: any) {
      console.error('Erro ao compartilhar tela:', err);
      if (err.name === 'NotAllowedError') {
        setError('Permissão para compartilhar tela foi negada');
      } else {
        setError(`Erro ao compartilhar tela: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const startRecording = () => {
    if (!stream) return;
    
    // Limpar qualquer gravação anterior
    setRecordedChunks([]);
    setVideoURL(null);
    
    try {
      // Criar gravador de mídia com melhor qualidade
      const options = { 
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 3000000 // 3Mbps para melhor qualidade
      };
      
      // Tentar formatos alternativos se o navegador não suportar vp9
      const mediaRecorder = new MediaRecorder(
        stream, 
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1 
          ? { mimeType: 'video/webm' } 
          : options
      );
      
      // Capturar dados a cada 1 segundo para evitar perda em caso de crash
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Criar blob somente quando parar completamente
        if (recordedChunks.length) {
          const blob = new Blob(recordedChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setVideoURL(url);
        }
        setRecording(false);
      };
      
      // Iniciar com timeslice para capturar dados regularmente
      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
      
    } catch (err: any) {
      setError(`Erro ao iniciar gravação: ${err.message}`);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      try {
        // Certifique-se de que a gravação está em estado ativo antes de parar
        if (mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
          console.log("Gravação parada com sucesso");
        }
      } catch (err) {
        console.error("Erro ao parar gravação:", err);
      }
    }
  };
  
  const stopScreenShare = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };
  
  const downloadRecording = () => {
    if (!videoURL) return;
    
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = videoURL;
    a.download = 'screen-recording.webm';
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
  };
  
  useEffect(() => {
    setIsSecureContext(window.isSecureContext);
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoURL) {
        URL.revokeObjectURL(videoURL);
      }
    };
  }, [stream, videoURL]);
  
  // Atualizar o useEffect para gerenciar corretamente os chunks gravados
  useEffect(() => {
    // Processar chunks quando a gravação é interrompida
    if (!recording && recordedChunks.length > 0 && !videoURL) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
    }
  }, [recording, recordedChunks, videoURL]);

  return (
    <div className="hack-panel mb-6">
      <h3 className="hack-title">Gravação de Tela</h3>
      
      <div className="space-y-4">
        {!isSecureContext && (
          <div className="text-yellow-500 p-3 border border-yellow-500">
            Este recurso exige HTTPS (ou localhost). Em conexões não seguras, o compartilhamento de tela pode falhar.
          </div>
        )}
        {!stream ? (
          <button 
            onClick={startScreenShare}
            disabled={isLoading}
            className={`py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-hack-primary hover:text-hack-dark'}`}
          >
            {isLoading ? 'Solicitando acesso...' : 'Compartilhar Tela'}
          </button>
        ) : (
          <div className="space-y-3">
            {/* Garantir que o vídeo seja sempre visível */}
            <div className="w-full max-w-md mx-auto border-2 border-hack-primary">
              <video 
                ref={videoRef} 
                autoPlay 
                muted
                className="w-full h-64 object-contain bg-black"
              />
              {recording && (
                <div className="bg-hack-dark py-1 text-center">
                  <span className="text-red-500 animate-pulse">● </span>
                  <span className="text-hack-primary">Gravando...</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-center space-x-4">
              {!recording ? (
                <button 
                  onClick={startRecording}
                  className="py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary hover:bg-hack-primary hover:text-hack-dark"
                >
                  Iniciar Gravação
                </button>
              ) : (
                <button 
                  onClick={stopRecording}
                  className="py-2 px-4 bg-hack-dark border border-red-500 text-red-500 hover:bg-red-500 hover:text-black"
                >
                  Parar Gravação
                </button>
              )}
              
              <button 
                onClick={stopScreenShare}
                className="py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary hover:bg-hack-primary hover:text-hack-dark"
              >
                Encerrar Compartilhamento
              </button>
            </div>
          </div>
        )}
        
        {videoURL && (
          <div className="mt-4 space-y-3">
            <h4 className="text-lg text-hack-primary">Gravação Concluída</h4>
            <video 
              src={videoURL} 
              controls 
              className="w-full max-w-md mx-auto border border-hack-primary"
            />
            <div className="flex justify-center">
              <button 
                onClick={downloadRecording}
                className="py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary hover:bg-hack-primary hover:text-hack-dark"
              >
                Baixar Gravação
              </button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 p-3 border border-red-500">
            {error}
          </div>
        )}
        
        <div className="text-hack-secondary text-sm mt-2">
          <p>
            A API de captura de tela permite que sites gravem sua tela ou janelas específicas.
            Isso é comumente usado para demonstrações, compartilhamento de tela, ou assistência remota.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScreenRecordingAccess;
