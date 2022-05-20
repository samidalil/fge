import test from 'ava';

import { patch } from './State';

type TestState = {
  readonly angle: number;
  readonly position: {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  };
};

test('Patch returns the same reference when no modifications', (t) => {
  const state: TestState = {
    angle: 0,
    position: {
      x: 0,
      y: 1,
      z: 2,
    },
  };
  const updatedState = patch(state, {});

  t.is(
    state,
    updatedState,
    'State has not the same reference even with no modifications'
  );
  t.deepEqual(state, updatedState);
});

test('Patch returns the same instance if the final state is the same', (t) => {
  const state: TestState = {
    angle: 0,
    position: {
      x: 0,
      y: 1,
      z: 2,
    },
  };
  const updatedState = patch(state, { angle: 0 });

  t.is(
    state,
    updatedState,
    'State has not the same reference even with same values'
  );
  t.deepEqual(state, updatedState);
});

test('Patch returns a different instance if modifications are effective', (t) => {
  const state: TestState = {
    angle: 0,
    position: {
      x: 0,
      y: 1,
      z: 2,
    },
  };
  const updatedState = patch(state, { angle: 2 });

  t.assert(
    state !== updatedState,
    'State has the same reference even with different values'
  );
  t.notDeepEqual(state, updatedState);
});

test('Patch nested updates with same values does not create new reference', (t) => {
  const state: TestState = {
    angle: 0,
    position: {
      x: 0,
      y: 1,
      z: 2,
    },
  };
  const updatedState = patch(state, { position: { x: 0 } });

  t.is(
    state,
    updatedState,
    'State has not the same reference even with same nested values'
  );
  t.is(
    state.position,
    updatedState.position,
    'State field has not the same reference even with same values'
  );
  t.deepEqual(state, updatedState);
});

test('Patch nested updates with different values creates new reference for the state and the field', (t) => {
  const state: TestState = {
    angle: 0,
    position: {
      x: 0,
      y: 1,
      z: 2,
    },
  };
  const updatedState = patch(state, { position: { x: 3 } });

  t.assert(
    state !== updatedState,
    'State field has the same reference even with different nested values'
  );
  t.assert(
    state.position !== updatedState.position,
    'State field has the same reference even with different values'
  );
  t.notDeepEqual(state, updatedState);
});
