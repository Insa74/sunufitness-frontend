import { apiUrl } from '../config/api';

// Auth caisse : distincte de l'auth membre (voir AuthContext/apiClient),
// obtenue via le PIN sur /caisse et partagée par la caisse et le dashboard admin.

export const CAISSE_TOKEN_KEY = 'caisse_token';
export const CAISSE_USER_KEY = 'caisse_user';

export interface CaisseUser {
  id: number;
  nom: string;
  prenom: string;
  role: string;
}

export function getCaisseToken(): string | null {
  return localStorage.getItem(CAISSE_TOKEN_KEY);
}

export function getCaisseUser(): CaisseUser | null {
  const raw = localStorage.getItem(CAISSE_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isCaisseAdmin(): boolean {
  const user = getCaisseUser();
  return !!getCaisseToken() && !!user && ['admin', 'super_admin'].includes(user.role);
}

export function isCaisseStaff(): boolean {
  const user = getCaisseUser();
  return !!getCaisseToken() && !!user && ['coach', 'admin', 'super_admin'].includes(user.role);
}

async function caisseRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getCaisseToken();
  const res = await fetch(apiUrl(path), {
    method: options.method ?? 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem(CAISSE_TOKEN_KEY);
      localStorage.removeItem(CAISSE_USER_KEY);
      window.dispatchEvent(new CustomEvent('caisse:session-expired'));
    }
    throw data;
  }
  return data as T;
}

export const caisseApi = {
  get: <T,>(path: string) => caisseRequest<T>(path),
  post: <T,>(path: string, body?: any) => caisseRequest<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T,>(path: string, body?: any) => caisseRequest<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  del: <T,>(path: string) => caisseRequest<T>(path, { method: 'DELETE' }),
};

// Téléchargement d'un fichier binaire (ex: PDF) authentifié par le token caisse.
// Distinct de caisseRequest, qui force res.json() et casserait sur une réponse binaire.
export async function caisseApiDownload(path: string, filename: string): Promise<void> {
  const token = getCaisseToken();
  const res = await fetch(apiUrl(path), {
    headers: {
      'Accept': 'application/pdf',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    let message = 'Erreur lors du téléchargement du PDF.';
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {
      // corps non-JSON, on garde le message générique
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
