import { apiUrl } from '../config/api';

// Tablette d'inscription à l'accueil : jeton « tablette » distinct du jeton caisse.
// Il est créé depuis la Caisse (bouton « Tablette ») et n'ouvre que les routes /api/tablette.

export const TABLETTE_TOKEN_KEY = 'tablette_token';

export function getTabletteToken(): string | null {
  return localStorage.getItem(TABLETTE_TOKEN_KEY);
}

async function tabletteRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getTabletteToken();
  const res = await fetch(apiUrl(path), {
    method: options.method ?? 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem(TABLETTE_TOKEN_KEY);
      window.dispatchEvent(new CustomEvent('tablette:desactivee'));
    }
    throw data;
  }
  return data as T;
}

export const tabletteApi = {
  get: <T,>(path: string) => tabletteRequest<T>(path),
  post: <T,>(path: string, body?: unknown) =>
    tabletteRequest<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
};
