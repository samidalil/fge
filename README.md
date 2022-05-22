# FGE

FGE is a really simple functional-oriented pseudo game engine which acts like a reducer towards the game state.

Its objective is to bring functional programming into the world of game development.

A complete API documentation is available [here](https://samidalil.github.io/fge/).

# Overview

FGE provides basic game engine components and tools to update state without mutating it.

A standard FGE usage would be :

<details>
  <summary>Declaring the state type</summary>

  ```typescript
  type Vector = readonly [x: number, y: number];

  type Input = "left" | "right" | "jump";

  type State = {
    readonly groundY: number;
    readonly inputQueue: readonly Input[]
    readonly player: {
      readonly onGround: boolean;
      readonly position: Vector;
      readonly velocity: Vector;
    };
    readonly won: boolean;
  };
  ```
</details>

<details>
  <summary>Implementing the routines</summary>

  ```typescript
  import { Clock, update } from "fge";

  const applyGroundCheck = update<State>((state) => {
    const onGround = state.player.position[1] <= state.groundY;

    return { player: { onGround } };
  });

  const getVelocityFromInput = (input: Input): Vector => {
    switch (input) {
      case "left":
        return [-1, 0];
      case "right":
        return [1, 0];
      case "jump":
        return [0, 1];
      default:
        return [0, 0];
    }
  };

  const applyInput = update<State>((state) => {
    const [input, ...inputQueue] = state.inputQueue;
    const velocity = input === "jump" && !state.player.onGround
      ? [0, 0]
      : getVelocityFromInput(input);

    return {
      inputQueue,
      player: {
        velocity: [state.player.velocity[0] + velocity[0], state.player.velocity[1] + velocity[1]],
      },
    };
  });

  const applyPseudoPhysics = update<State, Clock>((state, clock) => {
    const [x, y] = state.player.velocity;

    return {
      player: {
        position: [state.player.position[0] + x, state.player.position[1] + y],
        velocity: [(Math.abs(x) < 1e-8 ? 0 : x) - clock.delta * Math.sign(x), state.player.onGround ? 0 : y - clock.delta],
      },
    };
  });

  const applyWinCheck = update<State>((state) => ({
    won: state.player.position[0] >= 800,
  }));
  ```
</details>

<details>
  <summary>Running the game</summary>

  ```typescript
  import { createClock, createVariableTimeStepRunner } from "fge";

  let state: State = {
    groundY: 0,
    // Queue populated during a routine or by a platform-dependent API
    inputQueue: [],
    player: {
      onGround: false,
      position: [0, 0],
      velocity: [0, 0],
    },
    won: false,
  };

  let clock = createClock();

  const runner = createVariableTimeStepRunner<State>(0, 1);
  const routines = [
    applyGroundCheck,
    applyInput,
    applyPseudoPhysics,
    applyWinCheck,
  ];

  while (!state.won) {
    [state, clock] = await runner(state, routines, clock);
  }
  ```
</details>
<br />

# Routine

## Description

A routine is a pure async-able function taking the current game state and a runner's clock as parameters and computes a new state, it should return a new reference if the state has been modified.

For example :

<details>
  <summary>Basic routine implementation</summary>

  ```typescript
  type State = {
    playerPosition: {
      x: number;
      y: number;
    };
  };

  const applyPseudoGravity: Routine<State, Clock> = (state, clock) => {
    if (state.playerPosition.y > 0) {
      return {
        ...state,
        position: {
          ...state.playerPosition,
          y: Math.min(state.playerPosition.y - clock.delta, 0),
        },
      };
    }

    return state;
  };

  let state: State = {
    playerPosition: {
      x: 0,
      y: 0,
    },
  };

  state = await applyPseudoGravity(state, createClock());
  ```
</details>
<br />

As you can see, we define a routine updating the y component of the player position. If the position should be updated, new references to the objects are created using the spread operator (```...object```) and we modify only the y position.

## Patch routines

In the previous example, we constructed the new state ourselves. However, this could be simplified by using the ```update``` helper wrapper and a patch routine :

<details>
  <summary>Patch routine implementation</summary>

```typescript
...

const applyPseudoGravity: PatchRoutine<State, Clock> = (state, clock) => ({
  playerPosition: {
    y: state.playerPosition.y > 0
      ? Math.min(state.playerPosition.y - clock.delta, 0)
      : state.playerPosition.y,
  },
});

...

state = await update(applyPseudoGravity)(state, createClock());
```
</details>
<br />

The function now only returns the modified fields and the ```update``` wrapper will construct a routine that updates the state with the given values. It works with nested fields and creates a new reference only if the values are not the same as in the original state.

You can also define the patch routine this way :

<details>
  <summary>Preferred way to define a patch routine</summary>

```typescript
...

const applyPseudoGravity = update<State, Clock>((state, clock) => ({
  playerPosition: {
    y: state.playerPosition.y > 0
      ? Math.min(state.playerPosition.y - clock.delta, 0)
      : state.playerPosition.y,
  },
}));

...

state = await applyPseudoGravity(state, createClock());
```
</details>
<br />

## Apply multiple routines

### TODO
