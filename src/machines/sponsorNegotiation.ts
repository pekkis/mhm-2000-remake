/**
 * Sponsor negotiation machine — port of QB `SUB sponsorit`
 * (ILEX5.BAS:6642–6898).
 *
 * Spawned once per human manager during preseason (calendar kiero3 = 99).
 * The parent passes manager/team/competitions as `input`; the actor
 * completes with a `SponsorNegotiationOutput` containing the signed
 * `SponsorDeal`.
 *
 * Three sponsor candidates are rolled on entry. The manager can set
 * goal ambitions (only before the first haggle on each candidate),
 * haggle to bump offers, or accept. When two candidates have walked,
 * the survivor must be accepted — no further haggling.
 *
 * Full QB decode: src/mhm2000-qb/_NOTES/SPONSORS.md
 */

import { setup, assign } from "xstate";
import type { Random } from "random-js";
import type { HumanManager, HumanTeam } from "@/state/game";
import type { Competition, CompetitionId } from "@/types/competitions";
import {
  type GoalCategoryId,
  type GoalLevel,
  type GoalCategory,
  type SponsorDeal,
  type SponsorPayouts,
  sponsorNames,
  goalCategories,
  buildOfferPayouts,
  basePerMatchFee,
  rollCandidateJitter,
  applyHaggleBump,
  emptySponsorPayouts
} from "@/data/mhm2000/sponsors";
import {
  difficultyLevelById,
  type DifficultyLevelId
} from "@/data/mhm2000/difficulty-levels";
import { createAttributeRollService } from "@/services/attribute-roll";

// ─── Derivation helpers ───────────────────────────────────────────────────────

/**
 * Derive the team's league tier from competition participation.
 * PHL → 1, Division → 2, Mutasarja → 3.
 */
const deriveLeagueTier = (
  teamId: number,
  competitions: Record<CompetitionId, Competition>
): number => {
  if (competitions.phl.teams.includes(teamId)) {
    return 1;
  }
  if (competitions.division.teams.includes(teamId)) {
    return 2;
  }
  if (competitions.mutasarja.teams.includes(teamId)) {
    return 3;
  }
  return 1; // fallback — shouldn't happen for managed teams
};

/**
 * Derive EHL qualification from competition participation.
 * Team is EHL-qualified if it appears in `ehl.teams` while the
 * competition is at phase 0 (group stage not yet advanced).
 */
const deriveEhlQualified = (
  teamId: number,
  competitions: Record<CompetitionId, Competition>
): boolean => {
  const ehl = competitions.ehl;
  return ehl.phase === 0 && ehl.teams.includes(teamId);
};

// ─── Per-candidate state ──────────────────────────────────────────────────────

export type CandidateState = {
  /** Cosmetic sponsor name from SPONDATA.M2K. */
  name: string;
  /** 20 per-slot jitter multipliers, rolled once on entry. */
  jitter: number[];
  /** Chosen goal level per category. */
  goals: Record<GoalCategoryId, GoalLevel>;
  /** Current 20-slot payout offer. Rebuilt on goal change, bumped on haggle. */
  payouts: SponsorPayouts;
  /** Number of successful haggles completed on this candidate. */
  haggleCount: number;
  /** Whether the candidate has walked away (failed haggle roll). */
  walked: boolean;
  /** Result of the most recent haggle attempt, if any. */
  lastHaggleResult: "success" | "failure" | null;
};

// ─── Public types ─────────────────────────────────────────────────────────────

export type SponsorNegotiationInput = {
  manager: HumanManager;
  team: HumanTeam;
  competitions: Record<CompetitionId, Competition>;
  random: Random;
};

export type SponsorNegotiationOutput = {
  deal: SponsorDeal;
};

// ─── Context ──────────────────────────────────────────────────────────────────

export type SponsorNegotiationContext = {
  manager: HumanManager;
  team: HumanTeam;
  random: Random;

  /** Derived: 1 = PHL, 2 = Division, 3 = Mutasarja. */
  leagueTier: number;
  /** Derived: per-match fee base from rankings + difficulty. */
  base: number;
  /** Derived: available goal categories with max levels. */
  categories: GoalCategory[];

  /** The 3 sponsor candidates. */
  candidates: [CandidateState, CandidateState, CandidateState];
  /** Currently viewed candidate (0, 1, or 2). */
  activeCandidateIndex: 0 | 1 | 2;

  /** Terminal result — set on ACCEPT or all-walked. */
  result: SponsorDeal | null;
};

// ─── Events ───────────────────────────────────────────────────────────────────

