// ===============================
// Firebase imports (v9 – stable)
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ===============================
// Firebase configuration
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyBbtvvNkrWILfiOAZGBxNyEnLV5YOh9XyM",
  authDomain: "ncertcollege-push.firebaseapp.com",
  projectId: "ncertcollege-push",
  storageBucket: "ncertcollege-push.appspot.com",
  messagingSenderId: "435786162332",
  appId: "1:435786162332:web:6669c8056fd022f1378d5"
};

// ===============================
// VAPID Public Key
// ===============================
const VAPID_KEY = "BNzK5Gc-peJ4dkSg1HNUaqj50a2nY8G";

// ===============================
// Init Firebase
// ===============================
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const db = getFirestore(app);

// ===============================
// Register Service Worker
// ===============================
let swReg = null;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then(reg => {
      swReg = reg;
      console.log("✅ Service Worker registered");
    })
    .catch(err => console.error("❌ SW registration failed:", err));
}

// ===============================
// Enable Push Function
// ===============================
async function enablePush() {
  try {
    if (!("Notification" in window)) {
      alert("❌ Browser notification support nahi karta");
      return;
    }

    if (!swReg) {
      alert("❌ Service Worker ready nahi hai");
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
      alert("❌ Token generate nahi hua");
      return;
    }

    const ref = doc(db, "tokens", token);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        token,
        createdAt: Date.now()
      });
      console.log("✅ Token saved in Firestore");
    }

    alert("🔔 Push notification enabled successfully!");
  } catch (err) {
    console.error("❌ Push error:", err);
    alert("❌ Push error, console check karo");
  }
}

// ===============================
// Expose to Button (IMPORTANT)
// ===============================
window.enablePush = enablePush;
