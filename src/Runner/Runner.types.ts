import type { AnyState, Clock, Routine } from '../types';

/**
 * A runner returns a tuple composed of the updated state and the updated clock
 *
 * @category Runner
 */
export type RunnerReturnType<S extends AnyState, C extends Clock> = readonly [
  state: S,
  clock: C
];

/**
 * A runner takes a state and a clock, applies the routines on the state and updates the clock, creating new references in case of modifications
 *
 * @category Runner
 */
export type Runner<S extends AnyState, C extends Clock> = (
  state: S,
  routines: readonly Routine<S, C>[],
  clock: C
) => Promise<RunnerReturnType<S, C>>;
