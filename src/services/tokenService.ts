import { apiUrl, API } from '../config/api';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../config/storageKeys';

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

export type ValidateTokenResponse = {
  valid: boolean;
  user?: any;
  message?: string;
};

/**
 * Validates the current access token
 */
export async function validateAccessToken(accessToken: string): Promise<ValidateTokenResponse> {
  try {
    const res = await fetch(apiUrl(API.endpoints.validateToken), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return { valid: false, message: data.message || 'Token invalide' };
    }

    return { valid: true, user: data.user };
  } catch (error) {
    console.error('Error validating token:', error);
    return { valid: false, message: 'Erreur de validation du token' };
  }
}

/**
 * Refreshes the access token using the refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse | null> {
  try {
    const res = await fetch(apiUrl(API.endpoints.refreshToken), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Failed to refresh token:', data.message);
      return null;
    }

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_type: data.token_type || 'Bearer',
      expires_in: data.expires_in || 3600,
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

/**
 * Gets stored tokens from localStorage
 */
export function getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
  return {
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

/**
 * Clears all stored tokens
 */
export function clearStoredTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem('auth_user');
}
