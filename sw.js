const CACHE_NAME = "nauman-labs-crm-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./login.html",
  "./manifest.json",
  "./logo.png",
  "./style.css"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
