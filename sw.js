const CACHE_NAME = 'focus-timer-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'https://fonts.googleapis.com/css?family=Lato:400,700',
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
  // Presets
  'images/touhoulake.jpg',
  'images/ignyourName.png',
  'images/degirled.png',
  'images/abandoned-trainstation.jpg'
];

// Install Service Worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Clean up old caches during activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Serve from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Optionally cache new images found during browsing
          if (event.request.url.includes('unsplash.com')) {
            cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        });
      });
    })
  );
});