import type { AnyState, Clock, NestedPartial } from '../types';

/**
 * A routine is launched by the runner, takes a state and a clock and returns a new reference to the state if updated
 *
 * @category Routine
 */
export type Routine<S extends AnyState, C extends Clock = Clock> = (
  state: S,
  clock: C
) => S | Promise<S>;

/**
 * A patch routine returns only the modifications to apply on the state
 *
 * @category Routine
 */
export type PatchRoutine<S extends AnyState, C extends Clock = Clock> = (
  state: S,
  clock: C
) => NestedPartial<S> | Promise<NestedPartial<S>>;
