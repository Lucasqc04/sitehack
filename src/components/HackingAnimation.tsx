import React, { useState, useEffect } from 'react';

interface HackingAnimationProps {
  onComplete?: () => void;
  duration?: number;
  messages?: string[];
}

const defaultMessages = [
  "> Iniciando acesso não autorizado...",
  "> Conectando ao servidor alvo...",
  "> Identificando pacotes de dados...",
  "> Interceptando tráfego...",
  "> Decodificando pacotes criptografados...",
  "> Extraindo informações dos metadados...",
  "> Obtendo dados do dispositivo...",
  "> Coletando informações de navegador...",
  "> Bypass de segurança completo...",
  "> Acesso obtido com sucesso!"
];

const HackingAnimation: React.FC<HackingAnimationProps> = ({ 
  onComplete, 
  duration = 5000,
  messages = defaultMessages 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const messageInterval = duration / messages.length;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= messages.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            if (onComplete) onComplete();
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, messageInterval);

    return () => clearInterval(interval);
  }, [messages, duration, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="scanline"></div>
      <div className="max-w-3xl w-full p-8 border border-hack-primary relative overflow-hidden hacking-effect">
        <div className="h-80 overflow-auto font-mono text-hack-primary">
          {messages.slice(0, currentIndex + 1).map((message, i) => (
            <div 
              key={i} 
              className={`mb-2 ${i === currentIndex ? 'typing-animation' : ''}`}
            >
              {message}
            </div>
          ))}
        </div>
        <div className="mt-4 animate-pulse text-hack-primary text-center">
          {currentIndex < messages.length - 1 ? 'Hackeando...' : 'Concluído!'}
        </div>
      </div>
    </div>
  );
};

export default HackingAnimation;
