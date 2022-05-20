import type { Clock } from '../types';

/**
 * Creates a basic clock
 * @returns A clock initialized with default values using Date API
 *
 * @category Clock
 */
export const createClock = (): Clock => {
  const now = Date.now();

  return {
    delta: 0,
    elapsed: 0,
    now,
    startedAt: now,
  };
};
