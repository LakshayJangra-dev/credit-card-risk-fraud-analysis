/**
 * api/client.js
 * --------------
 * Thin fetch wrapper around the Flask backend (api.py). All requests are
 * relative paths so the Vite dev server proxy (see vite.config.js) or the
 * production reverse proxy can route them to the Flask app without CORS
 * headaches.
 *
 * Auth endpoints (/auth/login, /auth/signup, /auth/me) are NOT implemented
 * in the current api.py — see the "Wiring up real auth" section of
 * FRONTEND_README.md. Until then, `login`/`signup` below use a mock that
 * accepts any well-formed input, so the UI is fully clickable out of the box.
 */

const BASE = "";

async function postJSON(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

async function getJSON(path) {
  const res = await fetch(`${BASE}${path}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

// ---------------------------------------------------------------- health
export const getHealth = () => getJSON("/health");

// ---------------------------------------------------------------- scoring
export const scoreCredit = (applicant) => postJSON("/credit/score", applicant);
export const scoreFraud = (transaction) => postJSON("/fraud/score", transaction);
export const scoreCombined = (applicant, recentTransactions) =>
  postJSON("/combined/score", { applicant, recent_transactions: recentTransactions });

// ------------------------------------------------------------------ auth
// Real backend not implemented yet — see FRONTEND_README.md. This mock
// keeps the login/signup flow fully functional in the UI: any syntactically
// valid email/password combo "succeeds" and is stored in localStorage.
const MOCK_LATENCY = 500;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function login({ email, password }) {
  await sleep(MOCK_LATENCY);
  if (!email || !password) throw new Error("Email and password are required.");
  const user = { name: email.split("@")[0], email };
  localStorage.setItem("rc_user", JSON.stringify(user));
  return user;

  // --- once /auth/login exists on the backend, replace the above with: ---
  // const user = await postJSON("/auth/login", { email, password });
  // localStorage.setItem("rc_user", JSON.stringify(user));
  // return user;
}

export async function signup({ name, email, password }) {
  await sleep(MOCK_LATENCY);
  if (!name || !email || !password) throw new Error("All fields are required.");
  const user = { name, email };
  localStorage.setItem("rc_user", JSON.stringify(user));
  return user;

  // --- once /auth/signup exists on the backend, replace the above with: ---
  // const user = await postJSON("/auth/signup", { name, email, password });
  // localStorage.setItem("rc_user", JSON.stringify(user));
  // return user;
}

export function logout() {
  localStorage.removeItem("rc_user");
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("rc_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
