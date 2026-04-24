// Service Worker para CODEOL Software Perú PWA
const CACHE_NAME = 'codeol-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin',
  '/admin-login',
  '/images/logooriginal.png',
  '/manifest.json',
  '/admin-manifest.json'
];

// Instalación - Precache recursos
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('Cache failed:', err);
      })
  );
  self.skipWaiting();
});

// Activación - Limpiar caches antiguas
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  event.waitUntil(self.clients.claim());
});

// Fetch - Network First con fallback a cache
self.addEventListener('fetch', (event) => {
  // Ignorar requests de analytics y supabase realtime
  if (event.request.url.includes('supabase.co') || 
      event.request.url.includes('google-analytics')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, cachearla
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, usar cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // Si no está en cache, devolver página offline
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Background Sync - Para sincronizar cuando hay conexión
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

// Periodics Background Sync - Para actualizar datos periódicamente
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-orders') {
    event.waitUntil(updateOrders());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Nueva notificación de CODEOL',
    icon: '/images/logooriginal.png',
    badge: '/images/logooriginal.png',
    tag: data.tag || 'codeol-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Abrir'
      },
      {
        action: 'close',
        title: 'Cerrar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'CODEOL Admin', options)
  );
});

// Click en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/admin')
    );
  }
});

// Funciones auxiliares
async function syncOrders() {
  // Sincronizar órdenes pendientes
  console.log('Syncing orders...');
}

async function updateOrders() {
  // Actualizar lista de órdenes
  console.log('Updating orders...');
}

// Mensajes desde la app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
