// Service Worker for Viralgurux Agent
const CACHE_NAME = 'viralgurux-cache-v2'; // Increment version when making significant changes

// Files to cache for offline use
const urlsToCache = [
  '/',
  '/index.html',
  '/image.html',
  '/history.html',
  '/offline.html',
  '/style.css',
  '/script.js',
  '/image.js',
  '/history.js',
  '/supabaseClient.js',
  '/page-transitions.js',
  '/reload.js',
  '/version.js',
  '/manifest.json',
  '/apple-touch-icon.png',
  '/icons/viralgurux-192x192.png',
  '/icons/viralgurux-512x512.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// Install event - cache files
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...', event);
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[Service Worker] Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...', event);
  
  // Take control of all clients as soon as the service worker activates
  event.waitUntil(self.clients.claim());
  
  // Remove old caches
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Removing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('cdn.jsdelivr.net')) {
    return;
  }
  
  // Skip Supabase API requests
  if (event.request.url.includes('supabase.co')) {
    return;
  }
  
  // For HTML pages, use network-first strategy
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the latest version
          let responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
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
              // If not in cache, serve offline page
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }
  
  // For other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cached response
          return cachedResponse;
        }
        
        // If not in cache, fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache if response is not valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Cache the new response
            let responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
            
            return response;
          })
          .catch(error => {
            console.error('[Service Worker] Fetch failed:', error);
            
            // For image requests, return a fallback image
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('/icons/viralgurux-192x192.png');
            }
            
            // For JS/CSS, just propagate the error
            throw error;
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline operations
self.addEventListener('sync', event => {
  if (event.tag === 'sync-offline-images') {
    event.waitUntil(syncOfflineImages());
  }
});

// Function to sync offline images when back online
async function syncOfflineImages() {
  try {
    // Check if we have any offline images to sync
    const offlineImages = JSON.parse(localStorage.getItem('offlineImages') || '[]');
    
    if (offlineImages.length === 0) {
      return;
    }
    
    console.log('[Service Worker] Syncing offline images...');
    
    // Notify all clients that we're syncing
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_STARTED',
        count: offlineImages.length
      });
    });
    
    // We'll implement the actual sync logic in the client-side code
    // since the service worker doesn't have direct access to the Supabase client
    
    // For now, just notify clients to handle the sync
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_OFFLINE_IMAGES',
        images: offlineImages
      });
    });
    
  } catch (error) {
    console.error('[Service Worker] Error syncing offline images:', error);
  }
}