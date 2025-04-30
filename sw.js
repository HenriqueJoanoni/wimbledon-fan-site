const CACHE_NAME = 'wimbledon-pwa-v4';
const OFFLINE_PAGE = 'offline.html';
const ASSETS = [
    '/',
    '/index.html',
    '/wimbledon-locations.html',
    '/contact-page.html',
    '/offline.html',
    '/manifest.json',
    '/assets/css/main.css',
    '/assets/js/index.js',
    '/assets/js/modal.js',
    '/assets/js/registered-components.js',
    '/assets/img/brazil-.png',
    '/assets/img/gettyimages-1407313293-2048x2048.webp',
    '/assets/img/gettyimages-1502975896-2048x2048.jpg',
    '/assets/img/pexels-joshsorenson-976866.jpg',
    '/assets/img/pexels-mikebirdy-9787553.jpg',
    '/assets/img/pexels-nubikini-385997.jpg',
    '/assets/img/spain.png',
    '/assets/img/tennis.png',
    '/assets/img/united-kingdom.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .catch(error => {
                console.error('Cache addAll failed:', error);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) return cachedResponse;

                if (event.request.mode === 'navigate') {
                    return fetch(event.request)
                        .catch(() => caches.match(OFFLINE_PAGE));
                }

                return fetch(event.request)
                    .then(response => {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, responseClone));
                        return response;
                    })
                    .catch(() => {
                        if (event.request.destination === 'document') {
                            return caches.match(OFFLINE_PAGE);
                        }
                        return new Response('Offline content unavailable');
                    });
            })
    );
});