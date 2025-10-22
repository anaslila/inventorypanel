// ============================================
// MICL Live Inventory Panel v1.1
// Service Worker - Offline Support & Caching
// ============================================

const CACHE_NAME = 'micl-inventory-v1.1';
const RUNTIME_CACHE = 'micl-runtime-v1.1';

// Assets to cache on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://i.postimg.cc/W4fwJm7g/image.png',
    'https://newprojectsonline.com/assets/uploads/logos/1669592710-micl-aaradhya-parkwood-Logo-new1.jpg'
];

// API endpoints to handle specially
const API_URL = 'https://script.google.com/macros/s/AKfycby-gPsGojstSyFN0f5E30Ip7HOfQemIS5l4e2WtfpsdQlsVcBNbNcFIIy06-Tq62MVUJQ/exec';

// ============================================
// INSTALL - Cache essential assets
// ============================================

self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Service Worker: Caching essential assets');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker: Installation complete');
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error('❌ Service Worker: Installation failed', error);
            })
    );
});

// ============================================
// ACTIVATE - Clean up old caches
// ============================================

self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activation complete');
                return self.clients.claim(); // Take control immediately
            })
    );
});

// ============================================
// FETCH - Network-first strategy with fallback
// ============================================

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Handle API requests separately
    if (request.url.includes(API_URL)) {
        event.respondWith(handleApiRequest(request));
        return;
    }
    
    // Handle Google Fonts
    if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
        event.respondWith(handleFontRequest(request));
        return;
    }
    
    // Handle Font Awesome
    if (url.origin === 'https://cdnjs.cloudflare.com') {
        event.respondWith(handleCDNRequest(request));
        return;
    }
    
    // Handle images
    if (request.destination === 'image') {
        event.respondWith(handleImageRequest(request));
        return;
    }
    
    // Default: Cache-first strategy for static assets
    event.respondWith(handleStaticRequest(request));
});

// ============================================
// API REQUESTS - Network-first with cache fallback
// ============================================

async function handleApiRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        // If successful, update cache and return
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('📡 Service Worker: API response cached');
        }
        
        return networkResponse;
        
    } catch (error) {
        // Network failed, try cache
        console.log('⚠️ Service Worker: Network failed, trying cache');
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            console.log('📦 Service Worker: Serving API from cache');
            return cachedResponse;
        }
        
        // Return offline page or error
        return new Response(
            JSON.stringify({
                error: true,
                message: 'No internet connection. Please check your network.',
                offline: true
            }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 503
            }
        );
    }
}

// ============================================
// STATIC ASSETS - Cache-first strategy
// ============================================

async function handleStaticRequest(request) {
    // Check cache first
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        console.log('📦 Service Worker: Serving from cache:', request.url);
        return cachedResponse;
    }
    
    // Not in cache, fetch from network
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            console.log('💾 Service Worker: Cached new resource:', request.url);
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('❌ Service Worker: Fetch failed:', error);
        
        // Return offline fallback for HTML pages
        if (request.destination === 'document') {
            return caches.match('/index.html');
        }
        
        return new Response('Offline', { status: 503 });
    }
}

// ============================================
// FONT REQUESTS - Cache-first, long-term
// ============================================

async function handleFontRequest(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        console.error('Font fetch failed:', error);
        return new Response('Font unavailable', { status: 503 });
    }
}

// ============================================
// CDN REQUESTS - Cache-first for Font Awesome
// ============================================

async function handleCDNRequest(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        console.error('CDN fetch failed:', error);
        return new Response('Resource unavailable', { status: 503 });
    }
}

// ============================================
// IMAGE REQUESTS - Cache-first with fallback
// ============================================

async function handleImageRequest(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('Image fetch failed:', error);
        // Return a placeholder or cached fallback
        return caches.match('https://i.postimg.cc/W4fwJm7g/image.png');
    }
}

// ============================================
// BACKGROUND SYNC (Optional - future enhancement)
// ============================================

self.addEventListener('sync', (event) => {
    console.log('🔄 Service Worker: Background sync triggered');
    
    if (event.tag === 'sync-inventory') {
        event.waitUntil(syncInventoryData());
    }
});

async function syncInventoryData() {
    try {
        console.log('🔄 Service Worker: Syncing inventory data...');
        const response = await fetch(`${API_URL}?action=getData&t=${Date.now()}`);
        
        if (response.ok) {
            const data = await response.json();
            const cache = await caches.open(RUNTIME_CACHE);
            const cacheResponse = new Response(JSON.stringify(data));
            await cache.put(API_URL, cacheResponse);
            console.log('✅ Service Worker: Inventory data synced');
        }
    } catch (error) {
        console.error('❌ Service Worker: Sync failed', error);
    }
}

// ============================================
// PUSH NOTIFICATIONS (Optional - future enhancement)
// ============================================

self.addEventListener('push', (event) => {
    console.log('🔔 Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New inventory update available',
        icon: 'https://i.postimg.cc/W4fwJm7g/image.png',
        badge: 'https://i.postimg.cc/W4fwJm7g/image.png',
        vibrate: [200, 100, 200],
        tag: 'inventory-update',
        requireInteraction: false
    };
    
    event.waitUntil(
        self.registration.showNotification('MICL Inventory Update', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification clicked');
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

// ============================================
// MESSAGE HANDLER (For cache clearing from app)
// ============================================

self.addEventListener('message', (event) => {
    console.log('💬 Service Worker: Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        return caches.delete(cacheName);
                    })
                );
            }).then(() => {
                console.log('✅ Service Worker: All caches cleared');
                event.ports[0].postMessage({ success: true });
            })
        );
    }
});

console.log('✅ Service Worker v1.1 loaded');
