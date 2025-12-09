/* eslint-disable @typescript-eslint/no-unused-vars */
import { env } from '@/config';
import { handleError, helmetConfig, NotFoundError, ServerError } from '@chat/common';
import express, { type NextFunction, type Request, type Response, type Application } from 'express';
import cors from 'cors';
import helmet, { type HelmetOptions } from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import gatewayRouter from './routes';
import { AxiosError } from 'axios';
import { logger } from '@/utils/Logger';

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
  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(error);

    if (error instanceof AxiosError) {
      return res.status(error.response?.data.statusCode).json({
        message: error.response?.data.message,
        code: error.response?.data.code,
        statusCode: error.response?.data.statusCode,
      });
    }

    const err = handleError(error);

    res.status(err.statusCode).json({
      message: error.message ?? err.message,
      code: err.code,
      statusCode: err.statusCode,
      ...(env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  });
  return app;
};
