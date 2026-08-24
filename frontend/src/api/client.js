/**
 * api/client.js
 * --------------
 * API client for the Credit Risk & Fraud Analysis system.
 *
 * Handles:
 * - Health check
 * - Credit risk scoring
 * - Fraud detection
 * - Combined risk assessment
 * - User signup
 * - User login
 * - JWT authentication
 * - Current authenticated user
 * - Logout
 */

const BASE = "";

/* ================================================================
   TOKEN
================================================================ */

export function getToken() {
  return localStorage.getItem("rc_token");
}


/* ================================================================
   BASIC POST REQUEST
================================================================ */

async function postJSON(path, body, authenticated = false) {
  const headers = {
    "Content-Type": "application/json",
  };

  /*
   * Add JWT token when the endpoint requires authentication.
   */
  if (authenticated) {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in.");
    }

    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data.error || `Request failed (${res.status})`
    );
  }

  return data;
}


/* ================================================================
   BASIC GET REQUEST
================================================================ */

async function getJSON(path) {
  const res = await fetch(`${BASE}${path}`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data.error || `Request failed (${res.status})`
    );
  }

  return data;
}


/* ================================================================
   AUTHENTICATED GET REQUEST
================================================================ */

async function getJSONWithAuth(path) {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated.");
  }

  const res = await fetch(`${BASE}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data.error || `Request failed (${res.status})`
    );
  }

  return data;
}


/* ================================================================
   HEALTH
================================================================ */

export const getHealth = () =>
  getJSON("/health");


/* ================================================================
   RISK SCORING
================================================================ */

/*
 * These endpoints require a valid JWT token.
 */

export const scoreCredit = (applicant) =>
  postJSON(
    "/credit/score",
    applicant,
    true
  );


export const scoreFraud = (transaction) =>
  postJSON(
    "/fraud/score",
    transaction,
    true
  );


export const scoreCombined = (
  applicant,
  recentTransactions
) =>
  postJSON(
    "/combined/score",
    {
      applicant,
      recent_transactions: recentTransactions,
    },
    true
  );


/* ================================================================
   SIGNUP
================================================================ */

export async function signup({
  name,
  email,
  password,
}) {
  const data = await postJSON(
    "/auth/signup",
    {
      name,
      email,
      password,
    }
  );

  /*
   * Save JWT token.
   */
  localStorage.setItem(
    "rc_token",
    data.token
  );

  /*
   * Save basic user information.
   * Password is NEVER stored here.
   */
  localStorage.setItem(
    "rc_user",
    JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
    })
  );

  return data;
}


/* ================================================================
   LOGIN
================================================================ */

export async function login({
  email,
  password,
}) {
  const data = await postJSON(
    "/auth/login",
    {
      email,
      password,
    }
  );

  /*
   * Save JWT token.
   */
  localStorage.setItem(
    "rc_token",
    data.token
  );

  /*
   * Save basic user information.
   * Password is NEVER stored.
   */
  localStorage.setItem(
    "rc_user",
    JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
    })
  );

  return data;
}


/* ================================================================
   CURRENT USER
================================================================ */

export async function getCurrentUser() {
  return getJSONWithAuth("/auth/me");
}


/* ================================================================
   STORED USER
================================================================ */

export function getStoredUser() {
  try {
    const raw =
      localStorage.getItem("rc_user");

    return raw
      ? JSON.parse(raw)
      : null;
  } catch {
    return null;
  }
}


/* ================================================================
   LOGOUT
================================================================ */

export function logout() {
  localStorage.removeItem("rc_token");
  localStorage.removeItem("rc_user");
}