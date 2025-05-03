import React, {  useState } from 'react';
import { MapView } from '../';

const GeolocationAccess: React.FC = () => {
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLocation = () => {
    setIsLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador');
      setIsLoading(false);
      return;
    }
    
    // Configurações aprimoradas para maior precisão
    const options = {
      enableHighAccuracy: true,  // Solicita a melhor precisão possível
      timeout: 15000,            // Tempo maior para obter localização precisa
      maximumAge: 0              // Sempre obtém uma posição nova
    };
    
    // Função para monitorar mudanças na posição (mais preciso que getCurrentPosition)
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log('Localização GPS obtida:', position.coords);
        
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setAccuracy(position.coords.accuracy);
        setIsLoading(false);
        
        // Parar de observar após obter uma posição com boa precisão
        if (position.coords.accuracy < 100) {
          navigator.geolocation.clearWatch(watchId);
        }
      },
      (error) => {
        console.error('Erro detalhado ao obter localização:', error);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Permissão para geolocalização negada pelo usuário');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Informação de localização indisponível');
            break;
          case error.TIMEOUT:
            setError('Tempo de espera para obter localização expirou');
            break;
          default:
            setError(`Erro desconhecido: ${error.message}`);
        }
        
        setIsLoading(false);
      },
      options
    );
    
    // Limpeza ao desmontar
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  };

  return (
    <div className="hack-panel mb-6">
      <h3 className="hack-title">Geolocalização Precisa</h3>
      
      {!location ? (
        <div className="flex flex-col items-center">
          <button 
            onClick={getLocation}
            disabled={isLoading}
            className={`py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary mb-4 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-hack-primary hover:text-hack-dark'}`}
          >
            {isLoading ? 'Obtendo localização...' : 'Obter Localização Precisa'}
          </button>
          
          {error && (
            <div className="text-red-500 p-3 border border-red-500 max-w-md text-center">
              {error}
              <p className="text-hack-secondary text-sm mt-2">
                A geolocalização precisa requer sua permissão explícita.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-hack-secondary">Latitude:</div>
            <div className="text-hack-primary">{location.latitude.toFixed(6)}</div>
            
            <div className="text-hack-secondary">Longitude:</div>
            <div className="text-hack-primary">{location.longitude.toFixed(6)}</div>
            
            <div className="text-hack-secondary">Precisão:</div>
            <div className="text-hack-primary">{accuracy ? `${accuracy.toFixed(1)} metros` : 'Desconhecida'}</div>
          </div>
          
          <div className="mt-4">
            <MapView 
              latitude={location.latitude} 
              longitude={location.longitude} 
              title="Sua localização precisa" 
            />
          </div>
          
          <p className="text-hack-secondary text-sm">
            Esta localização é obtida diretamente do GPS/Wi-Fi do seu dispositivo,
            fornecendo coordenadas muito mais precisas que as baseadas apenas em IP.
          </p>
        </div>
      )}
    </div>
  );
};

export default GeolocationAccess;
