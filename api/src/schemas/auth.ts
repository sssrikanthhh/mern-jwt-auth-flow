import { z } from 'zod';

export const emailSchema = z.string().min(1).max(255);
export const passwordSchema = z.string().min(8).max(255);
export const verificationCodeSchema = z.string().min(1).max(24);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional()
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(8).max(255)
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export const resetPasswordSchema = z.object({
  verificationCode: verificationCodeSchema,
  password: passwordSchema
});
