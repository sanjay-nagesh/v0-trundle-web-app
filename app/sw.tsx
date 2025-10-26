/// <reference lib="webworker" />

const CACHE_NAME = "trundle-v1"
const STATIC_ASSETS = [
  "/",
  "/home",
  "/journey",
  "/map",
  "/library",
  "/profile",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
]

const sw = self as unknown as ServiceWorkerGlobalScope

sw.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  sw.skipWaiting()
})

sw.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    }),
  )
  sw.clients.claim()
})

sw.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    }),
  )
})
