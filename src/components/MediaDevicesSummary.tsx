import React, { useEffect, useState } from 'react';
import { InfoSection } from './';

interface MediaDeviceCounts {
  audioInputs: number;
  videoInputs: number;
  audioOutputs: number;
  hasLabels: boolean;
}

const MediaDevicesSummary: React.FC = () => {
  const [data, setData] = useState<Record<string, string>>({
    'Dispositivos de mídia': 'Carregando...'
  });

  useEffect(() => {
    const loadDevices = async () => {
      if (!navigator.mediaDevices?.enumerateDevices) {
        setData({ 'Dispositivos de mídia': 'Não disponível' });
        return;
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const counts = devices.reduce<MediaDeviceCounts>(
          (acc, device) => {
            if (device.kind === 'audioinput') acc.audioInputs += 1;
            if (device.kind === 'videoinput') acc.videoInputs += 1;
            if (device.kind === 'audiooutput') acc.audioOutputs += 1;
            if (device.label) acc.hasLabels = true;
            return acc;
          },
          { audioInputs: 0, videoInputs: 0, audioOutputs: 0, hasLabels: false }
        );

        setData({
          'Microfones detectados': counts.audioInputs.toString(),
          'Câmeras detectadas': counts.videoInputs.toString(),
          'Saídas de áudio': counts.audioOutputs.toString(),
          'Rótulos disponíveis': counts.hasLabels ? 'Sim' : 'Não'
        });
      } catch (error) {
        console.error('Erro ao enumerar dispositivos de mídia:', error);
        setData({ 'Dispositivos de mídia': 'Não disponível' });
      }
    };

    loadDevices();
  }, []);

  return (
    <InfoSection
      title="Dispositivos de Mídia"
      data={data}
    />
  );
};

export default MediaDevicesSummary;
