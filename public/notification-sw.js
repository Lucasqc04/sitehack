// Service Worker para notificações
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado!');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado!');
  return self.clients.claim();
});

// Ouvir mensagens do main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker recebeu mensagem:', event.data);
  
  if (event.data && event.data.type === 'NOTIFICATION') {
    self.registration.showNotification(event.data.title, event.data.options);
  }
});

// Lidar com clique na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('Notificação clicada');
  event.notification.close();
  
  // Focar na janela do cliente que enviou a notificação
  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then((clientList) => {
    for (const client of clientList) {
      if (client.url === '/' && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow('/');
    }
  }));
});
