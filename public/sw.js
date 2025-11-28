const CACHE_NAME = 'lis-cache-v2'; // Updated version
const urlsToCache = [
    '/',
    '/index.html',
    '/admin.html',
    '/audit.html',
    '/polylabel.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js',
    'https://cdn.socket.io/4.7.5/socket.io.min.js',
    'https://unpkg.com/leaflet-textpath/leaflet.textpath.js',
    'https://unpkg.com/leaflet-geometryutil/src/leaflet.geometryutil.js',
    'https://unpkg.com/leaflet-easyprint@2.1.9/dist/bundle.js'
];

// Improved install event with better error handling
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache.map(url => {
                    try {
                        return new Request(url, { mode: 'no-cors' });
                    } catch (error) {
                        console.warn('Failed to create request for:', url, error);
                        return url;
                    }
                })).catch(error => {
                    console.error('Cache addAll failed:', error);
                    // Continue even if some resources fail to cache
                    return Promise.resolve();
                });
            })
            .then(() => {
                console.log('All resources cached successfully');
                return self.skipWaiting(); // Force activation
            })
    );
});

// Improved activate event for cache cleanup
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker activated');
            return self.clients.claim(); // Take control of all clients
        })
    );
});

// Enhanced fetch event with better strategies
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip cross-origin requests that we can't cache
    if (url.origin !== self.location.origin && 
        !url.href.includes('openstreetmap.org') &&
        !url.href.includes('unpkg.com') &&
        !url.href.includes('cdnjs.cloudflare.com') &&
        !url.href.includes('cdn.jsdelivr.net') &&
        !url.href.includes('cdn.socket.io')) {
        return;
    }

    // Strategy for different types of resources
    if (request.url.match(/(openstreetmap\.org|tile\.openstreetmap\.org|tileserver)/)) {
        // Map tiles - Cache First, then Network
        event.respondWith(serveMapTiles(request));
    } else if (request.url.match(/\/api\/(parcels|roads|auth|admin)/)) {
        // API requests - Network First, then Cache
        event.respondWith(serveAPI(request));
    } else {
        // Static assets - Cache First, then Network
        event.respondWith(serveStaticAssets(request));
    }
});

// Strategy for map tiles
async function serveMapTiles(request) {
    const cache = await caches.open(CACHE_NAME);
    
    try {
        // Try cache first
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // If not in cache, fetch from network
        const networkResponse = await fetch(request);
        
        // Cache the new tile (but don't wait for it)
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone()).catch(error => {
                console.warn('Failed to cache tile:', request.url, error);
            });
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('Tile fetch failed, serving offline message:', error);
        return new Response(
            JSON.stringify({ error: 'Offline: Map tile not available' }),
            { 
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Strategy for API requests
async function serveAPI(request) {
    const cache = await caches.open(CACHE_NAME);
    
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        // Cache successful GET responses (except for sensitive data)
        if (networkResponse.ok && request.method === 'GET' && 
            !request.url.includes('/api/auth/')) {
            cache.put(request, networkResponse.clone()).catch(error => {
                console.warn('Failed to cache API response:', request.url, error);
            });
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('API fetch failed, trying cache:', error);
        
        // If network fails, try cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // If nothing in cache, return error
        return new Response(
            JSON.stringify({ error: 'Offline: API not available' }),
            { 
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Strategy for static assets
async function serveStaticAssets(request) {
    const cache = await caches.open(CACHE_NAME);
    
    try {
        // Try cache first
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // If not in cache, fetch from network
        const networkResponse = await fetch(request);
        
        // Cache the response
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone()).catch(error => {
                console.warn('Failed to cache static asset:', request.url, error);
            });
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('Static asset fetch failed:', error);
        
        // For navigation requests, serve the app shell
        if (request.mode === 'navigate') {
            return cache.match('/index.html');
        }
        
        return new Response('Offline: Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Handle service worker messages
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
