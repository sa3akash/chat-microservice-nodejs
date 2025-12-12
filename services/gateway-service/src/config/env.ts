import 'dotenv/config';
import { z, createEnv } from '@chat/common';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GATEWAY_PORT: z.coerce.number().int().min(0).max(65_535).default(4000),
  AUTH_SERVICE_URL: z.url(),
  USER_SERVICE_URL: z.url(),
  CHAT_SERVICE_URL: z.url(),
  JWT_SECRET: z.string().min(3),
  INTERNAL_API_TOKEN: z.string().min(16),
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: 'gateway-service',
});

export type Env = typeof env;
