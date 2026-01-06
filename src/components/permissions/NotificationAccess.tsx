import React, { useState, useEffect } from 'react';

const NotificationAccess: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission | 'unknown'>(
    'Notification' in window ? Notification.permission : 'unknown'
  );
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [serviceWorkerSupported, setServiceWorkerSupported] = useState(false);
  const [isSecureContext, setIsSecureContext] = useState(true);

  // Verificar se é dispositivo Android
  useEffect(() => {
    const isAndroidDevice = /Android/i.test(navigator.userAgent);
    setIsAndroid(isAndroidDevice);
    
    // Verificar se o navegador suporta Service Worker (necessário para notificações em Android)
    setServiceWorkerSupported('serviceWorker' in navigator);
    setIsSecureContext(window.isSecureContext);
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      setError('Este navegador não suporta notificações');
      return;
    }

    if (!isSecureContext) {
      setError('Notificações exigem uma conexão segura (HTTPS ou localhost).');
      return;
    }

    setIsRequesting(true);
    setError(null);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        setNotificationSent(false);
        
        // Registrar Service Worker para Android (necessário para notificações)
        if (isAndroid && serviceWorkerSupported) {
          try {
            await navigator.serviceWorker.register('/notification-sw.js');
            await navigator.serviceWorker.ready;
            console.log('Service Worker registrado para notificações');
          } catch (err) {
            console.error('Erro ao registrar Service Worker:', err);
          }
        }
      }
    } catch (err: any) {
      setError(`Erro ao solicitar permissão: ${err.message}`);
    } finally {
      setIsRequesting(false);
    }
  };

  const sendNotification = async () => {
    if (permission !== 'granted') {
      setError('Permissão para notificações não concedida');
      return;
    }

    if (!isSecureContext) {
      setError('Notificações exigem uma conexão segura (HTTPS ou localhost).');
      return;
    }

    try {
      // Opções específicas para Android usando asserção de tipo para contornar limitações de tipagem
      const options = {
        body: 'Este é um exemplo de notificação que um site pode enviar com sua permissão.',
        icon: 'https://cdn-icons-png.flaticon.com/512/2092/2092757.png',
        tag: 'hack-tracking-demo',
        vibrate: [100, 50, 100], // Padrão de vibração: vibra, pausa, vibra
        timestamp: Date.now(),
        requireInteraction: true // Mantém a notificação até o usuário interagir
      } as NotificationOptions; // Usar asserção de tipo para evitar erro de tipagem
      
      // Usar Service Worker para Android se disponível
      if (serviceWorkerSupported) {
        const registration = await navigator.serviceWorker.ready;
        if (registration?.showNotification) {
          await registration.showNotification('Hack de Rastreamento', options);
        } else {
          const notification = new Notification('Hack de Rastreamento', options);
          notification.onclick = () => {
            console.log('Notificação clicada');
            window.focus();
          };
        }
      } else {
        // Notificação padrão
        const notification = new Notification('Hack de Rastreamento', options);
        
        notification.onclick = () => {
          console.log('Notificação clicada');
          window.focus();
        };
      }

      setNotificationSent(true);
    } catch (err: any) {
      setError(`Erro ao enviar notificação: ${err.message}`);
    }
  };

  return (
    <div className="hack-panel mb-6">
      <h3 className="hack-title">Notificações Push</h3>
      
      <div className="space-y-4">
        {!isSecureContext && (
          <div className="text-yellow-500 p-3 border border-yellow-500">
            Este recurso exige HTTPS (ou localhost). Em conexões não seguras, as notificações podem falhar.
          </div>
        )}
        {isAndroid && (
          <div className="hack-panel bg-opacity-30">
            <p className="text-hack-primary">
              <span className="text-xl mr-2">📱</span> 
              Detectado dispositivo Android
            </p>
            {serviceWorkerSupported ? (
              <p className="text-hack-secondary text-sm mt-1">
                Seu navegador suporta notificações via Service Worker
              </p>
            ) : (
              <p className="text-yellow-500 text-sm mt-1">
                Para melhor suporte a notificações, use um navegador que suporte Service Workers
              </p>
            )}
          </div>
        )}
        
        {permission !== 'granted' && (
          <button 
            onClick={requestPermission}
            disabled={isRequesting || permission === 'denied'}
            className={`hack-btn w-full sm:w-auto
              ${(isRequesting || permission === 'denied') ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              className="hack-btn w-full sm:w-auto"
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
