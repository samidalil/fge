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

  t.not(
    state,
    updatedState,
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

  t.not(
    state,
    updatedState,
    'State field has the same reference even with different nested values'
  );
  t.not(
    state.position,
    updatedState.position,
    'State field has the same reference even with different values'
  );
  t.notDeepEqual(state, updatedState);
});

type TestArrayState = {
  readonly angle: number;
  readonly inputs: readonly ('left' | 'right')[];
  readonly position: {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  };
};

test('Patch works on arrays', (t) => {
  const state: TestArrayState = {
    angle: 0,
    inputs: ['right'],
    position: {
      x: 0,
      y: 1,
      z: 2,
    },
  };
  const updatedState = patch(state, { inputs: [] });

  t.not(
    state,
    updatedState,
    "State reference's is the same even with different nested values"
  );
  t.not(
    state.inputs,
    updatedState.inputs,
    "State field's reference is the same even with different values"
  );
  t.notDeepEqual(state, updatedState);
});

test('Patch does not update array with same values', (t) => {
  const state: TestArrayState = {
    angle: 0,
    inputs: ['right'],
    position: {
      x: 0,
      y: 1,
      z: 2,
    },
  };
  const updatedState = patch(state, { inputs: ['right'] });

  t.is(
    state,
    updatedState,
    'State has a different reference even with same nested values'
  );
  t.is(
    state.inputs,
    updatedState.inputs,
    'State field has a different reference even with same values'
  );
  t.deepEqual(state, updatedState);
});
