import { z } from 'zod';

/** Client-side rules; backend still receives `{ user, pwd }` unchanged. */
export const REGISTER_PASSWORD_MIN = 8;

export type RegisterFormMessages = {
  emailInvalid: string;
  passwordMin: string;
  confirmRequired: string;
  passwordMismatch: string;
};

export function createRegisterFormSchema(msgs: RegisterFormMessages) {
  return z
    .object({
      username: z.string().trim().min(1, msgs.emailInvalid).email(msgs.emailInvalid),
      password: z.string().min(REGISTER_PASSWORD_MIN, msgs.passwordMin),
      confirmPassword: z.string().min(1, msgs.confirmRequired),
    })
    .refine((d) => d.password === d.confirmPassword, {
      message: msgs.passwordMismatch,
      path: ['confirmPassword'],
    });
}

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterFormSchema>>;
