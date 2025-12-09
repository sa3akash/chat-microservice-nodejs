import { env } from '@/config';
import { Request } from 'express';

export const ip = (req: Request): string => {
  const ip =
    env.NODE_ENV === 'development'
      ? '173.166.164.121'
      : Array.isArray(req.headers['cf-connecting-ip'])
        ? req.headers['cf-connecting-ip'][0]
        : req.headers['cf-connecting-ip'] ||
          (typeof req.headers['x-forwarded-for'] === 'string'
            ? req.headers['x-forwarded-for'].split(',')[0]
            : req.ip);
  return ip ?? '0.0.0.0';
};
