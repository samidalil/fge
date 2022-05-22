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
export function patch<S>(state: S, modifications: S): S;
export function patch(state: unknown, modifications: unknown): unknown {
  if (
    state === undefined ||
    state === null ||
    modifications === undefined ||
    modifications === null
  )
    return modifications;

  if (Array.isArray(state) && Array.isArray(modifications)) {
    const array = modifications.map((value, index) => {
      const oldValue = state[index];

      if (oldValue === undefined) return value;
      return patch(oldValue, value);
    });

    return array.length !== state.length ||
      array.some((value, index) => value !== state[index])
      ? array
      : state;
  }

  if (typeof state === 'object' && typeof modifications === 'object') {
    return Object.entries(modifications).reduce((state, [key, value]) => {
      const oldValue = state[key];
      const newValue = patch(oldValue, value);

      return Object.is(oldValue, newValue)
        ? state
        : {
            ...state,
            [key]: newValue,
          };
    }, state as AnyState);
  }

  return modifications;
}
