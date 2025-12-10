import { env } from '@/config';
import type { CreateUserInput, SearchUsersQuery, UserResponse } from '@chat/common';
import axios from 'axios';
import { authHeader } from '@/services/auth.proxy.service';

const client = axios.create({
  baseURL: env.USER_SERVICE_URL,
  timeout: 5000,
});

export class UserProxyService {
  public async getUserById(id: string): Promise<UserResponse> {
    const response = await client.get<UserResponse>(`/users/${id}`, authHeader);
    return response.data;
  }

  public async getAllUsers(): Promise<UserResponse[]> {
    const response = await client.get<UserResponse[]>(`/users`, authHeader);
    return response.data;
  }

  public async createUser(payload: CreateUserInput): Promise<UserResponse> {
    const response = await client.post<UserResponse>(`/users`, payload, authHeader);
    return response.data;
  }

  public async searchUsers(params: SearchUsersQuery): Promise<UserResponse[]> {
    const response = await client.get<UserResponse[]>(`/users/search`, {
      headers: authHeader.headers,
      params: {
        query: params.query,
        ...(params.limit ? { limit: params.limit } : {}),
        ...(params.exclude && params.exclude.length > 0 ? { exclude: params.exclude } : {}),
      },
    });

    return response.data;
  }
}
