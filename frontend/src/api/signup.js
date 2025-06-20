// frontend/src/api/signup.js
const API_URL = process.env.REACT_APP_API_URL;

export async function signup({ name, email, password }) {
  const resp = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.message || 'Signup failed');
  }
  return resp.json(); // { user: {...}, token: '...' }
}
