// src/api/auth.js
const API_URL = process.env.REACT_APP_API_URL;

export async function login({ email, password }) {
  const resp = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!resp.ok) throw new Error('Login failed');
  return resp.json(); // { user: {...}, token: '...' }
}
