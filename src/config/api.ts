export const API = {
  BASE_URL: 'https://api.sunufitness.com/api',
  endpoints: {
    // These are appended to BASE_URL
    login: '/login', // POST { email, password }
    logout: '/logout', // POST
    register: '/register', // POST { first_name, last_name, email, password, phone?, address?, date_of_birth? }
    profile: '/profile', // GET (auth required)
    subscriptions: '/subscriptions', // GET (list) / POST (create)
    refreshToken: '/refresh-token', // POST { refresh_token }
    validateToken: '/validate-token', // GET (auth required)
    services: '/services', // GET (list all services)
    servicesByCategory: '/services/category', // GET /services/category/{category}
    newsletter: {
      subscribe: '/newsletter/subscribe', // POST { email, first_name?, last_name? }
      unsubscribe: '/newsletter/unsubscribe', // POST { email }
      status: '/newsletter/status', // POST { email }
    },
    password: {
      forgot: '/password/forgot', // POST { email }
      verifyCode: '/password/verify-code', // POST { email, code }
      reset: '/password/reset', // POST { email, code, password, password_confirmation }
    },
    contact: '/contact', // POST { full_name, phone, email, subject, message }
  },
} as const;

export function apiUrl(path: string) {
  const base = API.BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
