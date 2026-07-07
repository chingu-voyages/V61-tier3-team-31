import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must contain at least 2 characters')
      .max(50, 'Name must contain no more than 50 characters'),

    email: z.email('Please enter a valid email address'),

    password: z
      .string()
      .min(8, 'Password must contain at least 8 characters')
      .regex(/[A-Z]/, 'One uppercase letter required')
      .regex(/[0-9]/, 'One number required'),

    confirmPassword: z.string(),

    timezone: z.string().min(1, 'Please select a timezone'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
