self.addEventListener("install", (event) => {
  console.log("Service worker installed.");
});

self.addEventListener("fetch", (event) => {
  // Default pass-through
  event.respondWith(fetch(event.request));
});
