# FGE

FGE is a really simple functional-oriented pseudo game engine which acts like a reducer towards the game state.

Its objective is to bring functional programming into the world of game development.

A complete API documentation is available [here](https://samidalil.github.io/fge/).

# Overview

FGE provides basic game engine components and tools to update state without mutating it.

A standard FGE usage would be :

```typescript
type State = {
  groundY: number;
  inputQueue: ("left" | "right" | "jump")[]
  player: {
    onGround: boolean;
    position: {
      x: number;
      y: number;
    };
    velocity: {
      x: number;
      y: number;
    };
  };
  won: boolean;
};

const applyGroundCheck = update<State, Clock>((state, clock) => {
  const onGround = state.player.position.y <= state.groundY;

  return {
    player: {
      onGround,
      velocity: { y: onGround ? 0 : state.player.velocity.y - clock.delta }
    },
  };
});

const applyInput = update<State>((state) => {
  const [input, ...inputQueue] = state.inputQueue;
  const velocity = input === "jump" && !state.player.onGround
    ? { x: 0, y: 0 }
    // External function from your library
    : getVelocityFromInput(input);

  return {
    inputQueue,
    player: {
      velocity: {
        x: state.player.velocity.x + velocity.x,
        y: state.player.velocity.y + velocity.y,
      },
    },
  };
});

const applyPseudoPhysics = update<State>((state) => ({
  player: {
    position: {
      x: state.player.position.x + state.player.velocity.x,
      y: state.player.position.y + state.player.velocity.y,
    },
  },
}));

const applyWinCheck = update<State>((state) => ({
  won: state.player.position.x >= 200,
}));

let state: State = {
  groundY: 0,
  // Queue populated by an external API, depending on the platform
  inputQueue: [],
  player: {
    onGround: false,
    position: {
      x: 0,
      y: 0,
    },
    velocity: {
      x: 0,
      y: 0,
    },
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

# Routine

## Description

A routine is a pure async-able function taking the current game state and a runner's clock as parameters and computes a new state, it should return a new reference if the state has been modified.

For example :

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

As you can see, we define a routine updating the y component of the player position. If the position should be updated, new references to the objects are created using the spread operator (```...object```) and we modify only the y position.

## Patch routines

In the previous example, we constructed the new state ourselves. However, this could be simplified by using the ```update``` helper wrapper and a patch routine :

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

The function now only returns the modified fields and the ```update``` wrapper will construct a routine that updates the state with the given values. It works with nested fields and creates a new reference only if the values are not the same as in the original state.

You can also define the patch routine this way :

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

## Apply multiple routines

### TODO
