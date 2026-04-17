/**
 * Session payload returned from your backend after sign-in / refresh.
 * Extend when your API adds fields (e.g. roles).
 */
export type AuthUser = {
  username?: string;
  accessToken?: string;
  roles?: string[];
} & Record<string, unknown>;
