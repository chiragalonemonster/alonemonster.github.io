// ============================================
//   auth.js — Alone Monster Coding Hub
//   Homepage (root): PUBLIC — login optional
//   All other pages: LOGIN REQUIRED
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

if (!firebase.apps || !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// ── Public pages check ──────────────────────────
// EXACT paths only — /python/index.html ko match NAHI karna
function isPublicPage() {
  const path = window.location.pathname
    .replace(/\/+$/, '') // trailing slash hatao
    || '/';              // empty string → root

  // Sirf yahi 2 pages public hain
  return path === '/' || path === '/index.html' || path === '/login.html';
}

// Protected pages pe body hide karo — flicker avoid karne ke liye
if (!isPublicPage()) {
  document.body.style.visibility = 'hidden';
}

// ── Auth State Listener ─────────────────────────
auth.onAuthStateChanged((user) => {

  if (isPublicPage()) {
    // Homepage ya login page — kuch mat karo, page dikhne do
    return;
  }

  if (!user) {
    // Protected page, logged in nahi → login page pe bhejo
    // ?return= parameter se wapas isi page pe aayega login ke baad
    const returnPath = encodeURIComponent(window.location.pathname);
    window.location.href = '/login.html?return=' + returnPath;
  } else {
    // Logged in hai → page dikhao
    document.body.style.visibility = 'visible';
  }

});
