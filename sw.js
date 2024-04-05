  var cacheName = "pwaTeste+-v1.0";

  self.addEventListener("install", (event) => {
    self.skipWaiting();

    event.waitUntil(
      caches
        .open(cacheName)
        .then((cache) =>
          cache.addAll([
            "./offline.html",

            "./assets/",
          ])
        )
    );
  });

  self.addEventListener("message", function (event) {
    if (event.data.action === "skipWaiting") {
      self.skipWaiting();
    }
  });

  self.addEventListener("fetch", function (event) {
    //Atualizacao internet
    event.respondWith(
      (async function () {
        try {
          return await fetch(event.request);
        } catch (err) {
          return caches.match(event.request);
        }
      })()
    );

    //Atualizacao cache
    /*event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );*/
  });