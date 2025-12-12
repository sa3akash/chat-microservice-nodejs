import { NotFoundError, USER_ID_HEADER } from '@chat/common';
import type { Request } from 'express';

export const auth = (): MethodDecorator => {
  return (_target, _propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
      const req: Request = args[0] as Request;

      const userId = req.headers[USER_ID_HEADER] as string;

      if (!userId) {
        throw new NotFoundError('user id not found');
      }

      req.user = { id: userId };
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
};
