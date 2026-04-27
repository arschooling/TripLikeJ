const V = 'tlj-v130';
const CACHE = [
  './', './index.html',
  './react.min.js', './react-dom.min.js',
  './firebase-sdk.min.js', './firebase.js',
  './dnd-hotel.js', './bundle.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(V).then(c => c.addAll(CACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
      .then(clients => Promise.all(
        // SW 쪽에서 직접 강제 리로드 (iOS Safari controllerchange 우회)
        clients.map(c => c.navigate ? c.navigate(c.url) : Promise.resolve())
      ))
  );
});

self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
