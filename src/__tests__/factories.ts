/**
 * Shared test factories for MHM 2000.
 *
 * Preferred recurring test subject: **Pier Paolo Pasolini**.
 */
import type { HiredPlayer } from "@/state/player";
import type { AIManager, AITeam, HumanManager, HumanTeam } from "@/state/game";
import type { Lineup } from "@/state/lineup";
import type { Random } from "random-js";
import { emptyAchievements, emptyTeamServices } from "@/services/empties";

// ---------------------------------------------------------------------------
// Player
// ---------------------------------------------------------------------------

let playerSeq = 0;

/**
 * Create a `HiredPlayer` with sensible defaults. All fields can be
 * overridden via the spread. Auto-increments the `id` unless provided.
 */
export const createPlayer = (
  overrides: Partial<HiredPlayer> = {}
): HiredPlayer => ({
  id: overrides.id ?? `p${++playerSeq}`,
  initial: "P",
  surname: "Pasolini",
  nationality: "IT",
  age: 25,
  charisma: 10,
  condition: 0,
  contract: { duration: 1, salary: 1000, type: "regular" },
  effects: [],
  ego: 0,
  leadership: 0,
  penaltyKillMod: 0,
  position: "c",
  powerplayMod: 0,
  skill: 10,
  specialty: "none",
  stats: {
    season: { assists: 0, games: 0, goals: 0 },
    total: { assists: 0, games: 0, goals: 0 }
  },
  tags: [],
  type: "hired",
  ...overrides
});

// ---------------------------------------------------------------------------
// Roster / lineup helpers
// ---------------------------------------------------------------------------

/** Convert a list of players into a `Record<id, player>` map. */
export const rosterMap = (
  ...players: HiredPlayer[]
): Record<string, HiredPlayer> => {
  const map: Record<string, HiredPlayer> = {};
  for (const p of players) {
    map[p.id] = p;
  }
  return map;
};

/** All slots `null` — the empty lineup constant. */
export const emptyLineup: Lineup = {
  g: null,
  forwardLines: [
    { lw: null, c: null, rw: null },
    { lw: null, c: null, rw: null },
    { lw: null, c: null, rw: null },
    { lw: null, c: null, rw: null }
  ],
  defensivePairings: [
    { ld: null, rd: null },
    { ld: null, rd: null },
    { ld: null, rd: null }
  ],
  powerplayTeam: { lw: null, c: null, rw: null, ld: null, rd: null },
  penaltyKillTeam: { f1: null, f2: null, ld: null, rd: null }
};

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

const defaultArena = {
  level: 1 as const,
  standingCount: 0,
  seatedCount: 0,
  hasBoxes: false,
  valuePoints: 0
};

const defaultBudget = {
  coaching: 3 as const,
  goalieCoaching: 3 as const,
  juniors: 3 as const,
  health: 3 as const,
  benefits: 3 as const
};

/** Create an `AITeam` with Pasolini-flavoured defaults. */
export const createAITeam = (overrides: Partial<AITeam> = {}): AITeam => ({
  id: 0,
  uid: "test-team",
  intensity: 1,
  name: "Pasolini United",
  city: "Bologna",
  arena: defaultArena,
  budget: defaultBudget,
  domestic: true,
  morale: 0,
  strategy: 0,
  readiness: 1,
  effects: [],
  opponentEffects: [],
  manager: undefined,
  tags: [],
  tier: 30,
  kind: "ai",
  strengthObj: { goalie: 10, defence: 50, attack: 100 },
  services: emptyTeamServices(),
  fixMatch: false,
  arenaFund: 0,
  seasonTickets: 0,
  arenaProject: undefined,
  mailbox: {},
  nationality: "FI",
  ...overrides
});

/** Create a `HumanTeam` with Pasolini-flavoured defaults. */
export const createHumanTeam = (
  overrides: Partial<HumanTeam> = {}
): HumanTeam => ({
  id: 1,
  uid: "test-human-team",
  intensity: 1,
  name: "Pasolini FC",
  city: "Roma",
  arena: defaultArena,
  budget: defaultBudget,
  domestic: true,
  morale: 0,
  strategy: 0,
  readiness: 1,
  effects: [],
  opponentEffects: [],
  manager: "mgr",
  tags: [],
  tier: 30,
  kind: "human",
  strengthObj: { goalie: 10, defence: 50, attack: 100 },
  services: emptyTeamServices(),
  fixMatch: false,
  arenaFund: 0,
  seasonTickets: 0,
  arenaProject: undefined,
  players: {},
  lineup: emptyLineup,
  previousRankings: [10, 10, 10],
  mailbox: {},
  nationality: "FI",
  ...overrides
});

// ---------------------------------------------------------------------------
// Manager
// ---------------------------------------------------------------------------

const defaultAttributes = {
  strategy: 0,
  specialTeams: 0,
  negotiation: 0,
  resourcefulness: 0,
  charisma: 0,
  luck: 0
};

/** Create an `AIManager` with zero attributes. */
export const createAIManager = (
  overrides: Partial<AIManager> = {}
): AIManager => ({
  id: "ai-mgr",
  name: "AI Pasolini",
  nationality: "FI",
  stats: { games: {}, achievements: emptyAchievements() },
  attributes: defaultAttributes,
  tags: [],
  kind: "ai",
  difficulty: 2,
  mailbox: {},
  ...overrides
});

/** Create a `HumanManager` with zero attributes. */
export const createHumanManager = (
  overrides: Partial<HumanManager> = {}
): HumanManager => ({
  id: "mgr",
  name: "Pier Paolo Pasolini",
  nationality: "IT",
  kind: "human",
  difficulty: 2,
  attributes: defaultAttributes,
  balance: 100000,
  team: 1,
  pranksExecuted: 0,
  crisisMeetingHeld: false,
  flags: {},
  tags: [],
  sponsor: undefined,
  completedActions: [],
  stats: { games: {}, achievements: emptyAchievements() },
  mailbox: {},
  options: {
    automaticLineup: false
  },
  ...overrides
});

// ---------------------------------------------------------------------------
// Random stubs
// ---------------------------------------------------------------------------

/** Deterministic stub that always returns the same value. */
export const fixedRandom = (value: number): Random =>
  ({
    integer: () => value,
    real: () => value,
    bool: () => false,
    pick: <T>(arr: T[]) => arr[0],
    sample: <T>(arr: T[], n: number) => arr.slice(0, n)
  }) as unknown as Random;

/**
 * Scriptable random: pop integers and reals from independent FIFO queues.
 * Throws when a queue is exhausted to surface accidental extra rolls.
 */
export const scriptedRandom = (script: {
  integer?: number[];
  real?: number[];
}): Random => {
  const intq = [...(script.integer ?? [])];
  const realq = [...(script.real ?? [])];
  return {
    integer: () => {
      if (intq.length === 0) {
        throw new Error("scriptedRandom: integer queue exhausted");
      }
      return intq.shift()!;
    },
    real: () => {
      if (realq.length === 0) {
        throw new Error("scriptedRandom: real queue exhausted");
      }
      return realq.shift()!;
    },
    bool: () => false,
    pick: <T>(arr: T[]) => arr[0],
    sample: <T>(arr: T[], n: number) => arr.slice(0, n)
  } as unknown as Random;
};
