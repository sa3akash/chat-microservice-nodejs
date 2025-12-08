import { z } from '@chat/common';

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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
