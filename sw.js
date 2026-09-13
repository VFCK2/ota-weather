const CACHE = 'o-sora-v14-push';
const CORE = ['./', './index.html', './manifest.json', './apple-touch-icon.png', './firebase-config.js'];

importScripts('./firebase-config.js');
importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js');

let messaging = null;
try {
  const c = self.OSORA_FIREBASE_CONFIG || {};
  if (c.apiKey && c.projectId && c.messagingSenderId && c.appId && c.apiKey !== 'YOUR_API_KEY') {
    firebase.initializeApp(c);
    messaging = firebase.messaging();
    messaging.onBackgroundMessage(payload => {
      const n = payload.notification || {};
      const title = n.title || 'O-SORA';
      const options = {
        body: n.body || '通知があります。',
        icon: n.icon || './o-sora-icon-192.png',
        badge: './apple-touch-icon.png',
        data: n.click_action || './'
      };
      self.registration.showNotification(title, options);
    });
  }
} catch (e) {
  console.error('[O-SORA] Firebase Messaging init failed', e);
}

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = event.notification.data || './';
  event.waitUntil(clients.matchAll({type:'window', includeUncontrolled:true}).then(list => {
    for (const client of list) {
      if ('focus' in client) return client.focus();
    }
    return clients.openWindow(target);
  }));
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