type SponsorNegotiationEvent =
  | { type: "SELECT_CANDIDATE"; index: 0 | 1 | 2 }
  | { type: "SET_GOAL"; category: GoalCategoryId; level: GoalLevel }
  | { type: "HAGGLE" }
  | { type: "ACCEPT" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Pick 3 unique sponsor names from the 93-name pool. */
const rollSponsorNames = (random: Random): [string, string, string] =>
  random.sample([...sponsorNames], 3) as [string, string, string];

/** Build initial candidate state. */
const buildCandidate = (
  name: string,
  random: Random,
  base: number,
  leagueTier: number,
  hasBoxes: boolean
): CandidateState => {
  const jitter = rollCandidateJitter(random, hasBoxes);
  const goals: Record<GoalCategoryId, GoalLevel> = {
    phl: 1,
    divMut: 1,
    cup: 1,
    ehl: 1
  };
  const payouts = buildOfferPayouts(base, goals, leagueTier, jitter);
  return { name, jitter, goals, payouts, haggleCount: 0, walked: false, lastHaggleResult: null };
};

/** Rebuild payouts from current goals. Used when goals change. */
const rebuildPayouts = (
  candidate: CandidateState,
  base: number,
  leagueTier: number
): SponsorPayouts =>
  buildOfferPayouts(base, candidate.goals, leagueTier, candidate.jitter);

/** Count how many candidates have walked. */
const walkedCount = (
  candidates: [CandidateState, CandidateState, CandidateState]
): number => candidates.filter((c) => c.walked).length;

// ─── Machine ──────────────────────────────────────────────────────────────────

export const sponsorNegotiationMachine = setup({
  types: {
    context: {} as SponsorNegotiationContext,
    input: {} as SponsorNegotiationInput,
    events: {} as SponsorNegotiationEvent,
    output: {} as SponsorNegotiationOutput
  },
  guards: {
    allWalked: ({ context }) => walkedCount(context.candidates) === 3,
    canHaggle: ({ context }) => {
      const c = context.candidates[context.activeCandidateIndex];
      return !c.walked && walkedCount(context.candidates) < 2;
    },
    canSetGoal: ({ context, event }) => {
      const e = event as {
        type: "SET_GOAL";
        category: GoalCategoryId;
        level: GoalLevel;
      };
      const c = context.candidates[context.activeCandidateIndex];
      if (c.haggleCount > 0 || c.walked) {
        return false;
      }
      const cat = context.categories.find((cat) => cat.id === e.category);
      if (!cat) {
        return false;
      }
      return e.level >= 1 && e.level <= cat.maxLevel;
    },
    canAccept: ({ context }) => {
      const c = context.candidates[context.activeCandidateIndex];
      return !c.walked;
    }
  }
}).createMachine({
  id: "sponsorNegotiation",

  output: ({ context }): SponsorNegotiationOutput => {
    const deal = context.result ?? {
      name: "",
      payouts: { ...emptySponsorPayouts }
    };
    return { deal };
  },

  context: ({ input }) => {
    const { manager, team, competitions, random } = input;
    const teamId = team.id;

    const leagueTier = deriveLeagueTier(teamId, competitions);
    const ehlQualified = deriveEhlQualified(teamId, competitions);
    const categories = goalCategories(leagueTier, ehlQualified);

    const previousRankings: [number, number, number] =
      team.previousRankings ?? [25, 25, 25];
    const sponsorScale = difficultyLevelById(
      manager.difficulty as DifficultyLevelId
    ).sponsorScalePercent;
    const base = basePerMatchFee(previousRankings, sponsorScale);
    const hasBoxes = team.arena.hasBoxes;

    const names = rollSponsorNames(random);
    const candidates: [CandidateState, CandidateState, CandidateState] = [
      buildCandidate(names[0], random, base, leagueTier, hasBoxes),
      buildCandidate(names[1], random, base, leagueTier, hasBoxes),
      buildCandidate(names[2], random, base, leagueTier, hasBoxes)
    ];

    return {
      manager,
      team,
      random,
      leagueTier,
      base,
      categories,
      candidates,
      activeCandidateIndex: 0,
      result: null
    };
  },

  initial: "negotiating",

  states: {
    negotiating: {
      always: {
        guard: "allWalked",
        target: "done",
        actions: assign({
          result: () => ({
            name: "",
            payouts: { ...emptySponsorPayouts }
          })
        })
      },

      on: {
        SELECT_CANDIDATE: {
          actions: assign({
            activeCandidateIndex: ({ event }) => event.index
          })
        },

        SET_GOAL: {
          guard: "canSetGoal",
          actions: assign({
            candidates: ({ context, event }) => {
              const idx = context.activeCandidateIndex;
              const updated = context.candidates.map((c, i) => {
                if (i !== idx) {
                  return c;
                }
                const newGoals = { ...c.goals, [event.category]: event.level };
                const newCandidate = { ...c, goals: newGoals };
                return {
                  ...newCandidate,
                  payouts: rebuildPayouts(
                    newCandidate,
                    context.base,
                    context.leagueTier
                  )
                };
              }) as [CandidateState, CandidateState, CandidateState];
              return updated;
            }
          })
        },

        HAGGLE: {
          guard: "canHaggle",
          actions: assign({
            candidates: ({ context }) => {
              const idx = context.activeCandidateIndex;
              const { attributeRoll } = createAttributeRollService(
                context.random
              );

              const haggleBase = 97 - context.candidates[idx].haggleCount * 5;
              const success = attributeRoll(
                context.manager.attributes,
                "negotiation",
                5,
                haggleBase
              );

              return context.candidates.map((c, i) => {
                if (i !== idx) {
                  return c;
                }
                if (!success) {
                  return {
                    ...c,
                    walked: true,
                    payouts: { ...emptySponsorPayouts },
                    lastHaggleResult: "failure" as const
                  };
                }
                // Success: bump positive slots + increment haggle count
                const bumpedPayouts = { ...c.payouts };
                applyHaggleBump(bumpedPayouts, context.random);
                return {
                  ...c,
                  haggleCount: c.haggleCount + 1,
                  payouts: bumpedPayouts,
                  lastHaggleResult: "success" as const
                };
              }) as [CandidateState, CandidateState, CandidateState];
            }
          })
        },

        ACCEPT: {
          guard: "canAccept",
          target: "done",
          actions: assign({
            result: ({ context }) => {
              const c = context.candidates[context.activeCandidateIndex];
              return { name: c.name, payouts: c.payouts };
            }
          })
        }
      }
    },

    done: {
      type: "final"
    }
  }
});
