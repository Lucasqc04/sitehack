import React, { useEffect, useRef, useState } from 'react';
import { getMicrophone } from '../../services/permissionsAccess';

const MicrophoneAccess: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [micActive, setMicActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startMicrophone = async () => {
    setIsLoading(true);
    setError(null);
    
    // Parar qualquer instância anterior
    stopMicrophone();
    
    try {
      const stream = await getMicrophone();
      if (!stream) {
        setError('Não foi possível acessar o microfone.');
        return;
      }
      
      streamRef.current = stream;
      
      // Criar novo AudioContext (deve ser criado após interação do usuário)
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      // Criar analyser
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;
      
      // Conectar fonte de áudio
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Iniciar visualização
      setMicActive(true);
      requestAnimationFrame(drawAudio);
    } catch (err: any) {
      setError(err.message || 'Falha ao acessar o microfone.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopMicrophone = () => {
    // Parar animação
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Fechar AudioContext
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
    }
    
    // Parar tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    analyserRef.current = null;
  };

  const drawAudio = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Limpar canvas
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, width, height);
    
    // Obter dados do som
    analyser.getByteFrequencyData(dataArray);
    
    // Desenhar barras
    const barWidth = (width / bufferLength) * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * height;
      
      ctx.fillStyle = `rgb(0, ${Math.min(255, barHeight + 100)}, 0)`;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
    
    // Desenhar linha do tempo
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    analyser.getByteTimeDomainData(dataArray);
    const sliceWidth = width / bufferLength;
    x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * height / 2;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Continuar animação
    animationRef.current = requestAnimationFrame(drawAudio);
  };

  useEffect(() => {
    // Limpar recursos quando o componente for desmontado
    return () => {
      stopMicrophone();
    };
  }, []);

  return (
    <div className="border border-hack-primary p-4 mb-6">
      <h3 className="text-xl text-hack-primary mb-3">Acesso ao Microfone</h3>
      
      {!micActive ? (
        <div className="flex flex-col items-center">
          <button 
            onClick={startMicrophone}
            disabled={isLoading}
            className={`py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary mb-4 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-hack-primary hover:text-hack-dark'}`}
          >
            {isLoading ? 'Iniciando microfone...' : 'Ativar Microfone'}
          </button>
          {error && (
            <div className="text-red-500 p-3 border border-red-500 max-w-md text-center">
              {error}
              <p className="text-hack-secondary text-sm mt-2">
                Isso pode ocorrer se você não tiver um microfone ou se o acesso estiver bloqueado.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md border-2 border-hack-primary bg-black">
            <canvas 
              ref={canvasRef} 
              width={320} 
              height={100} 
              className="w-full"
            />
          </div>
          <p className="text-hack-secondary mt-2 text-sm">
            Fale algo para ver o nível de áudio. O microfone só pôde ser acessado após permissão.
          </p>
          <button 
            onClick={stopMicrophone}
            className="mt-3 py-1 px-3 border border-hack-primary text-hack-primary text-sm hover:bg-hack-primary hover:text-hack-dark"
          >
            Parar Microfone
          </button>
        </div>
      )}
    </div>
  );
};

export default MicrophoneAccess;
