import axios from 'axios';

import { env } from '@/config';
import type { AuthResponse, RegisterInput } from '@chat/common';

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
}
