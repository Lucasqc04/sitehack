import React, { useEffect, useState } from 'react';

interface SensorData {
  acceleration: {
    x: number | null;
    y: number | null;
    z: number | null;
  };
  rotation: {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  };
}

const SensorsAccess: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    acceleration: { x: null, y: null, z: null },
    rotation: { alpha: null, beta: null, gamma: null }
  });
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  const formatValue = (value: number | null): string => {
    return value !== null ? value.toFixed(2) : 'N/A';
  };

  const handleStartSensors = () => {
    setError(null);
    
    if (!window.DeviceMotionEvent && !window.DeviceOrientationEvent) {
      setError('Sensores de movimento não são suportados pelo seu navegador');
      return;
    }
    
    try {
      setActive(true);
    } catch (err: any) {
      setError(`Erro ao ativar sensores: ${err.message}`);
      setActive(false);
    }
  };

  const handleStopSensors = () => {
    setActive(false);
  };

  useEffect(() => {
    if (!active) return;
    
    const handleMotion = (event: DeviceMotionEvent) => {
      if (!active) return;
      
      setSensorData(prev => ({
        ...prev,
        acceleration: {
          x: event.accelerationIncludingGravity?.x ?? null,
          y: event.accelerationIncludingGravity?.y ?? null,
          z: event.accelerationIncludingGravity?.z ?? null
        }
      }));
    };
    
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!active) return;
      
      setSensorData(prev => ({
        ...prev,
        rotation: {
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma
        }
      }));
    };
    
    window.addEventListener('devicemotion', handleMotion);
    window.addEventListener('deviceorientation', handleOrientation);
    
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [active]);

  return (
    <div className="border border-hack-primary p-4 mb-6">
      <h3 className="text-xl text-hack-primary mb-3">Acesso a Sensores</h3>
      
      <div className="space-y-4">
        {!active ? (
          <button 
            onClick={handleStartSensors}
            className="py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary hover:bg-hack-primary hover:text-hack-dark"
          >
            Ativar Sensores
          </button>
        ) : (
          <button 
            onClick={handleStopSensors}
            className="py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary hover:bg-hack-primary hover:text-hack-dark"
          >
            Desativar Sensores
          </button>
        )}
        
        {error && (
          <div className="text-red-500 p-3 border border-red-500">
            {error}
          </div>
        )}
        
        {active && (
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <h4 className="text-lg text-hack-primary">Acelerômetro (m/s²):</h4>
              <div className="border border-hack-primary p-3">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-hack-secondary">X-axis:</span>
                  <span className="text-hack-primary">{formatValue(sensorData.acceleration.x)}</span>
                  
                  <span className="text-hack-secondary">Y-axis:</span>
                  <span className="text-hack-primary">{formatValue(sensorData.acceleration.y)}</span>
                  
                  <span className="text-hack-secondary">Z-axis:</span>
                  <span className="text-hack-primary">{formatValue(sensorData.acceleration.z)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg text-hack-primary">Giroscópio (graus):</h4>
              <div className="border border-hack-primary p-3">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-hack-secondary">Alpha (z):</span>
                  <span className="text-hack-primary">{formatValue(sensorData.rotation.alpha)}</span>
                  
                  <span className="text-hack-secondary">Beta (x):</span>
                  <span className="text-hack-primary">{formatValue(sensorData.rotation.beta)}</span>
                  
                  <span className="text-hack-secondary">Gamma (y):</span>
                  <span className="text-hack-primary">{formatValue(sensorData.rotation.gamma)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-hack-secondary text-sm">
          Estes sensores são utilizados para detectar movimentos e orientação do dispositivo. 
          Principalmente disponíveis em dispositivos móveis.
        </p>
      </div>
    </div>
  );
};

export default SensorsAccess;
