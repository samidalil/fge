import test from 'ava';

import { createClock } from '../Clock';
import { update } from '../Routine';

import { createVariableTimeStepRunner } from './Runner';

type TestState = {
  readonly angle: number;
  readonly position: {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  };
};

test('Runner returns same state when no routines', async (t) => {
  const runner = createVariableTimeStepRunner<TestState>(0.1, 1);

  const state: TestState = {
    angle: 0,
    position: {
      x: 0,
      y: 1,
      z: 2,
    },
  };
  const clock = createClock();

  const [updatedState] = await runner(state, [], clock);

  t.is(
    state,
    updatedState,
    'Runner does not return same reference even with no routines'
  );
  t.deepEqual(state, updatedState);
});

test('Runner returns same state when routine does not modify state values', async (t) => {
  const runner = createVariableTimeStepRunner<TestState>(0.1, 1);
  const routine = update((state: TestState) => ({
    angle: state.angle,
    position: { x: 0 },
  }));

  const state: TestState = {
    angle: 0,
    position: {
      x: 0,
      y: 1,
      z: 2,
    },
  };
  const clock = createClock();

  const [updatedState] = await runner(state, [routine], clock);

  t.is(
    state,
    updatedState,
    'Runner does not return same reference even with no value updates'
  );
  t.deepEqual(state, updatedState);
});

test('Runner returns a new state when routine modifies state values', async (t) => {
  const runner = createVariableTimeStepRunner<TestState>(0.1, 1);
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
  const clock = createClock();

  const [updatedState] = await runner(state, [routine], clock);

  t.assert(
    state !== updatedState,
    'Runner returns same reference even with modifying routines'
  );
  t.notDeepEqual(state, updatedState);
});

test('Runner clamps clock delta', async (t) => {
  const runner = createVariableTimeStepRunner<TestState>(0.1, 0.2);
  const wait = update<TestState>(() => {
    Array(100000000).forEach(() => {
      return;
    });
    return {};
  });

  const [state, clock] = await runner(
    {
      angle: 0,
      position: {
        x: 0,
        y: 1,
        z: 2,
      },
    },
    [],
    createClock()
  );

  t.assert(0.1 <= clock.delta && clock.delta <= 0.2, 'Delta is not clamped');

  const [, updatedClock] = await runner(state, [wait], clock);

  t.assert(
    0.1 <= updatedClock.delta && updatedClock.delta <= 0.2,
    'Delta after second update is not clamped'
  );
});
