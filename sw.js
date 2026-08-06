const CACHE_NAME = 'position-pro-v2';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './storage.js',
    './calculator.js',
    './bignumber.js',
    './manifest.webmanifest',
    './icon-128.png',
    './icon-192.png',
    './icon-512.png'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Activate Event (clean up old cache versions)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            )
        )
    );
});

// Fetch Event (Cache-First)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
