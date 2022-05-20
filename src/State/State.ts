import type { AnyState, NestedPartial } from '../types';

/**
 * Deeply patches the state
 * @param state - State to patch
 * @param modifications - Modification object, partially represents the state and can have nested fields
 * @returns The patched state
 *
 * @category State
 */
export const patch = <S extends AnyState>(
  state: S,
  modifications: NestedPartial<S>
): S =>
  Object.entries(modifications).reduce((state, [key, value]) => {
    const newValue =
      typeof value === 'object'
        ? patch(state[key] as Record<string, unknown>, value)
        : value;

    return state[key] === newValue
      ? state
      : {
          ...state,
          [key]: newValue,
        };
  }, state);
