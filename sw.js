const CACHE_NAME = 'wimbledon-pwa-v1';
const OFFLINE_PAGE = '/offline.html';
const ASSETS = [
    '/',
    '/index.html',
    '/wimbledon-locations.html',
    '/assets/css/main.css',
    '/assets/js/index.js',
    '/assets/js/modal.js',
    '/assets/img/logo.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) return response;

                if (event.request.url.includes('/api/')) {
                    return fetch(event.request)
                        .catch(() => caches.match(OFFLINE_PAGE));
                }

                return fetch(event.request)
                    .then(res => {
                        const responseClone = res.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, responseClone));
                        return res;
                    })
                    .catch(() => caches.match(OFFLINE_PAGE));
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

const networkFirst = async (request) => {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        return caches.match(request);
    }
};

const cacheFirst = async (request) => {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
};

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(event.request));
    } else {
        event.respondWith(cacheFirst(event.request));
    }
});