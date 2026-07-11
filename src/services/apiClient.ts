import { apiUrl } from '../config/api';
import { refreshAccessToken, getStoredTokens, clearStoredTokens } from './tokenService';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../config/storageKeys';

export type ApiError = { message: string; errors?: Record<string, string[]> };

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

async function request<T>(path: string, options: RequestInit = {}, retryCount = 0): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
  const res = await fetch(apiUrl(path), {
    method: options.method ?? 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    // No credentials needed for token-based auth
    ...options,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  // Handle 401 Unauthorized - try to refresh token
  if (res.status === 401 && retryCount === 0) {
    const { refreshToken } = getStoredTokens();
    
    if (refreshToken) {
      // If already refreshing, wait for it to complete
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((newToken: string) => {
            // Retry the original request with new token
            request<T>(path, {
              ...options,
              headers: {
                ...options.headers,
                'Authorization': `Bearer ${newToken}`,
              },
            }, 1)
              .then(resolve)
              .catch(reject);
          });
        });
      }

      isRefreshing = true;

      try {
        const newTokens = await refreshAccessToken(refreshToken);
        
        if (newTokens) {
          // Store new tokens
          localStorage.setItem(ACCESS_TOKEN_KEY, newTokens.access_token);
          localStorage.setItem(REFRESH_TOKEN_KEY, newTokens.refresh_token);
          
          // Notify subscribers
          onRefreshed(newTokens.access_token);
          isRefreshing = false;

          // Retry original request with new token
          return request<T>(path, {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newTokens.access_token}`,
            },
          }, 1);
        } else {
          // Refresh failed, clear tokens and throw error
          isRefreshing = false;
          clearStoredTokens();
          window.dispatchEvent(new CustomEvent('auth:logout'));
          throw { message: 'Session expirée. Veuillez vous reconnecter.' };
        }
      } catch (error) {
        isRefreshing = false;
        clearStoredTokens();
        window.dispatchEvent(new CustomEvent('auth:logout'));
        throw { message: 'Session expirée. Veuillez vous reconnecter.' };
      }
    } else {
      // No refresh token available
      clearStoredTokens();
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  }

  if (!res.ok) {
    const err: ApiError = isJson ? data : { message: typeof data === 'string' ? data : 'Erreur inconnue' };
    throw err;
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: any) => request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put:  <T>(path: string, body?: any) => request<T>(path, { method: 'PUT',  body: body ? JSON.stringify(body) : undefined }),
  del:  <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
