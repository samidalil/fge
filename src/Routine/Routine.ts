import { patch } from '../State';
import type { AnyState, Clock, PatchRoutine, Routine } from '../types';

/**
 * Applies the routines' behaviors on the state
 * @param state - The state of the game
 * @param routines - Behaviors to execute
 * @param clock - Clock of the game
 * @returns A promise containing the modified state
 *
 * @category Runner
 */
export const applyRoutines = <S extends AnyState, C extends Clock>(
  state: S,
  routines: readonly Routine<S, C>[],
  clock: C
) =>
  routines.reduce(
    async (state, routine) => routine(await state, clock),
    Promise.resolve(state)
  );

/**
 * Helper to transform a patch routine into an usable routine
 * @param patchRoutine - A routine returning only modifications to apply on the state
 * @returns The patched state
 *
 * @category Routine
 */
export const update =
  <S extends AnyState, C extends Clock = Clock>(
    patchRoutine: PatchRoutine<S, C>
  ): Routine<S, C> =>
  async (state: S, clock: C) =>
    patch(state, await patchRoutine(state, clock));
