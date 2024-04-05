const CACHE_NAME = "my-cache-v1";
const urlsToCache = [
  "/",
  "./offline.html",
  "./assets/css/main.css",
  "assets/vendor/bootstrap/css/bootstrap.min.css",
  "assets/vendor/bootstrap-icons/bootstrap-icons.css",
  "assets/vendor/aos/aos.css",
  "assets/vendor/glightbox/css/glightbox.min.css",
  "assets/vendor/swiper/swiper-bundle.min.css",
  // Adicione mais URLs de recursos que você deseja armazenar em cache aqui
];

self.addEventListener("install", function (event) {
  // Perform installation steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Clone the request because it's a one-time use
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone the response because it's a one-time use
        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = ["pages-cache-v1", "blog-posts-cache-v1"];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
