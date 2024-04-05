// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "pwabuilder-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
/* const offlineFallbackPage = [
  "./offline.html",
  "./assets/css/main.css",
  "./assets/vendor/bootstrap/css/bootstrap.min.css",
  "./assets/vendor/bootstrap-icons/bootstrap-icons.css",
  "./assets/vendor/aos/aos.css",
  "./assets/vendor/glightbox/css/glightbox.min.css",
  "./assets/vendor/swiper/swiper-bundle.min.css",
]; */


self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        cache.add([
          "./offline.html",
          "./assets/css/main.css",
          "./assets/vendor/bootstrap/css/bootstrap.min.css",
          "./assets/vendor/bootstrap-icons/bootstrap-icons.css",
          "./assets/vendor/aos/aos.css",
          "./assets/vendor/glightbox/css/glightbox.min.css",
          "./assets/vendor/swiper/swiper-bundle.min.css",
        ])
      )
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;

          if (preloadResp) {
            return preloadResp;
          }

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE);

          // Tente corresponder individualmente a cada recurso CSS
          const cachedMainCss = await cache.match("./assets/css/main.css");
          const cachedBootstrapCss = await cache.match(
            "./assets/vendor/bootstrap/css/bootstrap.min.css"
          );
          const cachedBootstrapIconsCss = await cache.match(
            "./assets/vendor/bootstrap-icons/bootstrap-icons.css"
          );
          const cachedAosCss = await cache.match("./assets/vendor/aos/aos.css");
          const cachedGlightboxCss = await cache.match(
            "./assets/vendor/glightbox/css/glightbox.min.css"
          );
          const cachedSwiperCss = await cache.match(
            "./assets/vendor/swiper/swiper-bundle.min.css"
          );

          // Retorna o recurso CSS do cache, se disponível
          if (
            cachedMainCss &&
            cachedBootstrapCss &&
            cachedBootstrapIconsCss &&
            cachedAosCss &&
            cachedGlightboxCss &&
            cachedSwiperCss
          ) {
            return new Response(
              new Blob([
                cachedMainCss.body,
                cachedBootstrapCss.body,
                cachedBootstrapIconsCss.body,
                cachedAosCss.body,
                cachedGlightboxCss.body,
                cachedSwiperCss.body,
              ]),
              {
                headers: {
                  "Content-Type": "text/css",
                },
              }
            );
          }

          // Se nenhum recurso CSS for encontrado no cache, retorne offline.html
          const cachedResp = await cache.match("./offline.html");
          return cachedResp;
        }
      })()
    );
  }
});
