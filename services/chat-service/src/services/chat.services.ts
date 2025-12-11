import { type UserDocument, Users } from '@/models/user.model';
import type { UserCreatedPayload } from '@chat/common';

export class UserService {
  public async upsertUser(payload: UserCreatedPayload) {
    await Users.updateOne(
      { _id: payload.id },
      {
        $set: {
          _id: payload.id,
          email: payload.email,
          displayName: payload.displayName,
          createdAt: payload.createdAt,
          updatedAt: payload.updatedAt,
        },
      },
      { upsert: true },
    ).allowDiskUse(true);
  }

  public async findUserById(id: string): Promise<UserDocument | null> {
    return Users.findById(id).allowDiskUse(true);
  }
}

export const userService = new UserService();
