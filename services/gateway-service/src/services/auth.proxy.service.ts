import axios from 'axios';

import { env } from '@/config';
import type { AuthResponse, LoginInput, RegisterInput } from '@chat/common';

const client = axios.create({
  baseURL: env.AUTH_SERVICE_URL,
  timeout: 5000,
});

const authHeader = {
  headers: {
    'X-Internal-Token': env.INTERNAL_API_TOKEN,
  },
} as const;

export class AuthProxyService {
  async register(
    input: RegisterInput,
    ipAddress: string,
    userAgent: string,
  ): Promise<AuthResponse> {
    const response = await client.post<AuthResponse>('/auth/register', input, {
      headers: {
        'User-Agent': userAgent,
        'X-Forwarded-For': ipAddress,
        ip: ipAddress,
        ...authHeader.headers,
      },
    });
    return response.data;
  }

  async login(input: LoginInput, ipAddress: string, userAgent: string): Promise<AuthResponse> {
    const response = await client.post<AuthResponse>('/auth/login', input, {
      headers: {
        'User-Agent': userAgent,
        'X-Forwarded-For': ipAddress,
        ip: ipAddress,
        ...authHeader.headers,
      },
    });
    return response.data;
  }

  async logout(token: string): Promise<{ message: string }> {
    const response = await client.post<{ message: string }>('/auth/logout', { token }, authHeader);
    return response.data;
  }

  async refreshToken(token: string, ipAddress: string, userAgent: string): Promise<AuthResponse> {
    const response = await client.post<AuthResponse>(
      '/auth/refresh-token',
      { refreshToken: token },
      {
        headers: {
          'User-Agent': userAgent,
          'X-Forwarded-For': ipAddress,
          ip: ipAddress,
          ...authHeader.headers,
        },
      },
    );
    return response.data;
  }

  async removeRefreshToken(token: string): Promise<{ message: string }> {
    const response = await client.post<{ message: string }>(
      '/auth/remove-refresh-token',
      { token },
      authHeader,
    );
    return response.data;
  }
}
