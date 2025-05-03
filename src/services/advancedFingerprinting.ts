import FingerprintJS from '@fingerprintjs/fingerprintjs';

export interface AdvancedFingerprint {
  battery?: {
    level: number;
    charging: boolean;
  };
  geolocationPermission?: string;
  canvasFingerprint: string;
  webglFingerprint: string;
  audioFingerprint: string;
  visitorId?: string;
  fonts?: string[];
  plugins?: string[];
  storageAvailability?: {
    cookies: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
  };
  userInteraction?: {
    sessionStart: string;
    clicksCount?: number;
  };
}

export const getAdvancedFingerprint = async (): Promise<AdvancedFingerprint> => {
  const result: AdvancedFingerprint = {
    canvasFingerprint: 'Calculando...',
    webglFingerprint: 'Calculando...',
    audioFingerprint: 'Calculando...',
  };

  // Corrige o uso de getBattery usando verificação de existência
  if ('getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery();
      result.battery = {
        level: battery.level,
        charging: battery.charging,
      };
    } catch (e) {
      // ...erro omitido...
    }
  }

  try {
    const perm = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
    result.geolocationPermission = perm.state;
  } catch (e) {
    result.geolocationPermission = 'Não disponível';
  }

  // Integração com FingerprintJS para obter fingerprint do navegador
  try {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const fpResult = await fp.get();
    result.visitorId = fpResult.visitorId;
    
    // Obter detalhes de componentes de forma segura
    if (fpResult.components) {
      // Canvas fingerprint - versão segura com verificação de tipos
      try {
        // Criando nosso próprio canvas fingerprint como alternativa
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = 200;
          canvas.height = 50;
          ctx.textBaseline = 'top';
          ctx.font = '14px Arial';
          ctx.fillStyle = '#00ff00';
          ctx.fillText('Fingerprint', 2, 2);
          result.canvasFingerprint = canvas.toDataURL().substring(0, 25) + '...';
        }
      } catch {
        result.canvasFingerprint = `Hash parcial: ${fpResult.visitorId.substring(0, 8)}...`;
      }
      
      // WebGL fingerprint
      try {
        // Usando outra abordagem para WebGL
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        if (gl) {
          const ext = gl.getExtension('WEBGL_debug_renderer_info');
          if (ext) {
            const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
            const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
            result.webglFingerprint = `${vendor} - ${renderer}`;
          } else {
            result.webglFingerprint = `Padrão: ${gl.getParameter(gl.VENDOR)}`;
          }
        }
      } catch {
        result.webglFingerprint = `Hash parcial: ${fpResult.visitorId.substring(8, 16)}...`;
      }
      
      // Audio fingerprint (versão simplificada)
      result.audioFingerprint = `Hash parcial: ${fpResult.visitorId.substring(16, 24)}...`;
    }
  } catch (e) {
    result.visitorId = 'Não disponível';
    result.canvasFingerprint = 'Falha ao obter';
    result.webglFingerprint = 'Falha ao obter';
    result.audioFingerprint = 'Falha ao obter';
  }
  
  // Detectar plugins
  try {
    const plugins: string[] = [];
    if (navigator.plugins && navigator.plugins.length > 0) {
      for (let i = 0; i < navigator.plugins.length; i++) {
        plugins.push(navigator.plugins[i].name);
      }
    }
    result.plugins = plugins.length > 0 ? plugins : ['Nenhum plugin detectado'];
  } catch (e) {
    result.plugins = ['Não disponível'];
  }
  
  // Verificar disponibilidade de armazenamento
  result.storageAvailability = {
    cookies: navigator.cookieEnabled,
    localStorage: !!window.localStorage,
    sessionStorage: !!window.sessionStorage,
    indexedDB: !!window.indexedDB
  };
  
  // Informações sobre interação do usuário
  result.userInteraction = {
    sessionStart: new Date().toLocaleTimeString()
  };
  
  return result;
};
