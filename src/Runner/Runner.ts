import { applyRoutines } from '../Routine';
import { patch } from '../State';
import type { AnyState, Clock, Runner } from '../types';

/**
 * Clamps a value between two borders
 * @param min Min value
 * @param value Value to clamp
 * @param max Max value
 * @returns The clamped value
 *
 * @ignore
 */
const clamp = (min: number, value: number, max: number) =>
  Math.min(Math.max(min, value), max);

/**
 * Creates a runner with variable time delta clamped between two min-max values
 * @param minDelta - The min value for the delta
 * @param maxDelta - The max value for the delta
 * @returns A variable time step runner updating the clock each tick and applying routines' behaviors on the state
 *
 * @category Runner
 */
export const createVariableTimeStepRunner =
  <T extends AnyState>(minDelta: number, maxDelta: number): Runner<T, Clock> =>
  async (state, routines, clock) => {
    const now = Date.now();

    clock = patch(clock, {
      delta: clamp(minDelta, (now - clock.now) / 1000, maxDelta),
      elapsed: now - clock.startedAt,
      now,
    });

    return [await applyRoutines(state, routines, clock), clock];
  };
