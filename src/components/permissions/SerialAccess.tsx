import React, { useState } from 'react';

interface SerialPortInfo {
  usbVendorId?: number;
  usbProductId?: number;
}

const SerialAccess: React.FC = () => {
  const [ports, setPorts] = useState<SerialPortInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const requestSerialPort = async () => {
    setIsRequesting(true);
    setError(null);

    const serialNavigator = navigator as Navigator & {
      serial?: {
        requestPort: () => Promise<any>;
      };
    };

    if (!serialNavigator.serial) {
      setError('Web Serial não é suportado por este navegador.');
      setIsRequesting(false);
      return;
    }

    try {
      const port = await serialNavigator.serial.requestPort();
      const info = port.getInfo?.() as SerialPortInfo | undefined;

      setPorts((prev) => [
        ...prev,
        {
          usbVendorId: info?.usbVendorId,
          usbProductId: info?.usbProductId
        }
      ]);
    } catch (err: any) {
      console.error('Erro ao acessar Serial:', err);
      if (err.name === 'NotFoundError') {
        setError('Nenhuma porta serial selecionada.');
      } else if (err.name === 'SecurityError') {
        setError('Acesso serial bloqueado. Verifique as permissões do navegador.');
      } else {
        setError(`Erro ao acessar Serial: ${err.message}`);
      }
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="hack-panel mb-6">
      <h3 className="hack-title">Acesso a Portas Seriais</h3>

      <div className="space-y-4">
        <button
          onClick={requestSerialPort}
          disabled={isRequesting}
          className={`py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary 
            ${isRequesting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-hack-primary hover:text-hack-dark'}`}
        >
          {isRequesting ? 'Solicitando acesso...' : 'Selecionar porta serial'}
        </button>

        {error && (
          <div className="text-red-500 p-3 border border-red-500">
            {error}
          </div>
        )}

        {ports.length > 0 && (
          <div>
            <h4 className="text-lg text-hack-primary mb-2">Portas autorizadas:</h4>
            <ul className="border border-hack-primary p-2">
              {ports.map((port, index) => (
                <li key={`${port.usbVendorId}-${port.usbProductId}-${index}`} className="border-b border-hack-primary last:border-b-0 p-2">
                  <div className="text-hack-primary">Porta Serial</div>
                  <div className="text-hack-secondary text-sm">
                    Vendor ID: {port.usbVendorId ?? 'N/D'} | Product ID: {port.usbProductId ?? 'N/D'}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-hack-secondary text-sm">
          O acesso a portas seriais permite comunicação direta com dispositivos conectados, exigindo sua permissão.
        </p>
      </div>
    </div>
  );
};

export default SerialAccess;
