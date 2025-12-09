import 'dotenv/config';
import { z, createEnv } from '@chat/common';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GATEWAY_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(4001),
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: 'gateway-service',
});

export type Env = typeof env;
