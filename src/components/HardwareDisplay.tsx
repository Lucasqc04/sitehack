import React, { useEffect, useState } from 'react';
import { HardwareInfo, getHardwareInfo } from '../services/hardwareInfo';
import { InfoSection } from './';

const HardwareDisplay: React.FC = () => {
  const [hwInfo, setHwInfo] = useState<HardwareInfo | null>(null);

  useEffect(() => {
    setHwInfo(getHardwareInfo());
  }, []);

  if (!hwInfo) {
    return <div className="text-hack-primary">Carregando informações de hardware...</div>;
  }

  return (
    <InfoSection
      title="Hardware e Tela"
      data={{
        "Resolução de Tela": hwInfo.screenResolution,
        "Profundidade de Cor": hwInfo.colorDepth,
        "Densidade de Pixels": hwInfo.devicePixelRatio?.toString() || 'Não disponível',
        "GPU": hwInfo.gpu || 'Não disponível',
        "Núcleos de CPU": hwInfo.cores?.toString() || 'Não disponível',
        "Memória RAM": hwInfo.memory || 'Não disponível',
        "Pontos de Toque": hwInfo.touchpoints?.toString() || 'Não disponível'
      }}
    />
  );
};

export default HardwareDisplay;
