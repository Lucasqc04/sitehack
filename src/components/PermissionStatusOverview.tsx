import React, { useEffect, useState } from 'react';
import { InfoSection } from './';

const permissionNames: PermissionName[] = [
  'geolocation',
  'notifications',
  'camera',
  'microphone',
  'clipboard-read',
  'clipboard-write'
];

const PermissionStatusOverview: React.FC = () => {
  const [data, setData] = useState<Record<string, string>>({
    'Status das permissões': 'Carregando...'
  });

  useEffect(() => {
    const loadPermissions = async () => {
      const entries: Record<string, string> = {};

      await Promise.all(
        permissionNames.map(async (name) => {
          try {
            const status = await navigator.permissions.query({ name });
            const label = name
              .replace('clipboard-read', 'Clipboard (leitura)')
              .replace('clipboard-write', 'Clipboard (escrita)')
              .replace('geolocation', 'Geolocalização')
              .replace('notifications', 'Notificações')
              .replace('camera', 'Câmera')
              .replace('microphone', 'Microfone');
            entries[label] = status.state;
          } catch (error) {
            entries[name] = 'Não disponível';
          }
        })
      );

      setData(entries);
    };

    loadPermissions();
  }, []);

  return (
    <InfoSection
      title="Status de Permissões"
      data={data}
    />
  );
};

export default PermissionStatusOverview;
