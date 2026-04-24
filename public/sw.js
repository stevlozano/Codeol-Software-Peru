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
        // Cachear la respuesta exitosa
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Si falla la red, buscar en cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si no está en cache, retornar error simple
          return new Response('Network error', { 
            status: 408, 
            statusText: 'Network error' 
          });
        });
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
