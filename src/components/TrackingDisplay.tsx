import React, { useEffect, useState } from 'react';
import { TrackingInfo, getTrackingInfo } from '../services/trackingInfo';
import { InfoSection } from './';

const TrackingDisplay: React.FC = () => {
  const [trackingData, setTrackingData] = useState<TrackingInfo | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await getTrackingInfo();
      setTrackingData(data);
    };
    loadData();
  }, []);

  if (!trackingData) return (
    <div className="flex items-center justify-center">
      <p className="text-hack-primary">Carregando dados...</p>
    </div>
  );

  return (
    <section className="space-y-6">
      <div className="typing-effect mb-8">
        <h1 className="text-3xl font-mono text-hack-primary mb-2">
          {`> Dados coletados do seu dispositivo_`}
        </h1>
        <p className="text-hack-secondary">
          Estas informações foram obtidas sem solicitar permissão
        </p>
      </div>

      <InfoSection title="Informações de IP" data={trackingData.ipInfo} />
      <InfoSection title="Informações do Navegador" data={trackingData.browserInfo} />
      <InfoSection title="Informações do Sistema" data={trackingData.systemInfo} />
      <InfoSection title="Informações de Rede" data={trackingData.networkInfo} />
    </section>
  );
};

export default TrackingDisplay;
