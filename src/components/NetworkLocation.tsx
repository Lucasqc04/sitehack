import React, { useEffect, useState } from 'react';
import { GeoLocationData, getIPGeolocation } from '../services/geolocation';
import { InfoSection, MapView } from './';

const NetworkLocation: React.FC = () => {
  const [locationData, setLocationData] = useState<GeoLocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapVisible, setMapVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getIPGeolocation();
        setLocationData(data);
        
        // Atraso pequeno para garantir que todos os outros componentes foram carregados
        if (data.latitude && data.longitude) {
          setTimeout(() => setMapVisible(true), 500);
        }
      } catch (error) {
        console.error("Erro ao obter localização:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-hack-primary p-4 border border-hack-primary">Carregando dados de localização...</div>;
  }

  if (!locationData) {
    return <div className="text-hack-primary p-4 border border-hack-primary">Não foi possível obter dados de localização</div>;
  }

  return (
    <div>
      <InfoSection
        title="Rede e Localização"
        data={{
          "IP Público": locationData.ip,
          "Cidade": locationData.city || 'Não disponível',
          "Região": locationData.region || 'Não disponível',
          "País": locationData.country || 'Não disponível',
          "Provedor (ISP)": locationData.isp || 'Não disponível',
          "Fuso Horário": locationData.timezone || 'Não disponível',
          "Coordenadas": locationData.latitude && locationData.longitude 
            ? `${locationData.latitude}, ${locationData.longitude}` 
            : 'Não disponível'
        }}
      />
      
      {mapVisible && locationData.latitude && locationData.longitude && (
        <div className="mt-4">
          <h3 className="text-hack-primary text-xl mb-2">Localização aproximada via IP:</h3>
          <MapView
            latitude={locationData.latitude}
            longitude={locationData.longitude}
            title={`${locationData.city || 'Localização'}, ${locationData.country || ''}`}
          />
          <p className="text-hack-secondary text-sm mt-2">
            Esta é uma localização aproximada baseada apenas no seu IP público, 
            sem requisitar permissão de GPS.
          </p>
        </div>
      )}
    </div>
  );
};

export default NetworkLocation;
