const V = 'tlj-v107';
// index.html은 캐시하지 않음 — 항상 네트워크에서 받아야 버전 감지가 동작함
const CACHE = [
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
      .then(keys => Promise.all(keys.filter(k => k !== V && k !== 'tlj-photos').map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
      .then(clients => clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' })))
  );
});

self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  // Firebase Storage 파일 — cache-first (티켓·QR코드 오프라인 지원)
  if (e.request.url.includes('firebasestorage.googleapis.com')) {
    e.respondWith(
      caches.open('tlj-photos').then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(res => {
            try { if (res.type === 'opaque' || res.ok) cache.put(e.request, res.clone()); } catch (_) {}
            return res;
          }).catch(() => cached || new Response(null, { status: 504, statusText: 'Offline' }));
        })
      )
    );
    return;
  }
  // 외부 API 요청(Foursquare, Firebase, Photon 등)은 SW가 가로채지 않음 (iOS 호환)
  if (!e.request.url.startsWith(self.location.origin)) return;
  // index.html(네비게이션): 항상 네트워크 우선, 5초 타임아웃 + 실패 시 캐시 fallback
  if (e.request.mode === 'navigate') {
    e.respondWith(
      Promise.race([
        fetch(e.request),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000)),
      ]).catch(() => caches.match('./index.html'))
    );
    return;
  }
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
  const unread = parseInt(data.data?.unread, 10);

  const tasks = [
    self.registration.showNotification(n.title || 'TripLikeJ', {
      body: n.body || '',
      icon: n.icon || './icon-192.png',
      badge: './icon-192.png',
      data: { url: data.fcmOptions?.link || './', unread },
    }),
  ];

  // 홈화면 아이콘 뱃지: feature detection 없이 try-catch로 (iOS SW 호환)
  const badgeTask = (async () => {
    try {
      if (unread > 0) await navigator.setAppBadge(unread);
      else            await navigator.setAppBadge();
    } catch (_) {}
  })();
  tasks.push(badgeTask);

  e.waitUntil(Promise.all(tasks));
});

// 푸시 알림 클릭 시 앱 열기
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || './';
  // SW 등록 스코프 기준 정확 매칭 — 'TripLikeJ' 부분 매칭은 다른 탭 잘못 잡을 수 있음
  const scope = self.registration.scope;
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      const c = cs.find(w => w.url.startsWith(scope));
      if (c) { c.focus(); c.navigate(url); }
      else clients.openWindow(url);
    })
  );
});
