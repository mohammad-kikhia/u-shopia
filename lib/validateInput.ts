// Shared Zod-based validation for the contact form.
// Returns a structured error object (or null) so existing API code can stay unchanged.

import * as z from 'zod';
import { emailRegex, textRegex } from '@/data/variables';

const contactSchema = z.object({
  name: z.string().trim().refine((val) => textRegex.test(val), {
    message: 'invalid_name',
  }),
  email: z.string().trim().refine((val) => emailRegex.test(val), {
    message: 'invalid_email',
  }),
  subject: z.string().trim().refine((val) => textRegex.test(val), {
    message: 'invalid_subject',
  }),
  message: z.string().trim().refine((val) => textRegex.test(val), {
    message: 'invalid_message',
  }),
});

export type ContactInput = z.infer<typeof contactSchema>;

type ErrorKey =
  | 'invalid_name'
  | 'invalid_email'
  | 'invalid_subject'
  | 'invalid_message';

export function validateInput(values: ContactInput) {
  const result = contactSchema.safeParse(values);

  if (result.success) {
    return null;
  }

  const firstIssue = result.error.issues[0];
  const code = (firstIssue.message || 'invalid_message') as ErrorKey;

  return {
    status: 400,
    error: code,
    message: firstIssue.message,
  };
}

