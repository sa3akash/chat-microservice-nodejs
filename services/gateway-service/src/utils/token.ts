import { env } from '@/config';
import { type AuthenticatedUser, UnauthorizedError } from '@chat/common';

import jwt from 'jsonwebtoken';

export const verifyToken = (value: string | undefined): AuthenticatedUser => {
  try {
    if (!value) {
      throw new UnauthorizedError('token required.');
    }
    const [scheme, token] = value.split(' ');
    if (scheme.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedError('invalid token.');
    }

    return jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
  } catch {
    throw new UnauthorizedError('Unauthorized');
  }
};
