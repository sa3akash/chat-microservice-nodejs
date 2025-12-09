import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email({
    error: 'Invalid email',
  }),
  password: z
    .string({
      error: 'Invalid password',
    })
    .min(8, {
      error: 'Password must be at least 8 characters long',
    }),
  displayName: z
    .string({
      error: 'Invalid display name',
    })
    .min(3, {
      error: 'Display name must be at least 3 characters long',
    }),
});

export const loginSchema = z.object({
  email: z.email({
    error: 'Invalid email',
  }),
  password: z
    .string({
      error: 'Invalid password',
    })
    .min(8, {
      error: 'Invalid password',
    }),
});

export const refreshSchema = z.object({
  refreshToken: z.string(),
});

export const revokeSchema = z.object({
  token: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type RevokeInput = z.infer<typeof revokeSchema>;
