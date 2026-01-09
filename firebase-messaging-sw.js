// ===============================
// PWA + Firebase Service Worker (Fixed)
// ===============================
const CACHE_NAME = "ncertcollege-pwa-v1";

// -------------------------------
// Install
// -------------------------------
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// -------------------------------
// Activate
// -------------------------------
self.addEventListener("activate", (event) => {
  self.clients.claim();
});

// -------------------------------
// Fetch (no aggressive caching)
// -------------------------------
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // HTML / dynamic news ko cache nahi karna
  if (
    event.request.headers.get("accept")?.includes("text/html") ||
    event.request.url.includes("/news/")
  ) {
    return;
  }
});

// -------------------------------
// PUSH EVENT
// -------------------------------
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch (err) {
    data = { title: "NcertCollege Update", body: event.data.text(), url: "/" };
  }

  const title = data.title || "NcertCollege Update";
  const options = {
    body: data.body || "Latest news available",
    icon: "/assets/images/icon-192.png",
    badge: "/assets/images/icon-192.png",
    data: {
      url: data.url || "/"
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// -------------------------------
// NOTIFICATION CLICK
// -------------------------------
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if tab with same URL is already open
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // If not, open a new tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// -------------------------------
// OPTIONAL: Generic notification fallback
// -------------------------------
self.addEventListener("pushsubscriptionchange", async (event) => {
  console.log("🔄 Push subscription changed:", event);
  // You can re-subscribe here if needed
});
