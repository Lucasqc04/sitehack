import React, { useEffect, useRef, useState } from 'react';

const CameraAccess: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    
    if (!videoRef.current) {
      setError("Elemento de vídeo não encontrado");
      setIsLoading(false);
      return;
    }
    
    try {
      // Abordagem mais direta possível
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true // Sem nenhuma constraint especial
      });
      
      // Atribuir diretamente o stream ao elemento de vídeo
      videoRef.current.srcObject = stream;
      
      // Registrar um callback para quando o vídeo começar a ser carregado
      videoRef.current.onloadedmetadata = () => {
        setIsLoading(false);
        if (videoRef.current) {
          videoRef.current.play().catch(e => {
            console.error("Erro ao reproduzir vídeo:", e);
            setError("Não foi possível iniciar a reprodução do vídeo");
          });
        }
      };
      
      // Detectar erro no elemento de vídeo
      videoRef.current.onerror = () => {
        setError("Erro ao carregar o vídeo");
        setIsLoading(false);
      };
      
    } catch (err: any) {
      console.error("Erro de acesso à câmera:", err);
      setError(err.name === "NotFoundError" 
        ? "Nenhuma câmera encontrada neste dispositivo" 
        : err.name === "NotAllowedError" 
          ? "Permissão para acessar a câmera foi negada"
          : `Erro ao acessar a câmera: ${err.message}`);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Limpar recursos quando o componente for desmontado
    return () => {
      const video = videoRef.current;
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="border border-hack-primary p-4 mb-6">
      <h3 className="text-xl text-hack-primary mb-3">Acesso à Câmera</h3>
      
      <div className="flex flex-col items-center">
        {/* Elemento de vídeo (sempre presente, mas pode estar escondido) */}
        <div className={`relative w-full max-w-md border-2 border-hack-primary ${!isLoading && !error ? 'block' : 'hidden'}`}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            muted
            className="w-full h-64 object-cover" 
            style={{ filter: 'hue-rotate(120deg) saturate(1.5)' }}
          />
        </div>
        
        {/* Área de controle/feedback */}
        {(error || !videoRef.current?.srcObject) && (
          <div className="flex flex-col items-center my-4">
            {!isLoading ? (
              <button 
                onClick={startCamera}
                className="py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary mb-4 hover:bg-hack-primary hover:text-hack-dark"
              >
                Ativar Câmera
              </button>
            ) : (
              <div className="text-hack-primary mb-4">Iniciando câmera...</div>
            )}
            
            {error && (
              <div className="text-red-500 p-3 border border-red-500 max-w-md text-center">
                {error}
                <p className="text-hack-secondary text-sm mt-2">
                  Isso pode ocorrer se você não tiver uma câmera ou se o acesso estiver bloqueado.
                </p>
              </div>
            )}
          </div>
        )}
        
        {videoRef.current?.srcObject && !error && (
          <p className="text-hack-secondary mt-2 text-sm">
            A câmera está ativa. Estes dados só podem ser acessados com sua permissão explícita.
          </p>
        )}
      </div>
    </div>
  );
};

export default CameraAccess;
