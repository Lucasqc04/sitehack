import React, { useEffect, useState } from 'react';
import { InfoSection } from './';

const formatBytes = (bytes?: number) => {
  if (bytes === undefined) return 'Não disponível';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const StorageFootprint: React.FC = () => {
  const [data, setData] = useState<Record<string, string>>({
    'Armazenamento usado': 'Carregando...',
    'Cota disponível': 'Carregando...'
  });

  useEffect(() => {
    const loadData = async () => {
      let usage: number | undefined;
      let quota: number | undefined;

      if (navigator.storage?.estimate) {
        try {
          const estimate = await navigator.storage.estimate();
          usage = estimate.usage;
          quota = estimate.quota;
        } catch (error) {
          console.error('Erro ao estimar armazenamento:', error);
        }
      }

      let cacheCount = 'Não disponível';
      if ('caches' in window) {
        try {
          const keys = await caches.keys();
          cacheCount = keys.length.toString();
        } catch (error) {
          console.error('Erro ao ler caches:', error);
        }
      }

      setData({
        'Cookies habilitados': navigator.cookieEnabled ? 'Sim' : 'Não',
        'LocalStorage (chaves)': window.localStorage?.length.toString() || '0',
        'SessionStorage (chaves)': window.sessionStorage?.length.toString() || '0',
        'IndexedDB': 'indexedDB' in window ? 'Disponível' : 'Indisponível',
        'Cache Storage (entradas)': cacheCount,
        'Armazenamento usado': formatBytes(usage),
        'Cota disponível': formatBytes(quota)
      });
    };

    loadData();
  }, []);

  return (
    <InfoSection
      title="Armazenamento e Persistência"
      data={data}
    />
  );
};

export default StorageFootprint;
