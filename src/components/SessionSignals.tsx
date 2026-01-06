import React, { useEffect, useState } from 'react';
import { InfoSection } from './';

const SessionSignals: React.FC = () => {
  const [data, setData] = useState<Record<string, string>>({});

  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: {
        effectiveType?: string;
        downlink?: number;
        rtt?: number;
        saveData?: boolean;
      };
    }).connection;

    setData({
      'Página atual': window.location.href,
      'Referência (referrer)': document.referrer || 'Direto/sem referência',
      'Histórico na aba': history.length.toString(),
      'Idioma principal': navigator.language,
      'Idiomas do navegador': navigator.languages?.join(', ') || 'Não disponível',
      'Fuso horário': Intl.DateTimeFormat().resolvedOptions().timeZone,
      'Do Not Track': navigator.doNotTrack ?? 'Não informado',
      'Estado de visibilidade': document.visibilityState,
      'Online': navigator.onLine ? 'Sim' : 'Não',
      'Tipo de conexão': connection?.effectiveType || 'Não disponível',
      'Downlink estimado': connection?.downlink ? `${connection.downlink} Mb/s` : 'Não disponível',
      'RTT estimado': connection?.rtt ? `${connection.rtt} ms` : 'Não disponível',
      'Economia de dados': connection?.saveData ? 'Ativo' : 'Inativo'
    });
  }, []);

  return (
    <InfoSection
      title="Sinais de Sessão e Rede"
      data={data}
    />
  );
};

export default SessionSignals;
