import { globalErrorHandler, helmetConfig, NotFoundError } from '@chat/common';
import express, { type Application } from 'express';
import cors from 'cors';
import helmet, { type HelmetOptions } from 'helmet';
import compression from 'compression';
import hpp from 'hpp';

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

  app.use(() => {
    throw new NotFoundError('Route not found');
  });
  app.use(globalErrorHandler);
  return app;
};
