import React, { useState } from 'react';

interface BluetoothDeviceInfo {
  id: string;
  name?: string;
}

const BluetoothAccess: React.FC = () => {
  const [devices, setDevices] = useState<BluetoothDeviceInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const scanDevices = async () => {
    setIsScanning(true);
    setError(null);
    
    if (!navigator.bluetooth) {
      setError('Bluetooth não é suportado por este navegador');
      setIsScanning(false);
      return;
    }
    
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true
      });
      
      setDevices(prev => {
        // Verificar se o dispositivo já existe na lista
        if (prev.some(d => d.id === device.id)) return prev;
        
        // Adicionar o novo dispositivo
        return [...prev, {
          id: device.id,
          name: device.name || 'Dispositivo sem nome'
        }];
      });
    } catch (err: any) {
      console.error('Erro ao escanear Bluetooth:', err);
      if (err.name === 'NotFoundError') {
        setError('Nenhum dispositivo Bluetooth encontrado');
      } else if (err.name === 'SecurityError') {
        setError('Acesso ao Bluetooth bloqueado. Verifique as permissões do navegador.');
      } else {
        setError(`Erro ao acessar Bluetooth: ${err.message}`);
      }
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="border border-hack-primary p-4 mb-6">
      <h3 className="text-xl text-hack-primary mb-3">Acesso a Bluetooth</h3>
      
      <div className="space-y-4">
        <button 
          onClick={scanDevices}
          disabled={isScanning}
          className={`py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary 
            ${isScanning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-hack-primary hover:text-hack-dark'}`}
        >
          {isScanning ? 'Escaneando dispositivos...' : 'Escanear Dispositivos Bluetooth'}
        </button>
        
        {error && (
          <div className="text-red-500 p-3 border border-red-500">
            {error}
          </div>
        )}
        
        {devices.length > 0 && (
          <div>
            <h4 className="text-lg text-hack-primary mb-2">Dispositivos encontrados:</h4>
            <ul className="border border-hack-primary p-2">
              {devices.map((device, index) => (
                <li key={index} className="border-b border-hack-primary last:border-b-0 p-2">
                  <div className="text-hack-primary">{device.name}</div>
                  <div className="text-hack-secondary text-sm">{device.id}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <p className="text-hack-secondary text-sm">
          Um site precisa de sua permissão explícita para acessar dispositivos Bluetooth.
          Alguns navegadores podem não suportar esta funcionalidade.
        </p>
      </div>
    </div>
  );
};

export default BluetoothAccess;
