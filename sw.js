// sw.js — Alone Monster Coding Hub Service Worker
const CACHE_NAME = 'am-hub-v1';
const OFFLINE_ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/favicon.ico',
  '/favicon.png',
  '/favicon-192.png',
  '/manifest.json',
  '/auth.js'
];

// Install — cache important files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — old caches clean karo
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — pehle cache check karo, nahi toh network se lo
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
      .catch(() => caches.match('/index.html'))
  );
});
