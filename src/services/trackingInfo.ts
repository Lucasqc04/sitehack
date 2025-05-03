export interface TrackingInfo {
  ipInfo: {
    ip: string;
    location?: string;
  };
  browserInfo: {
    name: string;
    version: string;
    language: string;
    userAgent: string;
  };
  systemInfo: {
    os: string;
    platform: string;
    screenResolution: string;
    colorDepth: string;
    timezone: string;
  };
  networkInfo: {
    referrer: string;
    connection: string;
  };
}

export const getTrackingInfo = async (): Promise<TrackingInfo> => {
  const getIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'Não disponível';
    }
  };

  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    const browserRegexes = [
      { name: 'Chrome', regex: /Chrome\/([0-9.]+)/ },
      { name: 'Firefox', regex: /Firefox\/([0-9.]+)/ },
      { name: 'Safari', regex: /Version\/([0-9.]+).*Safari/ },
    ];

    for (const browser of browserRegexes) {
      const match = ua.match(browser.regex);
      if (match) return { name: browser.name, version: match[1] };
    }
    return { name: 'Desconhecido', version: '0' };
  };

  const browser = getBrowserInfo();
  const ip = await getIP();

  return {
    ipInfo: {
      ip,
      location: 'Buscando...',
    },
    browserInfo: {
      name: browser.name,
      version: browser.version,
      language: navigator.language,
      userAgent: navigator.userAgent,
    },
    systemInfo: {
      os: navigator.platform,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      colorDepth: `${window.screen.colorDepth}bits`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    networkInfo: {
      referrer: document.referrer || 'Acesso direto',
      connection: (navigator as any).connection?.effectiveType || 'Desconhecido',
    },
  };
};
