import type { UserRepository } from '@/repositories/user.repositories';
import type { CreateUserInput, UserInterface } from '@chat/common';

import { userRepository } from '@/repositories/user.repositories';
import { AuthUserRegisteredPayload, ConflictError, NotFoundError } from '@chat/common';
import { UniqueConstraintError } from 'sequelize';
import { publishUserCreatedEvent } from '@/queues/event-publisher';

class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getUserById(id: string): Promise<UserInterface> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async getAllUsers(): Promise<UserInterface[]> {
    return this.repository.findAll();
  }

  async createUser(input: CreateUserInput): Promise<UserInterface> {
    try {
      const user = await this.repository.create(input);

      void publishUserCreatedEvent({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });

      return user;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictError('User already exists');
      }
      throw error;
    }
  }

  async searchUsers(params: {
    query: string;
    limit?: number;
    excludeIds?: string[];
  }): Promise<UserInterface[]> {
    const query = params.query.trim();
    if (query.length === 0) {
      return [];
    }

    return this.repository.searchByQuery(query, {
      limit: params.limit,
      excludeIds: params.excludeIds,
    });
  }

  async syncFromAuthUser(payload: AuthUserRegisteredPayload): Promise<UserInterface> {
    const user = await this.repository.upsertFromAuthEvent(payload);

    void publishUserCreatedEvent({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
    return user;
  }
}

export const userService = new UserService(userRepository);
