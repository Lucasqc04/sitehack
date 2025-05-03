import React, { useEffect, useState } from 'react';
import { getAdvancedFingerprint, AdvancedFingerprint as AdvancedFingerprintType } from '../services/advancedFingerprinting';
import { InfoSection } from './';

const AdvancedFingerprint: React.FC = () => {
  const [data, setData] = useState<AdvancedFingerprintType | null>(null);

  useEffect(() => {
    getAdvancedFingerprint().then(setData);
  }, []);

  if (!data) return <div>Carregando fingerprint avançado...</div>;

  return (
    <div>
      <InfoSection
        title="Fingerprint Avançado"
        data={{
          "Nível da Bateria": data.battery ? `${data.battery.level * 100}%` : 'Não disponível',
          "Está Carregando": data.battery ? (data.battery.charging ? 'Sim' : 'Não') : 'Não disponível',
          "Permissão de Geolocalização": data.geolocationPermission || 'Não disponível',
          "Canvas Fingerprint": data.canvasFingerprint,
          "WebGL Fingerprint": data.webglFingerprint,
          "Audio Fingerprint": data.audioFingerprint,
        }}
      />
    </div>
  );
};

export default AdvancedFingerprint;
