const CACHE_NAME = 'stop-smoking-cache-v7';
const APP_ASSETS = [
  './',
  './index.html',
  './privacy.html',
  './styles.css',
  './script.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-192.svg',
  './icon-512.svg'
];

const NETWORK_FIRST_EXTENSIONS = ['.html', '.css', '.js', '.webmanifest'];

function isNetworkFirstRequest(requestUrl, requestMode) {
  if (requestMode === 'navigate') {
    return true;
  }
  return NETWORK_FIRST_EXTENSIONS.some(extension => requestUrl.pathname.endsWith(extension));
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);
    const freshResponse = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    cache.put(request, freshResponse.clone()).catch(() => undefined);
    return freshResponse;
  } catch {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    if (request.mode === 'navigate') {
      return caches.match('./index.html');
    }
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  const freshResponse = await fetch(request);
  cache.put(request, freshResponse.clone()).catch(() => undefined);
  return freshResponse;
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_ASSETS)).catch(() => undefined)
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }
  const requestUrl = new URL(event.request.url);

  // Do not intercept external origins (CDNs, third-party assets).
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  // Always bypass service worker for admin pages and API routes.
  // This avoids stale admin assets and invalid HTML fallback on JSON endpoints.
  if (requestUrl.pathname.startsWith('/api/') || requestUrl.pathname === '/admin.html' || requestUrl.pathname === '/admin.js') {
    return;
  }

  event.respondWith(
    isNetworkFirstRequest(requestUrl, event.request.mode)
      ? networkFirst(event.request)
      : cacheFirst(event.request)
  );
});

self.addEventListener('push', event => {
  let payload = {
    title: 'Calculateur d\'economies',
    body: 'Vous avez un rappel de votre suivi.',
  };
  try {
    payload = event.data ? event.data.json() : payload;
  } catch {
    payload = {
      title: 'Calculateur d\'economies',
      body: event.data ? event.data.text() : 'Vous avez un rappel de votre suivi.',
    };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      badge: './icon-192.png',
      icon: './icon-512.png',
      tag: payload.tag || 'stop-smoking-push',
      renotify: true,
      data: {
        url: './index.html'
      }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      const existingClient = windowClients.find(client => client.url.includes('index.html'));
      if (existingClient) {
        return existingClient.focus();
      }
      return clients.openWindow('./index.html');
    })
  );
});
