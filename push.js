<script type="module">
  // -----------------------------
  // Firebase imports (v12)
  // -----------------------------
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging.js";
  import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

  // -----------------------------
  // Firebase configuration
  // -----------------------------
  const firebaseConfig = {
    apiKey: "AIzaSyBbtvvNkrWILfiOAZGBxNyEnLV5YOh9XyM",
    authDomain: "ncertcollege-push.firebaseapp.com",
    projectId: "ncertcollege-push",
    storageBucket: "ncertcollege-push.firebasestorage.app",
    messagingSenderId: "435786162332",
    appId: "1:435786162332:web:6669c8056fd022f1378d59"
  };

  // -----------------------------
  // VAPID Public Key
  // -----------------------------
  const VAPID_KEY = "BNzK5Gc-peJ4dkSg1HNUaqj50a2nY8GbznqxJ-I_ZPjX4CHP2wixWSS9iUutSOBv7YA3ZZTDWVk17ptoSaTdCO4";

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const db = getFirestore(app);

  // -----------------------------
  // Service Worker register
  // -----------------------------
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.error('SW registration failed:', err));
  }

  // -----------------------------
  // Enable Push Function
  // -----------------------------
  async function enablePush() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('🔕 Permission denied for push notifications');
        return;
      }

      const swReg = await navigator.serviceWorker.ready;

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swReg
      });

      if (!token) {
        alert('❌ Push token generate nahi hua');
        return;
      }

      // -----------------------------
      // Deduplicate token in Firestore
      // -----------------------------
      const ref = doc(db, 'tokens', token);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, { token, createdAt: Date.now() });
        console.log('✅ Token saved in Firestore');
      } else {
        console.log('ℹ️ Token already exists');
      }

      alert('🔔 News alerts enabled successfully!');
    } catch (err) {
      console.error('Push enable error:', err);
      alert('❌ Something went wrong, check console');
    }
  }

  // Expose function to window for HTML button
  window.enablePush = enablePush;
</script>
