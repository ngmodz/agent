// Service Worker for Agent PWA

const CACHE_NAME = 'agent-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './services.json',
  './manifest.json',
  './offline.html',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  'https://iili.io/3g5x9Xs.png' // Favicon
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
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
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Clone the request - a request can only be used once
        const fetchRequest = event.request.clone();
        
        // Otherwise fetch from network
        return fetch(fetchRequest)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response - a response can only be used once
            const responseToCache = response.clone();
            
            // Store the response in cache for later
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            console.log('Fetch failed:', error);
            
            // Check if the request is for a page (HTML)
            if (event.request.mode === 'navigate') {
              return caches.match('./offline.html');
            }
            
            // For other resources, just return a simple error
            return new Response('Network error occurred. Please check your connection.');
          });
      })
  );
}); 