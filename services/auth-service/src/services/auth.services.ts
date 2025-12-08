import { sequelize } from '@/config';
import { RefreshToken, UserCredentials } from '@/models';
import type { AuthResponse } from '@/types/auth.interface';
import { hashPassword, signAccessToken, signRefreshToken } from '@/utils/token';
import { ConflictError } from '@chat/common';
import { Op, type Transaction } from 'sequelize';
import crypto from 'crypto';
import type { LoginInput, RegisterInput } from '@/utils/zod';

export class AuthService {
  private REFRESH_TOKEN_TTL_DAYS = 30;

  constructor() {}

  public async register(
    input: RegisterInput,
    ipAddress: string,
    userAgent: string,
  ): Promise<AuthResponse> {
    const existing = await UserCredentials.findOne({
      where: {
        email: { [Op.eq]: input.email },
      },
    });
    if (existing) {
      throw new ConflictError('Email already exists');
    }

    const transaction = await sequelize.transaction();

    const user = await UserCredentials.create(
      {
        email: input.email,
        passwordHash: await hashPassword(input.password),
        displayName: input.displayName,
      },
      { transaction },
    );

    const refreshTokenRecord = await this.createRefreshToken(
      {
        userId: user.id,
        ipAddress,
        userAgent,
      },
      transaction,
    );

    await transaction.commit();
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({
      sub: user.id,
      tokenId: refreshTokenRecord.tokenId,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt,
      },
    };
  }

  async login(input: LoginInput) {
    console.log(input);
  }

  logout() {}

  refreshTokens() {}

  private async revokeRefreshToken(userId: string, tokenId: string) {
    await RefreshToken.destroy({ where: { userId, tokenId } });
  }

  private async createRefreshToken(
    data: { userId: string; ipAddress: string; userAgent: string },
    transaction?: Transaction,
  ) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_TTL_DAYS);
    const tokenId = crypto.randomUUID();

    const record = await RefreshToken.create(
      {
        userId: data.userId,
        tokenId,
        expiresAt,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
      { transaction },
    );

    return record;
  }
}
