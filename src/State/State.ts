import type { AnyState, NestedPartial } from '../types';

/**
 * Deeply patches the state
 * @param state - State to patch
 * @param modifications - Modification object, partially represents the state and can have nested fields
 * @returns The patched state
 *
 * @category State
 */
export function patch<S extends AnyState>(
  state: S,
  modifications: NestedPartial<S>
): S;
export function patch<S extends readonly unknown[], R extends S>(
  state: S,
  modifications: R
): R;
export function patch(
  state: AnyState | readonly unknown[],
  modifications: AnyState | readonly unknown[]
): AnyState | readonly unknown[] {
  if (Array.isArray(state) && Array.isArray(modifications)) {
    const array = modifications.map((value, index) => {
      const oldValue = state[index];

      if (oldValue === undefined)
        return value;

      return typeof value === 'object' && value !== null
        ? patch(oldValue, value)
        : value
    });

    return array.length !== state.length ||
      array.some((value, index) => value !== state[index])
      ? array
      : state;
  }

  return Object.entries(modifications).reduce((state, [key, value]) => {
    const oldValue = state[key];

    if (oldValue === undefined) {
      return {
        ...state,
        [key]: value,
      };
    }

    const newValue =
      typeof value === 'object' && value !== null
        ? patch(oldValue as Record<string, unknown>, value)
        : value;

    return oldValue === newValue
      ? state
      : {
        ...state,
        [key]: newValue,
      };
  }, state as AnyState);
}
