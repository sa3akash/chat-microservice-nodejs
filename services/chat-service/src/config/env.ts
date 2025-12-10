import 'dotenv/config';
import { z, createEnv } from '@chat/common';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CHAT_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(4002),
  MONGO_DB_URL: z.string(),
  JWT_SECRET: z.string().min(3),
  GATEWAY_SERVICE_URL: z.url(),
  RABBITMQ_URL: z.url(),
  REDIS_URL: z.url(),
  INTERNAL_API_TOKEN: z.string().min(3),
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: 'chat-service',
});

export type Env = typeof env;
