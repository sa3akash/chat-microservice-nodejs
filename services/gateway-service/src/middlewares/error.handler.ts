/* eslint-disable @typescript-eslint/no-unused-vars */
import { env } from '@/config';
import { handleError } from '@chat/common';
import { AxiosError } from 'axios';
import type { NextFunction, Request, Response } from 'express';

export const customErrorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return res.status(502).json({
        message: 'Service Unavailable',
        code: 'BAD_GATEWAY',
        statusCode: 502,
      });
    }
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
};
