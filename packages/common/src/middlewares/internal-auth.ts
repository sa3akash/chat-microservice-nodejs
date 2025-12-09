import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { BadRequestError } from 'error-express';

export interface InternalAuthOptions {
  headerName?: string;
  exemptPaths?: string[];
}

/**
 * Fully type-safe internal authorization middleware.
 */
export function internalAuth(
  expectedToken: string,
  options: InternalAuthOptions = {},
): RequestHandler {
  const headerName: string = (options.headerName ?? 'x-internal-token').toLowerCase();
  const exemptPaths: Set<string> = new Set(options.exemptPaths ?? ['/health']);

  // Fully typed RequestHandler
  return function internalAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
    // Skip exempt paths
    if (exemptPaths.has(req.path)) {
      return next();
    }

    const provided = req.headers[headerName];
    const token: string | undefined = Array.isArray(provided) ? provided[0] : provided;

    // Validation
    if (!token || token !== expectedToken) {
      // Throw type-safe UnauthorizedError
      throw new BadRequestError('Unauthorized');
    }

    next();
  };
}
