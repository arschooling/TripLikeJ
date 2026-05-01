const V = 'tlj-v404';
const CACHE = [
  './', './index.html',
  './react.min.js', './react-dom.min.js',
  './firebase-sdk.min.js', './firebase-messaging.js', './firebase.js',
  './dnd-hotel.js', './bundle.min.js',
  './adam-light.otf', './adam-medium.otf',
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
      .then(clients => clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' })))
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

// FCM 백그라운드 푸시 수신
self.addEventListener('push', e => {
  if (!e.data) return;
  let data = {};
  try { data = e.data.json(); } catch (_) { data = { notification: { title: 'TripLikeJ', body: e.data.text() } }; }
  const n = data.notification || {};
  const badgeCount = parseInt(data.data?.badge, 10);

  const tasks = [
    self.registration.showNotification(n.title || 'TripLikeJ', {
      body: n.body || '',
      icon: n.icon || './icon-192.png',
      badge: './icon-192.png',
      data: { url: data.fcmOptions?.link || './' },
    }),
  ];

  // 홈화면 아이콘 뱃지: Cloud Function이 전달한 미읽음 수로 설정
  if ('setAppBadge' in navigator) {
    tasks.push(
      badgeCount > 0 ? navigator.setAppBadge(badgeCount) : navigator.setAppBadge()
    );
  }

  e.waitUntil(Promise.all(tasks));
});

// 푸시 알림 클릭 시 앱 열기
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || './';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      const c = cs.find(w => w.url.includes('TripLikeJ'));
      if (c) { c.focus(); c.navigate(url); }
      else clients.openWindow(url);
    })
  );
});
