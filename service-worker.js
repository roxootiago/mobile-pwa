

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
