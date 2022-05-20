import test from 'ava';

import { createClock } from './Clock';

test("Clock's start date is valid", (t) => {
  const start = Date.now();
  const clock = createClock();

  t.assert(
    start <= clock.startedAt && clock.startedAt <= Date.now(),
    "Clock's start date is not valid"
  );
});

test("Clock's delta time at start is 0", (t) => {
  const clock = createClock();

  t.is(clock.delta, 0, "Clock's delta time is not valid");
});

test("Clock's elapsed time at start is 0", (t) => {
  const clock = createClock();

  t.is(clock.elapsed, 0, "Clock's elapsed time is not valid");
});

test("Clock's current date at start is start date", (t) => {
  const clock = createClock();

  t.is(clock.now, clock.startedAt, "Clock's current date is not valid");
});
