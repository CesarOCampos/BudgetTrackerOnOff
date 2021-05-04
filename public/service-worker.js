console.log("Hello from your service worker!");

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
"/",
"/manifest.webmanifest",
"/icons/icon-192x192.png",
"/icons/icon-512x512.png",
"/db.js",
"/index.html",
"/index.js",
"/styles.css",
];
//installation
self.addEventListener("install", (evt) => {
//
evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
    console.log("Your files were pre-cached successfully!");
    console.log(cache);
    return cache.addAll(FILES_TO_CACHE);
    })
);

// self.skipWaiting();
});

self.addEventListener("activate", function (evt) {
evt.waitUntil(
    caches.keys().then((keyList) => {
    return Promise.all(
        keyList.map((key) => {
        if (key !== CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
        }
        })
    );
    })
);

self.clients.claim();
});

// fetch  no api
self.addEventListener("fetch", function (evt) {
// cache successful requests to the API
evt.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
    return cache.match(evt.request).then((response) => {
        return response || fetch(evt.request);
    });
    })

    // if the request is not for the API, serve static assets using "offline-first" approach.
    // see https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-falling-back-to-network
);
});

// TODO: add listener and handler to retrieve static assets from the Cache Storage in the browser
