import { env } from '@/config';
import { helmetConfig, NotFoundError } from '@chat/common';
import express, { type Application } from 'express';
import cors from 'cors';
import helmet, { type HelmetOptions } from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import gatewayRouter from './routes';
import { customErrorHandler } from '@/middlewares/error.handler';

export const createApp = (): Application => {
  const app = express();

  app.use(
    cors({
      origin(requestOrigin, callback) {
        callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      // allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }),
  );

  app.use(helmet(helmetConfig as HelmetOptions));
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(hpp());

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Gateway Service',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api', gatewayRouter);

  app.use(() => {
    throw new NotFoundError('Route not found');
  });

  app.use(customErrorHandler);

  return app;
};
