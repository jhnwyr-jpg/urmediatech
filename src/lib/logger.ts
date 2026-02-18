/**
 * Safe logging utility that only logs detailed errors in development mode.
 * In production, error details are suppressed to prevent information leakage.
 */
export const logError = (message: string, error?: unknown) => {
  if (import.meta.env.DEV) {
    console.error(message, error);
  }
};
