const V = 'tlj-v226';
// index.html은 캐시하지 않음 — 항상 네트워크에서 받아야 버전 감지가 동작함
const CACHE = V;

// 첫 방문 시 미리 받아둘 핵심 정적 파일 (렌더 블로킹 스크립트 + 폰트)
// addAll은 하나라도 실패하면 전체 실패하므로 개별 add + catch로 관대하게 처리
const PRECACHE = [
  './react.min.js',
  './react-dom.min.js',
  './firebase-sdk.min.js',
  './firebase-messaging.js',
  './firebase.js',
  './dnd-hotel.js',
  './bundle.min.js',
  './adam-light.otf',
  './adam-medium.otf',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.all(PRECACHE.map(u => c.add(u).catch(() => {}))))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// index.html의 checkWaiting()이 대기 중 SW에 보내는 신호 — 즉시 활성화
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// 같은 오리진의 정적 GET 자산만 cache-first.
// index.html·sw.js·네비게이션·크로스오리진(파이어베이스/스토리지/CDN)은 항상 네트워크.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const path = url.pathname;
  if (path.endsWith('/') || path.endsWith('/index.html') || path.endsWith('/sw.js')) return;

  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
        }
        return res;
      });
    })
  );
});
