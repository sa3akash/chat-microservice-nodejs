import { env } from '@/config';
import {
  BadGatewayError,
  globalErrorHandler,
  helmetConfig,
  internalAuth,
  NotFoundError,
} from '@chat/common';
import express, { type Application } from 'express';
import cors from 'cors';
import helmet, { type HelmetOptions } from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import { router } from '@/routes/user.route';

export const createApp = (): Application => {
  const app = express();

  app.use(
    cors({
      origin(requestOrigin, callback) {
        if (requestOrigin && requestOrigin !== env.GATEWAY_SERVICE_URL) {
          throw new BadGatewayError('Not allowed by cors');
        }
        callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Internal-Token'],
    }),
  );

  app.use(helmet(helmetConfig as HelmetOptions));
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(hpp());

  app.use(
    internalAuth(env.INTERNAL_API_TOKEN, {
      exemptPaths: ['/health', '/metrics'],
    }),
  );

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'User Service',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/users', router);

  app.use(() => {
    throw new NotFoundError('Route not found');
  });

  app.use(globalErrorHandler);
  return app;
};
