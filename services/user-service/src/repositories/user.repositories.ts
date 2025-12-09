import { Op, type WhereOptions } from 'sequelize';

import type { AuthUserRegisteredPayload, CreateUserInput, UserInterface } from '@chat/common';
import { UserModel } from '@/models/user.model';

const toDomainUser = (model: UserModel): UserInterface => ({
  id: model.id,
  email: model.email,
  displayName: model.displayName,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
});

export class UserRepository {
  async findById(id: string): Promise<UserInterface | null> {
    const user = await UserModel.findByPk(id);
    return user ? toDomainUser(user) : null;
  }

  async findAll(): Promise<UserInterface[]> {
    const users = await UserModel.findAll({
      order: [['displayName', 'ASC']],
    });
    return users.map(toDomainUser);
  }

  async create(data: CreateUserInput): Promise<UserInterface> {
    const user = await UserModel.create(data);
    return toDomainUser(user);
  }

  async searchByQuery(
    query: string,
    options: { limit?: number; excludeIds?: string[] } = {},
  ): Promise<UserInterface[]> {
    const where: WhereOptions = {
      [Op.or]: [
        { displayName: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } },
      ],
    };

    if (options.excludeIds && options.excludeIds.length > 0) {
      Object.assign(where, {
        [Op.and]: [{ id: { [Op.notIn]: options.excludeIds } }],
      });
    }

    const users = await UserModel.findAll({
      where,
      order: [['displayName', 'ASC']],
      limit: options.limit ?? 10,
    });

    return users.map(toDomainUser);
  }

  async upsertFromAuthEvent(payload: AuthUserRegisteredPayload): Promise<UserInterface> {
    const [user] = await UserModel.upsert(
      {
        id: payload.id,
        email: payload.email,
        displayName: payload.displayName,
        createdAt: new Date(payload.createdAt),
        updatedAt: new Date(payload.createdAt),
      },
      { returning: true },
    );

    return toDomainUser(user);
  }
}

export const userRepository = new UserRepository();
