// ============================================
//   auth.js — Alone Monster Coding Hub
//   Homepage: PUBLIC (login optional)
//   All other pages: LOGIN REQUIRED
//   Path: /auth.js (root mein rakho)
// ============================================

const firebaseConfig = {
  apiKey:            "AIzaSyBNeAqfrJ9fTjYUkWEpz-DZxOd9S1Rqp8c",
  authDomain:        "alone-monster-coding-hub.firebaseapp.com",
  projectId:         "alone-monster-coding-hub",
  storageBucket:     "alone-monster-coding-hub.firebasestorage.app",
  messagingSenderId: "92310923147",
  appId:             "1:92310923147:web:26a09f2aed09d9aef3718e",
  measurementId:     "G-4YPW7T4WGN"
};

// Firebase initialize
if (!firebase.apps || !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

// ── Pages jo bina login ke accessible hain ──
const PUBLIC_PAGES = [
  '/',
  '/index.html',
  '/login.html'
];

// Check karo current page public hai ya nahi
function isPublicPage() {
  const path = window.location.pathname;
  return PUBLIC_PAGES.some(p => {
    // Exact match ya ends with (e.g. /alone-monster.github.io/)
    return path === p || path.endsWith(p);
  });
}

// Body pehle hide karo — flicker avoid karne ke liye
// (Public pages pe yeh nahi karte taaki fast load ho)
if (!isPublicPage()) {
  document.body.style.visibility = 'hidden';
}

// ── Auth State Check ──
auth.onAuthStateChanged((user) => {

  if (isPublicPage()) {
    // ✅ PUBLIC PAGE — Kuch mat karo
    // User logged in hai ya nahi — dono theek hain
    // Page already visible hai
    return;
  }

  // PROTECTED PAGE
  if (!user) {
    // Login nahi kiya → login page pe bhejo
    // Current page yaad rakho taaki login ke baad wapas aayein
    const returnUrl = encodeURIComponent(window.location.pathname);
    window.location.href = '/login.html?return=' + returnUrl;
  } else {
    // Logged in hai → page dikhao
    document.body.style.visibility = 'visible';
  }

});
