// Central API configuration for the React frontend
// In development, use proxy (/api) to avoid CORS issues
// In production, use direct URL to Laravel API
const isDevelopment = import.meta.env.DEV;

export const API = {
  BASE_URL: isDevelopment 
    ? '/api' // Use proxy in development
    : (import.meta.env.VITE_API_BASE_URL ?? 'http://192.168.43.20:8000/api'), // Direct URL in production
  endpoints: {
    // These are appended to BASE_URL
    login: '/login', // POST { email, password }
    logout: '/logout', // POST
    register: '/users', // POST { first_name, last_name, email, password, phone?, address?, date_of_birth? }
    profile: '/profile', // GET (auth required)
    subscriptions: '/subscriptions', // GET (list) / POST (create)
  },
} as const;

export function apiUrl(path: string) {
  const base = API.BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
