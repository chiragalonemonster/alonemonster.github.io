// ============================================
//   auth.js — Alone Monster Coding Hub
//
//   Page rules:
//     • Homepage  ( / , /index.html )  → PUBLIC, login OPTIONAL
//     • Login pg  ( /login.html )      → PUBLIC
//     • Everything else                → LOGIN REQUIRED
//
//   A valid session is EITHER:
//     1. A Firebase auth user (email / Google login), OR
//     2. An admin session   (localStorage.am_admin_session === '1')
//
//   Once a session exists, NO page will ever redirect to /login.html
//   until the user explicitly logs out.
//
//   On redirect to login, the original path (including subfolder &
//   query/hash, e.g. /python/, /html-css/, /javascript/) is passed via
//   ?return=… so login.html sends the user back to that exact page.
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

// ── Helpers ─────────────────────────────────────
// Public pages: ONLY homepage and login page. /python/, /html-css/,
// /javascript/ etc. are protected.
function isPublicPage() {
  const path = window.location.pathname
    .replace(/\/+$/, '') // trailing slash hatao
    || '/';              // empty string → root
  return path === '/' || path === '/index.html' || path === '/login.html';
}

function isAdminSession() {
  try { return localStorage.getItem('am_admin_session') === '1'; }
  catch (_) { return false; }
}

function _showBody() {
  try { if (document.body) document.body.style.visibility = 'visible'; }
  catch (_) {}
}
function _hideBody() {
  try { if (document.body) document.body.style.visibility = 'hidden'; }
  catch (_) {}
}

function _buildReturnUrl() {
  // Preserve subfolder + query + hash so login wapis exact same page pe le aaye
  // e.g. /python/?x=1#top → /login.html?return=%2Fpython%2F%3Fx%3D1%23top
  const here = window.location.pathname + window.location.search + window.location.hash;
  return '/login.html?return=' + encodeURIComponent(here);
}

// ── Initial visibility (synchronous, before Firebase resolves) ──
// Protected page + already admin → show immediately, no flicker, no wait.
// Protected page + no admin yet  → hide until Firebase confirms login.
// Public page                    → never hide.
if (!isPublicPage()) {
  if (isAdminSession()) {
    _showBody();
  } else {
    _hideBody();
  }
}

// ── Firebase Auth State Listener ────────────────
auth.onAuthStateChanged((user) => {

  // Homepage / login page — koi force redirect nahi
  if (isPublicPage()) {
    _showBody();
    return;
  }

  // Admin session active → page dikhao, Firebase user na bhi ho to chalega
  if (isAdminSession()) {
    _showBody();
    return;
  }

  // Firebase user logged in → page dikhao
  if (user) {
    _showBody();
    return;
  }

  // Koi session nahi → login page pe bhejo, return URL ke saath
  window.location.replace(_buildReturnUrl());
});

// ── Safety net ──────────────────────────────────
// Agar Firebase kabhi resolve hi na ho (offline / blocked CDN etc.),
// to admin session waale ko 2.5s ke baad force show kar do — taaki
// admin protected page pe phase na ho.
setTimeout(function () {
  if (!isPublicPage() && isAdminSession()) _showBody();
}, 2500);
