// src/api/profile.js
const API_URL = process.env.REACT_APP_API_URL;
const token = localStorage.getItem('token');

async function request(path, method, body) {
  const resp = await fetch(`${API_URL}/profile/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.message || 'Profile API error');
  }
  return resp.json();
}

export function createProfile(data) {
  return request('', 'POST', data);
}

export function updateProfile(data) {
  return request('', 'PUT', data);
}

export function getProfile() {
  return request('', 'GET');
}
