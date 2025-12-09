import { sequelize } from '@/config';
import { RefreshToken, UserCredentials } from '@/models';
import type { AuthResponse } from '@chat/common';
import {
  hashPassword,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
  verifyRefreshToken,
} from '@/utils/token';
import { BadRequestError, ConflictError, NotFoundError } from '@chat/common';
import { Op, type Transaction } from 'sequelize';
import crypto from 'crypto';
import type { LoginInput, RegisterInput } from '@chat/common';
import { publishUserRegistered } from '@/queues/event-publishing';
import { logger } from '@/utils/Logger';

export class AuthService {
  private REFRESH_TOKEN_TTL_DAYS = 30;

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

    const accessToken = signAccessToken({ sub: user.dataValues.id, email: user.dataValues.email });

    const refreshToken = signRefreshToken({
      sub: user.dataValues.id,
      tokenId: refreshTokenRecord.dataValues.tokenId,
    });

    const userData = {
      id: user.dataValues.id,
      email: user.dataValues.email,
      displayName: user.dataValues.displayName,
      createdAt: user.dataValues.createdAt.toString(),
    };

    publishUserRegistered(userData);

    return {
      accessToken,
      refreshToken,
      user: userData,
    };
  }

  async login(input: LoginInput, ipAddress: string, userAgent: string): Promise<AuthResponse> {
    const user = await UserCredentials.findOne({
      where: {
        email: { [Op.eq]: input.email },
      },
    });

    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const isPasswordValid = await verifyPassword(input.password, user.dataValues.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid credentials');
    }

    const refreshTokenRecord = await this.createRefreshToken({
      userId: user.dataValues.id,
      ipAddress,
      userAgent,
    });

    const accessToken = signAccessToken({ sub: user.dataValues.id, email: user.dataValues.email });
    const refreshToken = signRefreshToken({
      sub: user.dataValues.id,
      tokenId: refreshTokenRecord.dataValues.tokenId,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.dataValues.id,
        email: user.dataValues.email,
        displayName: user.dataValues.displayName,
        createdAt: user.dataValues.createdAt,
      },
    };
  }

  public async logout(token: string) {
    const payload = verifyRefreshToken(token);
    await this.revokeRefreshToken(payload.sub, payload.tokenId);
  }

  public async refreshTokens(
    token: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = verifyRefreshToken(token);

    const tokenRecord = await RefreshToken.findOne({
      where: { tokenId: payload.tokenId, userId: payload.sub },
    });

    if (!tokenRecord) {
      throw new NotFoundError('Invalid refresh token');
    }

    if (tokenRecord.expiresAt.getTime() < Date.now()) {
      await tokenRecord.destroy();
      throw new BadRequestError('Refresh token has expired');
    }

    const credential = await UserCredentials.findByPk(payload.sub);

    if (!credential) {
      logger.warn({ userId: payload.sub }, 'User missing for refresh token');
      throw new BadRequestError('Invalid refresh token');
    }

    await tokenRecord.destroy();
    const newTokenRecord = await this.createRefreshToken({
      ipAddress,
      userAgent,
      userId: credential.id,
    });

    return {
      accessToken: signAccessToken({ sub: credential.id, email: credential.email }),
      refreshToken: signRefreshToken({ sub: credential.id, tokenId: newTokenRecord.tokenId }),
    };
  }

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

    const existingToken = await RefreshToken.findOne({
      where: {
        userId: data.userId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });

    if (existingToken) {
      await existingToken.update(
        {
          tokenId,
          expiresAt,
        },
        { transaction },
      );
      return existingToken;
    }

    return RefreshToken.create(
      {
        userId: data.userId,
        tokenId,
        expiresAt,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
      { transaction },
    );
  }
}
