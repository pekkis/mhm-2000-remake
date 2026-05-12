import { setup, assign } from "xstate";
import type { Arena, ArenaLevel } from "@/data/mhm2000/teams";
import type { BuildRank, ProjectKind } from "@/services/arena";
import {
  renovationMaxValuePoints,
  renovationCost,
  newArenaCost,
  canAffordProject,
  NEW_ARENA_MIN_VALUE_POINTS,
  arenaFreePoints
} from "@/services/arena";

// ─── Public types ─────────────────────────────────────────────────────────────

export type ArenaDesignResult = {
  kind: ProjectKind;
  target: Arena;
  builder: BuildRank;
  architect: BuildRank;
  /** Only meaningful for `kind: "build"`. */
  name: string;
  totalCost: number;
};

// ─── Machine context ──────────────────────────────────────────────────────────

export type ArenaDesignContext = {
  kind: ProjectKind;
  currentArena: Arena;
  /** Manager's cash balance — used for affordability check. */
  balance: number;
  /** Current arena fund. */
  arenaFund: number;

  // Editable plan fields (the wizard's state)
  valuePoints: number;
  level: ArenaLevel;
  standingCount: number;
  seatedCount: number;
  hasBoxes: boolean;

  builder: BuildRank;
  architect: BuildRank;
  name: string;
};

type ArenaDesignEvents =
  | { type: "SET_VALUE_POINTS"; value: number }
  | { type: "SET_LEVEL"; value: ArenaLevel }
  | { type: "SET_STANDING"; value: number }
  | { type: "SET_SEATED"; value: number }
  | { type: "SET_BOXES"; value: boolean }
  | { type: "SET_BUILDER"; value: BuildRank }
  | { type: "SET_ARCHITECT"; value: BuildRank }
  | { type: "SET_NAME"; value: string }
  | { type: "CONFIRM" }
  | { type: "CANCEL" };

// ─── Pure helpers ─────────────────────────────────────────────────────────────

/** Total cost of the current plan. */
export const planCost = (ctx: ArenaDesignContext): number => {
  if (ctx.kind === "renovate") {
    return renovationCost(ctx.currentArena, ctx.valuePoints, ctx.builder);
  }
  return newArenaCost(ctx.valuePoints, ctx.architect, ctx.builder);
};

/** Free (unallocated) tilapisteet in the current plan. */
export const planFreePoints = (ctx: ArenaDesignContext): number =>
  arenaFreePoints({
    level: ctx.level,
    standingCount: ctx.standingCount,
    seatedCount: ctx.seatedCount,
    hasBoxes: ctx.hasBoxes,
    valuePoints: ctx.valuePoints
  });

/** Whether the plan can be confirmed (all greenlight conditions met). */
export const canConfirm = (ctx: ArenaDesignContext): boolean => {
  // Points must fit
  if (planFreePoints(ctx) < 0) {
    return false;
  }

  // Must be strictly greater than current (renovation) or floor (build)
  if (ctx.kind === "renovate") {
    if (ctx.valuePoints <= ctx.currentArena.valuePoints) {
      return false;
    }
  } else {
    if (ctx.valuePoints <= NEW_ARENA_MIN_VALUE_POINTS) {
      return false;
    }
  }

  // Down payment must be affordable from the arena fund
  const cost = planCost(ctx);
  if (!canAffordProject(cost, ctx.arenaFund)) {
    return false;
  }

  // Build needs a name
  if (ctx.kind === "build" && ctx.name.trim().length === 0) {
    return false;
  }

  return true;
};

// ─── Value point bounds ───────────────────────────────────────────────────────

export const valuePointsMin = (ctx: ArenaDesignContext): number =>
  ctx.kind === "renovate"
    ? ctx.currentArena.valuePoints + 1
    : NEW_ARENA_MIN_VALUE_POINTS + 1;

export const valuePointsMax = (ctx: ArenaDesignContext): number =>
  ctx.kind === "renovate" ? renovationMaxValuePoints(ctx.currentArena) : 9999;

// ─── Machine ──────────────────────────────────────────────────────────────────

export const arenaDesignMachine = setup({
  types: {
    context: {} as ArenaDesignContext,
    events: {} as ArenaDesignEvents,
    input: {} as {
      kind: ProjectKind;
      currentArena: Arena;
      balance: number;
      arenaFund: number;
    }
  }
}).createMachine({
  id: "arenaDesign",
  initial: "editing",
  context: ({ input }) => {
    const base =
      input.kind === "renovate"
        ? {
            valuePoints: input.currentArena.valuePoints + 1,
            level: input.currentArena.level,
            standingCount: input.currentArena.standingCount,
            seatedCount: input.currentArena.seatedCount,
            hasBoxes: input.currentArena.hasBoxes
          }
        : {
            valuePoints: NEW_ARENA_MIN_VALUE_POINTS + 1,
            level: 1 as ArenaLevel,
            standingCount: 0,
            seatedCount: 0,
            hasBoxes: false
          };
    return {
      kind: input.kind,
      currentArena: input.currentArena,
      balance: input.balance,
      arenaFund: input.arenaFund,
      ...base,
      builder: 2 as BuildRank,
      architect: 2 as BuildRank,
      name: input.currentArena.name ?? `${input.currentArena.name ?? "Areena"}`
    };
  },
  states: {
    editing: {
      on: {
        SET_VALUE_POINTS: {
          actions: assign({
            valuePoints: ({ event }) => event.value
          })
        },
        SET_LEVEL: {
          actions: assign(({ context, event }) => {
            const nextLevel = event.value;
            // If downgrading below 4, force boxes off
            const hasBoxes = nextLevel < 4 ? false : context.hasBoxes;
            return { ...context, level: nextLevel, hasBoxes };
          })
        },
        SET_STANDING: {
          actions: assign({
            standingCount: ({ event }) => event.value
          })
        },
        SET_SEATED: {
          actions: assign({
            seatedCount: ({ event }) => event.value
          })
        },
        SET_BOXES: {
          actions: assign({
            hasBoxes: ({ event }) => event.value
          })
        },
        SET_BUILDER: {
          actions: assign({
            builder: ({ event }) => event.value
          })
        },
        SET_ARCHITECT: {
          actions: assign({
            architect: ({ event }) => event.value
          })
        },
        SET_NAME: {
          actions: assign({
            name: ({ event }) => event.value
          })
        },
        CONFIRM: {
          target: "confirmed"
        },
        CANCEL: {
          target: "cancelled"
        }
      }
    },
    confirmed: {
      type: "final"
    },
    cancelled: {
      type: "final"
    }
  }
});
