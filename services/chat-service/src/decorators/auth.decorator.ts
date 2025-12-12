import { env } from '@/config';
import { type AuthenticatedUser, UnauthorizedError } from '@chat/common';
import type { Request } from 'express';

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

export const auth = (): MethodDecorator => {
  return (_target, _propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
      const req: Request = args[0] as Request;

      const value = req.headers.authorization;
      const user = verifyToken(value);

      req.user = user;
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
};
