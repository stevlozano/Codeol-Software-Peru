// Service Worker para CODEOL Software Perú PWA
const CACHE_NAME = 'codeol-admin-v1';

// Instalación
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

// Activación
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Fetch
self.addEventListener('fetch', (event) => {
  // Estrategia: Network First, luego Cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Push notifications (opcional)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/images/logooriginal.png',
    badge: '/images/logooriginal.png',
    tag: 'codeol-notification'
  };
  
  event.waitUntil(
    self.registration.showNotification('CODEOL Admin', options)
  );
});
