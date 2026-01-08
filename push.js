// ===============================
// push.js (Working ES Module)
// ===============================

// Firebase imports (v9)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ===============================
// Firebase config
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyBbtvvNkrWILfiOAZGBxNyEnLV5YOh9XyM",
  authDomain: "ncertcollege-push.firebaseapp.com",
  projectId: "ncertcollege-push",
  storageBucket: "ncertcollege-push.appspot.com",
  messagingSenderId: "435786162332",
  appId: "1:435786162332:web:6669c8056fd022f1378d5"
};

const VAPID_KEY = "BNzK5Gc-peJ4dkSg1HNUaqj50a2nY8G";

// ===============================
// Initialize Firebase
// ===============================
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const db = getFirestore(app);

// ===============================
// Service Worker registration
// ===============================
let swReg = null;

async function registerSW() {
  if (!("serviceWorker" in navigator)) return null;

  try {
    swReg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("✅ Service Worker registered");
    return swReg;
  } catch (err) {
    console.error("❌ SW registration failed:", err);
    return null;
  }
}

// ===============================
// Enable push notifications
// ===============================
export async function enablePush() {
  try {
    if (!swReg) await registerSW();
    if (!swReg) {
      alert("❌ Service Worker not ready");
      return;
    }

    if (!("Notification" in window)) {
      alert("❌ Browser does not support notifications");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("🔕 Notification permission denied");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg
    });

    if (!token) {
      alert("❌ Token generation failed");
      return;
    }

    // Save token to Firestore
    const ref = doc(db, "tokens", token);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { token, createdAt: Date.now() });
      console.log("✅ Token saved in Firestore");
    }

    // Hide banner + store flag
    const banner = document.getElementById("push-banner");
    if (banner) banner.style.display = "none";
    localStorage.setItem("push-enabled", "true");

    alert("🔔 Push notifications enabled!");

  } catch (err) {
    console.error("❌ Push error:", err);
    alert("❌ Push setup failed, check console");
  }
}

// ===============================
// Attach button click + auto-hide
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("push-enable-btn");
  const banner = document.getElementById("push-banner");

  if (btn) btn.addEventListener("click", enablePush);

  // Hide banner if already enabled
  if (localStorage.getItem("push-enabled") === "true" && banner) {
    banner.style.display = "none";
  }
});

// ===============================
// Expose globally (optional)
window.enablePush = enablePush;
