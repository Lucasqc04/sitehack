export interface HardwareInfo {
    screenResolution: string;
    colorDepth: string;
    devicePixelRatio: number;
    monitors?: number;
    refreshRate?: number;
    gpu?: string;
    memory?: string;
    cores?: number;
    touchpoints?: number;
  }
  
  export const getHardwareInfo = (): HardwareInfo => {
    const result: HardwareInfo = {
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      colorDepth: `${window.screen.colorDepth} bits`,
      devicePixelRatio: window.devicePixelRatio || 1,
    };
  
    // Detectar núcleos de CPU
    if (navigator.hardwareConcurrency) {
      result.cores = navigator.hardwareConcurrency;
    }
  
    // Detectar memória
    if ((navigator as any).deviceMemory) {
      result.memory = `${(navigator as any).deviceMemory} GB`;
    }
  
    // Detectar GPU via WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          result.gpu = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      }
    } catch {
      result.gpu = 'Não disponível';
    }
  
    // Detectar pontos de toque
    if ('maxTouchPoints' in navigator) {
      result.touchpoints = navigator.maxTouchPoints;
    }
  
    return result;
  };
  