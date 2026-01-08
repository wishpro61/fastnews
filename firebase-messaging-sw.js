const CACHE = "ncertcollege-pwa-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // ❌ HTML / news ko cache nahi karna
  if (
    event.request.headers.get("accept")?.includes("text/html") ||
    event.request.url.includes("/news/")
  ) {
    return;
  }
});

/* PUSH */
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  self.registration.showNotification(data.title || "NCERT College", {
    body: data.body || "Latest update available",
    icon: "/assets/images/icon-192.png",
    badge: "/assets/images/icon-192.png",
    data: { url: data.url || "/" }
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
