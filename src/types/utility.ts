/**
 * Partial utility type for nested object fields
 *
 * @category Utility
 */
export type NestedPartial<T> = {
  readonly [k in keyof T]?: T[k] extends Record<string, unknown>
    ? NestedPartial<T[k]>
    : T[k];
};
