// Serviço para gerenciar acesso a recursos que precisam de permissão

// Solicitar todas as permissões de uma vez
export const requestAllPermissions = async () => {
  const results = {
    camera: false,
    microphone: false,
    geolocation: false,
    notification: false,
    clipboard: false
  };

  // Tenta solicitar permissão da câmera e microfone juntos
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    results.camera = true;
    results.microphone = true;
  } catch (error) {
    console.log("Permissão para câmera/microfone não concedida ou dispositivos não disponíveis");
    
    // Tenta separadamente caso falhe
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      results.camera = true;
    } catch (e) {
      console.log("Câmera não disponível ou permissão negada");
    }
    
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      results.microphone = true;
    } catch (e) {
      console.log("Microfone não disponível ou permissão negada");
    }
  }

  // Solicita geolocalização
  try {
    await new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(),
        (error) => reject(error),
        { timeout: 5000 }
      );
    });
    results.geolocation = true;
  } catch (error) {
    console.log("Permissão para geolocalização não concedida");
  }

  // Solicita notificações
  try {
    const permission = await Notification.requestPermission();
    results.notification = permission === 'granted';
  } catch (error) {
    console.log("Permissão para notificações não suportada");
  }

  // Testa permissão de clipboard (não pode ser solicitada diretamente)
  try {
    await navigator.clipboard.readText();
    results.clipboard = true;
  } catch (error) {
    console.log("Permissão para clipboard não disponível");
  }

  return results;
};

// Câmera - com melhor tratamento de erros
export const getCamera = async (): Promise<MediaStream | null> => {
  try {
    // Especificar opções mais flexíveis
    const constraints = {
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user' // Usar câmera frontal em dispositivos móveis
      }
    };
    
    console.log("Solicitando acesso à câmera com constraints:", constraints);
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // Verificar se o stream tem tracks de vídeo
    if (!stream.getVideoTracks().length) {
      throw new Error('Nenhuma track de vídeo disponível no stream');
    }
    
    console.log("Câmera acessada com sucesso, tracks:", stream.getVideoTracks());
    return stream;
  } catch (error: any) {
    console.error('Erro detalhado ao acessar câmera:', error);
    
    if (error.name === 'NotFoundError') {
      throw new Error('Câmera não detectada neste dispositivo.');
    } else if (error.name === 'NotAllowedError') {
      throw new Error('Permissão para acessar a câmera foi negada.');
    } else if (error.name === 'NotReadableError') {
      throw new Error('Câmera está em uso por outro aplicativo ou indisponível.');
    } else {
      throw new Error(`Não foi possível acessar a câmera: ${error.message}`);
    }
  }
};

// Microfone - com melhor tratamento de erros
export const getMicrophone = async (): Promise<MediaStream | null> => {
  try {
    // Especificar opções de áudio
    const constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    };
    
    console.log("Solicitando acesso ao microfone com constraints:", constraints);
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // Verificar se o stream tem tracks de áudio
    if (!stream.getAudioTracks().length) {
      throw new Error('Nenhuma track de áudio disponível no stream');
    }
    
    console.log("Microfone acessado com sucesso, tracks:", stream.getAudioTracks());
    return stream;
  } catch (error: any) {
    console.error('Erro detalhado ao acessar microfone:', error);
    
    if (error.name === 'NotFoundError') {
      throw new Error('Microfone não detectado neste dispositivo.');
    } else if (error.name === 'NotAllowedError') {
      throw new Error('Permissão para acessar o microfone foi negada.');
    } else if (error.name === 'NotReadableError') {
      throw new Error('Microfone está em uso por outro aplicativo ou indisponível.');
    } else {
      throw new Error(`Não foi possível acessar o microfone: ${error.message}`);
    }
  }
};

// Geolocalização precisa
export interface PreciseLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export const getPreciseLocation = (): Promise<PreciseLocation> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      (error) => {
        console.error('Erro ao acessar localização precisa:', error);
        reject(error);
      },
      { enableHighAccuracy: true }
    );
  });
};

// Notificações
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.error('Erro ao solicitar permissão de notificação:', error);
    throw error;
  }
};

export const showNotification = (title: string, options?: NotificationOptions): Notification => {
  return new Notification(title, options);
};

// Área de transferência
export const writeToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Erro ao escrever na área de transferência:', error);
    throw error;
  }
};

export const readFromClipboard = async (): Promise<string> => {
  try {
    return await navigator.clipboard.readText();
  } catch (error) {
    console.error('Erro ao ler da área de transferência:', error);
    throw error;
  }
};

// Definição de tipos para Bluetooth API que não estão presentes no TypeScript padrão
declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options: { 
        acceptAllDevices?: boolean;
        filters?: Array<{ services?: string[], name?: string }>;
      }): Promise<BluetoothDevice>;
    };
  }

  interface BluetoothDevice {
    id: string;
    name?: string;
    gatt?: any;
    watchingAdvertisements?: boolean;
  }
}

// Bluetooth
export const scanBluetoothDevices = async (): Promise<BluetoothDevice[]> => {
  try {
    if (!navigator.bluetooth) {
      throw new Error('API Bluetooth não suportada neste navegador');
    }
    
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true
    });
    return [device];
  } catch (error) {
    console.error('Erro ao escanear dispositivos Bluetooth:', error);
    throw error;
  }
};

// Sensores de movimento
export interface MotionData {
  acceleration: {
    x: number | null;
    y: number | null;
    z: number | null;
  };
  rotationRate: {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  };
}

export const startMotionCapture = (callback: (data: MotionData) => void): (() => void) => {
  const handleMotion = (event: DeviceMotionEvent) => {
    const data: MotionData = {
      acceleration: {
        x: event.accelerationIncludingGravity?.x ?? null,
        y: event.accelerationIncludingGravity?.y ?? null,
        z: event.accelerationIncludingGravity?.z ?? null
      },
      rotationRate: {
        alpha: event.rotationRate?.alpha ?? null,
        beta: event.rotationRate?.beta ?? null,
        gamma: event.rotationRate?.gamma ?? null
      }
    };
    callback(data);
  };

  window.addEventListener('devicemotion', handleMotion);
  return () => window.removeEventListener('devicemotion', handleMotion);
};
