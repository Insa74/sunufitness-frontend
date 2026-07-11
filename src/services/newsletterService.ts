import { apiClient } from './apiClient';

export interface NewsletterSubscribeRequest {
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface NewsletterUnsubscribeRequest {
  email: string;
}

export interface NewsletterStatusRequest {
  email: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    status: string;
  };
}

export const newsletterService = {
  /**
   * Subscribe to newsletter
   * @param data - Email and optional first_name, last_name
   * @returns Promise with subscription response
   */
  subscribe: async (data: NewsletterSubscribeRequest): Promise<NewsletterResponse> => {
    return apiClient.post<NewsletterResponse>('/newsletter/subscribe', data);
  },

  /**
   * Unsubscribe from newsletter
   * @param data - Email to unsubscribe
   * @returns Promise with unsubscribe response
   */
  unsubscribe: async (data: NewsletterUnsubscribeRequest): Promise<NewsletterResponse> => {
    return apiClient.post<NewsletterResponse>('/newsletter/unsubscribe', data);
  },

  /**
   * Check subscription status
   * @param data - Email to check
   * @returns Promise with status response
   */
  checkStatus: async (data: NewsletterStatusRequest): Promise<NewsletterResponse> => {
    return apiClient.post<NewsletterResponse>('/newsletter/status', data);
  },
};
