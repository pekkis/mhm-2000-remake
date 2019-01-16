/* global self, clients */
/* eslint no-restricted-globals: ["off", "error"] */

const { assets } = global.serviceWorkerOption;

const CACHE_NAME = new Date().toISOString();

const assetsToCache = [...assets, "./"].map(path => {
  return new URL(path, global.location).toString();
});

// When the service worker is first added to a computer.
self.addEventListener("install", e => {
  self.skipWaiting();

  if (process.env.REACT_APP_SW_DISABLE) {
    console.log("SW DEBUG, skipping cache");
    return;
  }

  e.waitUntil(
    global.caches
      .open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(assetsToCache);
      })
      .then(() => {
        console.log("Cached assets: main", assetsToCache);
      })
      .catch(error => {
        console.error("Error doing the cache", error);
        throw error;
      })
  );
});

self.addEventListener("activate", e => {
  console.log("Activating service worker");
  e.waitUntil(
    global.caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.indexOf(CACHE_NAME) === 0) {
            return null;
          }
          console.log("DELETORE", cacheName);
          return global.caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener("fetch", event => {
  if (process.env.REACT_APP_SW_DISABLE) {
    console.log("SW debug, skipping fetch");
    return;
  }

  const request = event.request;

  // Ignore not GET request.
  if (request.method !== "GET") {
    console.log(`[SW] Ignore non GET request ${request.method}`);
    return;
  }

  const requestUrl = new URL(request.url);

  // Ignore difference origin.
  if (requestUrl.origin !== location.origin) {
    console.log(`[SW] Ignore difference origin ${requestUrl.origin}`);
    return;
  }

  const resource = global.caches.match(request).then(response => {
    if (response) {
      console.log(`[SW] fetch URL ${requestUrl.href} from cache`);
      return response;
    }

    // Load and cache known assets.
    return fetch(request)
      .then(responseNetwork => {
        if (!responseNetwork || !responseNetwork.ok) {
          console.log(
            `[SW] URL [${requestUrl.toString()}] wrong responseNetwork: ${
              responseNetwork.status
            } ${responseNetwork.type}`
          );

          return responseNetwork;
        }

        const responseCache = responseNetwork.clone();

        global.caches
          .open(CACHE_NAME)
          .then(cache => {
            return cache.put(request, responseCache);
          })
          .then(() => {
            console.log(`[SW] Cache asset: ${requestUrl.href}`);
          });

        return responseNetwork;
      })
      .catch(() => {
        // User is landing on our page.
        if (event.request.mode === "navigate") {
          return global.caches.match("./");
        }

        return null;
      });
  });

  event.respondWith(resource);
});
