/* ===============================
   NCERTCollege PWA + Push SW
   SEO & Google News Safe
================================ */

const CACHE_NAME = "ncertcollege-static-v1";

/* 🔹 Install */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/assets/css/style.css",
        "/assets/js/main.js",
        "/assets/js/category.js",
        "/assets/images/logo.png"
      ]);
    })
  );
  self.skipWaiting();
});

/* 🔹 Activate */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

/* 🔹 Fetch (HTML / News pages NOT cached) */
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // ❌ News & HTML ko cache nahi karna
  if (
    event.request.url.includes("/news/") ||
    event.request.headers.get("accept")?.includes("text/html")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

/* 🔔 Push Notification */
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/assets/images/logo.png",
    badge: "/assets/images/logo.png",
    data: {
      url: data.url || "/"
    }
  });
});

/* 👉 Notification Click */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(event.notification.data.url);
    })
  );
});
