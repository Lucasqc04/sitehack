import React, { useState } from 'react';

const NotificationAccess: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission | 'unknown'>(
    'Notification' in window ? Notification.permission : 'unknown'
  );
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      setError('Este navegador não suporta notificações');
      return;
    }

    setIsRequesting(true);
    setError(null);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        setNotificationSent(false);
      }
    } catch (err: any) {
      setError(`Erro ao solicitar permissão: ${err.message}`);
    } finally {
      setIsRequesting(false);
    }
  };

  const sendNotification = () => {
    if (permission !== 'granted') {
      setError('Permissão para notificações não concedida');
      return;
    }

    try {
      const notification = new Notification('Hack de Rastreamento', {
        body: 'Este é um exemplo de notificação que um site pode enviar com sua permissão.',
        icon: 'https://cdn-icons-png.flaticon.com/512/2092/2092757.png',
        tag: 'hack-tracking-demo'
      });

      notification.onclick = () => {
        console.log('Notificação clicada');
        window.focus();
      };

      setNotificationSent(true);
    } catch (err: any) {
      setError(`Erro ao enviar notificação: ${err.message}`);
    }
  };

  return (
    <div className="border border-hack-primary p-4 mb-6">
      <h3 className="text-xl text-hack-primary mb-3">Notificações Push</h3>
      
      <div className="space-y-4">
        {permission !== 'granted' && (
          <button 
            onClick={requestPermission}
            disabled={isRequesting || permission === 'denied'}
            className={`py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary 
              ${(isRequesting || permission === 'denied') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-hack-primary hover:text-hack-dark'}`}
          >
            {isRequesting ? 'Solicitando permissão...' : 'Solicitar Permissão para Notificações'}
          </button>
        )}
        
        {permission === 'granted' && (
          <div className="space-y-3">
            <p className="text-hack-primary">
              Permissão concedida. Você pode receber notificações deste site.
            </p>
            
            <button 
              onClick={sendNotification}
              className="py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary hover:bg-hack-primary hover:text-hack-dark"
            >
              Enviar Notificação de Teste
            </button>
            
            {notificationSent && (
              <p className="text-hack-secondary text-sm">
                Notificação enviada! Verifique se ela apareceu no seu sistema.
              </p>
            )}
          </div>
        )}
        
        {permission === 'denied' && (
          <div className="text-red-500 p-3 border border-red-500">
            Permissão para notificações foi negada. Você precisará alterar as configurações do navegador para permitir notificações deste site.
          </div>
        )}
        
        {permission === 'unknown' && (
          <div className="text-yellow-500">
            Este navegador não suporta notificações ou ocorreu um erro ao verificar o status.
          </div>
        )}
        
        {error && (
          <div className="text-red-500 p-3 border border-red-500">
            {error}
          </div>
        )}
        
        <div className="text-hack-secondary text-sm mt-2">
          <p>
            As notificações push permitem que sites enviem mensagens para seu dispositivo mesmo quando o site não está aberto.
            Isso é comumente usado para alertas, mensagens, e-mails ou atualizações importantes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationAccess;
