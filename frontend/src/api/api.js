import axios from 'axios';

const API_BASE = "http://localhost:8000";

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token to every request if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Public endpoints
export const registerUser = (profile) =>
  api.post("/register", profile);

export const login = (credentials) =>
  api.post("/auth/login", credentials);

// Protected endpoints
export const getProfile = (name) =>
  api.get(`/profile/${encodeURIComponent(name)}`);

export const getMatches = (name) =>
  api.get(`/matches/${encodeURIComponent(name)}`);

export const compareProfiles = (payload) =>
  api.post("/compare-and-store", payload);
