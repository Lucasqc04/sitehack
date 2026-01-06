import React, { useState } from 'react';

interface UsbDeviceInfo {
  productName?: string;
  vendorId?: number;
  productId?: number;
}

const UsbAccess: React.FC = () => {
  const [devices, setDevices] = useState<UsbDeviceInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const requestUsbDevice = async () => {
    setIsRequesting(true);
    setError(null);

    const usbNavigator = navigator as Navigator & {
      usb?: {
        requestDevice: (options: { filters: Array<{ vendorId?: number; productId?: number }> }) => Promise<any>;
      };
    };

    if (!usbNavigator.usb) {
      setError('WebUSB não é suportado por este navegador.');
      setIsRequesting(false);
      return;
    }

    try {
      const device = await usbNavigator.usb.requestDevice({ filters: [] });
      setDevices((prev) => [
        ...prev,
        {
          productName: device.productName || 'Dispositivo sem nome',
          vendorId: device.vendorId,
          productId: device.productId
        }
      ]);
    } catch (err: any) {
      console.error('Erro ao acessar USB:', err);
      if (err.name === 'NotFoundError') {
        setError('Nenhum dispositivo USB selecionado.');
      } else if (err.name === 'SecurityError') {
        setError('Acesso ao USB bloqueado. Verifique as permissões do navegador.');
      } else {
        setError(`Erro ao acessar USB: ${err.message}`);
      }
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="hack-panel mb-6">
      <h3 className="hack-title">Acesso a USB</h3>

      <div className="space-y-4">
        <button
          onClick={requestUsbDevice}
          disabled={isRequesting}
          className={`py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary 
            ${isRequesting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-hack-primary hover:text-hack-dark'}`}
        >
          {isRequesting ? 'Solicitando acesso...' : 'Selecionar dispositivo USB'}
        </button>

        {error && (
          <div className="text-red-500 p-3 border border-red-500">
            {error}
          </div>
        )}

        {devices.length > 0 && (
          <div>
            <h4 className="text-lg text-hack-primary mb-2">Dispositivos autorizados:</h4>
            <ul className="border border-hack-primary p-2">
              {devices.map((device, index) => (
                <li key={`${device.vendorId}-${device.productId}-${index}`} className="border-b border-hack-primary last:border-b-0 p-2">
                  <div className="text-hack-primary">{device.productName}</div>
                  <div className="text-hack-secondary text-sm">
                    Vendor ID: {device.vendorId ?? 'N/D'} | Product ID: {device.productId ?? 'N/D'}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-hack-secondary text-sm">
          Sites só podem acessar dispositivos USB quando você escolhe explicitamente um dispositivo.
        </p>
      </div>
    </div>
  );
};

export default UsbAccess;
