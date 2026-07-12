export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export const LOCKOUT_MESSAGE = "Too many failed attempts. Try again in 15 minutes.";

export function isLockedOut(lockedUntil: Date | null): boolean {
  return !!lockedUntil && lockedUntil.getTime() > Date.now();
}

/** Next failed_login_attempts/locked_until pair to persist after a failed login. */
export function nextLockoutState(currentAttempts: number): {
  failedLoginAttempts: number;
  lockedUntil: Date | null;
} {
  const failedLoginAttempts = currentAttempts + 1;
  const lockedUntil =
    failedLoginAttempts >= MAX_LOGIN_ATTEMPTS ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null;
  return { failedLoginAttempts, lockedUntil };
}
