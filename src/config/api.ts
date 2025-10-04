// Central API configuration for the React frontend
// Backend API base should point directly to Laravel API (including /api)
export const API = {
  BASE_URL: (import.meta.env.VITE_API_BASE_URL ?? 'http://192.168.43.20:8000/api'),
  endpoints: {
    // These are appended to BASE_URL
    login: '/login', // POST { email, password }
    logout: '/logout', // POST
    register: '/users', // POST { first_name, last_name, email, password, phone?, address?, date_of_birth? }
    profile: '/profile', // GET (auth required)
  },
} as const;

export function apiUrl(path: string) {
  const base = API.BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
