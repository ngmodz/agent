// Service Worker for Agent PWA

// Increment cache version to invalidate previous caches
const CACHE_NAME = 'agent-cache-v5';

// Files that should be cached but can be served from network first
const NETWORK_FIRST_ASSETS = [
  './',
  './index.html',
  './image.html',
  './style.css',
  './script.js',
  './image.js',
  './services.json'
];

// Files that can be cached and served from cache first (static assets)
const CACHE_FIRST_ASSETS = [
  './manifest.json',
  './offline.html',
  './icons/viralgurux-192x192.png',
  './icons/viralgurux-512x512.png',
  './apple-touch-icon.png'
];

// Combine both for installation
const ASSETS_TO_CACHE = [...NETWORK_FIRST_ASSETS, ...CACHE_FIRST_ASSETS];

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

// Activate event - clean up old caches and notify clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),

      // Take control of all clients immediately
      self.clients.claim(),

      // Notify all clients about the update
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'CACHE_UPDATED',
            cacheName: CACHE_NAME,
            timestamp: Date.now()
          });
        });
      })
    ])
  );
});

// Fetch event - implement different strategies based on the resource
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Check if this is a request for a dynamic asset that should use network-first strategy
  const isNetworkFirstAsset = NETWORK_FIRST_ASSETS.some(asset =>
    url.pathname.endsWith(asset.replace('./', '/')) ||
    (asset === './' && (url.pathname === '/' || url.pathname === ''))
  );

  if (isNetworkFirstAsset) {
    // Network-first strategy for dynamic content
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response
          const responseToCache = response.clone();

          // Cache the fresh response
          caches.open(CACHE_NAME)
            .then(cache => {
              // Add no-cache headers to the response before caching
              const modifiedResponse = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: (() => {
                  const newHeaders = new Headers(responseToCache.headers);
                  newHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                  newHeaders.set('Pragma', 'no-cache');
                  newHeaders.set('Expires', '0');
                  return newHeaders;
                })()
              });

              cache.put(event.request, modifiedResponse);
            });

          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }

              // If it's a navigation request, serve the offline page
              if (event.request.mode === 'navigate') {
                return caches.match('./offline.html');
              }

              return new Response('Network error occurred. Please check your connection.');
            });
        })
    );
  } else {
    // Cache-first strategy for static assets
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // If not in cache, fetch from network
          const fetchRequest = event.request.clone();

          return fetch(fetchRequest)
            .then(response => {
              // Don't cache if not a valid response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone the response
              const responseToCache = response.clone();

              // Store in cache for later
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            })
            .catch(error => {
              console.log('Fetch failed:', error);

              // For navigation requests, serve offline page
              if (event.request.mode === 'navigate') {
                return caches.match('./offline.html');
              }

              return new Response('Network error occurred. Please check your connection.');
            });
        })
    );
  }
});