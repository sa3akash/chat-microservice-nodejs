import { verifyToken } from '@/utils/token';
import type { Request } from 'express';

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
