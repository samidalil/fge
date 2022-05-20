import test from 'ava';

import { createClock } from '../Clock';

import { applyRoutines, update } from './Routine';

type TestState = {
  readonly angle: number;
  readonly position: {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  };
};

test('Patch routine returns the same reference when used with same values', async (t) => {
  const routine = update((state: TestState) => ({ angle: state.angle }));

  const state: TestState = {
    angle: 0,
    position: {
      x: 0,
      y: 1,
      z: 2,
    },
  };
  const updatedState = await routine(state, createClock());

  t.is(
    state,
    updatedState,
    'Patch routine returns another reference even with same values'
  );
  t.deepEqual(state, updatedState);
});

test('Patch routine returns a new state when used with different values', async (t) => {
  const routine = update((state: TestState) => ({
    angle: state.angle + 1,
    position: { x: 2 },
  }));

  const state: TestState = {
    angle: 0,
    position: {
      x: 0,
      y: 1,
      z: 2,
    },
  };
  const updatedState = await routine(state, createClock());

  t.assert(
    state !== updatedState,
    'Patch routine returns same reference even with different values'
  );
  t.notDeepEqual(state, updatedState);
});

test('applyRoutines should execute each routine sequentially while updating state', async (t) => {
  const routine = update<TestState>((state) => ({
    angle: state.angle + 1,
  }));

  const state: TestState = {
    angle: 0,
    position: {
      x: 0,
      y: 1,
      z: 2,
    },
  };
  const updatedState = await applyRoutines(
    state,
    [routine, routine],
    createClock()
  );

  t.is(
    state.angle + 2,
    updatedState.angle,
    'applyRoutines is not updating the state sequentially'
  );
});
