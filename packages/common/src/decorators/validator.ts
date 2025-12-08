import { ZodError, type ZodObject } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { BadRequestError } from 'error-express';

export type ValidateSchema = {
  body?: ZodObject;
  params?: ZodObject;
  query?: ZodObject;
};

export function Validate(schema: ValidateSchema) {
  return function (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = function (req: Request, res: Response, next: NextFunction) {
      try {
        if (schema.body) req.body = schema.body.parse(req.body);
        if (schema.params) {
          const parsed = schema.params.parse(req.params);
          req.params = parsed as Request['params'];
        }

        if (schema.query) {
          const parsed = schema.query.parse(req.query);
          req.query = parsed as Request['query'];
        }

        return original.apply(this, [req, res, next]);
      } catch (error) {
        if (error instanceof ZodError) {
          const issues = error.issues;
          const message = issues.map((iss) => `${iss.message}`);
          throw new BadRequestError(message[0]);
        }
        throw new BadRequestError('Validation Error');
      }
    };

    return descriptor;
  };
}
