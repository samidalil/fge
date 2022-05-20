/**
 * A basic clock
 *
 * @category Clock
 */
export type Clock = {
  readonly delta: number;
  readonly elapsed: number;
  readonly now: number;
  readonly startedAt: number;
};
