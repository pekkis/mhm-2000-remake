/**
 * Contract negotiation machine — port of QB `sopimusext (fat%)` SUB
 * (ILEX5.BAS:6312-6588).
 *
 * Each negotiation is a spawned actor. The parent passes player/manager/budget
 * data as `input`; the actor completes with a `ContractNegotiationOutput`
 * that describes the outcome (including ready-to-apply `EventEffect[]`).
 *
 * QB `fat%` parameter:
 *   fat% = 1: negotiating with an existing player in a team's roster
 *   fat% = 2: signing a free agent from the market (`bel`)
 * We derive this from `player.type` ("hired" vs "market") — the machine
 * logic is identical; the output effects differ based on player type.
 */

import { setup, assign } from "xstate";
import type { Random } from "random-js";
import type { TeamBudget } from "@/data/mhm2000/budget";
import type { Player, RegularContract } from "@/state/player";
import type { HumanManager } from "@/state/game";
import type { EventEffect } from "@/game/event-effects";
import {
  type SpecialClause,
  computeTeamNeedsRating,
  computeWillingnessThreshold,
  computeNhlOptionThreshold,
  computeAskingPrice,
  computeAcceptanceProbability,
  attemptNegotiation,
  adjustSalary
} from "@/services/mhm-2000/contract-negotiation";
import { computeSalary } from "@/services/mhm-2000/compute-salary";
import {
  type NegotiationDialogKey,
  getDialogLine
} from "@/data/mhm2000/negotiation-dialog";

// ─── Public types ─────────────────────────────────────────────────────────────

export type ContractNegotiationInput = {
  player: Player;
  manager: HumanManager;
  /** Team's current budget sliders — provides `valb(1..5, pv)`. */
  budget: TeamBudget;
  /**
   * Whether the player has already been negotiated with this round.
   * QB `pel.neu = 1`. Produces immediate `alreadyNegotiated` outcome.
   */
  alreadyNegotiated: boolean;
  /** Seeded random instance — used for all acceptance rolls. */
  random: Random;
};

export type ContractNegotiationOutput =
  | {
      outcome: "signed";
      contract: RegularContract;
      /** QB `gnome = 3` — player accepted very happily. */
      playerWasHappy: boolean;
      playerLines: string[];
      effects: EventEffect[];
    }
  | { outcome: "refused"; playerLines: string[]; effects: EventEffect[] }
  | { outcome: "playerWalked"; playerLines: string[]; effects: EventEffect[] }
  | {
      outcome: "alreadyNegotiated";
      playerLines: string[];
      effects: EventEffect[];
    }
  | { outcome: "cancelled"; effects: EventEffect[] };

// ─── Internal types ───────────────────────────────────────────────────────────

/**
 * Intermediate result stored in context during negotiation.
 * `playerLines` and `effects` are assembled in the output selector.
 */
type InternalNegotiationResult =
  | { outcome: "signed"; contract: RegularContract; playerWasHappy: boolean }
  | { outcome: "refused" }
  | { outcome: "playerWalked" }
  | { outcome: "alreadyNegotiated" }
  | { outcome: "cancelled" };

// ─── Machine context ──────────────────────────────────────────────────────────

export type ContractNegotiationContext = {
  player: Player;
  manager: HumanManager;
  budget: TeamBudget;
  random: Random;

  /** QB `a` — team-needs rating, always ≤ 0. */
  teamNeedsRating: number;
  /** QB `rahna` — base salary from `palkmaar`. */
  baseSalary: number;
  /** QB `sopimus(2)` — player's patience / willingness threshold. */
  willingnessThreshold: number;
  /** QB `optio(2)` — minimum duration for NHL clause to be eligible (0 = not eligible). */
  nhlOptionThreshold: number;
  /** QB `d` counter — increments by 2 on each `NEGOTIATE` attempt. */
  negotiationRound: number;

  // Current offer
  /** QB `sopimus(1)` — contract duration in years (1..4). */
  duration: number;
  /** QB `optio(1)`: 0=none, 1=nhl, 2=free-fire. */
  clause: SpecialClause;
  /** QB `palkehd(1)` — offered salary; starts at `baseSalary`, adjustable ±1.5%. */
  offeredSalary: number;

  /**
   * Accumulated player dialog lines (Markdown strings).
   * Lines are pushed as the negotiation progresses — never replaced.
   * Port of QB `lentti 4, sano%` calls from S4.MHM.
   */
  playerLines: string[];

  // Terminal result (set before entering final states)
  result: InternalNegotiationResult | null;
};

// ─── Events ───────────────────────────────────────────────────────────────────

type ContractNegotiationEvent =
  | { type: "INCREASE_DURATION" }
  | { type: "DECREASE_DURATION" }
  | { type: "NEXT_CLAUSE" }
  | { type: "PREV_CLAUSE" }
  | { type: "INCREASE_SALARY" }
  | { type: "DECREASE_SALARY" }
  | { type: "RESET_SALARY" }
  | { type: "NEGOTIATE" }
  | { type: "QUIT" }
  | { type: "ADVANCE" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CLAUSE_ORDER: SpecialClause[] = ["none", "nhl", "free-fire"];

function nextClause(current: SpecialClause, dir: 1 | -1): SpecialClause {
  const idx = CLAUSE_ORDER.indexOf(current);
  return CLAUSE_ORDER[Math.max(0, Math.min(2, idx + dir))];
}

function buildSignedContract(ctx: ContractNegotiationContext): RegularContract {
  const base: RegularContract = {
    type: "regular",
    duration: ctx.duration,
    salary: ctx.offeredSalary
  };
  if (ctx.clause === "nhl") {
    // NHL clause: starts fresh (freshlySigned = true).
    // Auto-cleared if svu = 1 (QB ILEX5.BAS:6558).
    if (ctx.duration === 1) {
      return base;
    }
    return { ...base, specialClause: { kind: "nhl", freshlySigned: true } };
  }
  if (ctx.clause === "free-fire") {
    return { ...base, specialClause: { kind: "free-fire" } };
  }
  return base;
}

/** Roll a random variant (0..5) of a dialog line. */
function rollLine(key: NegotiationDialogKey, random: Random): string {
  return getDialogLine(key, random.integer(0, 5));
}

/**
 * QB condition: `neup.spe >= 30000 OR neup.spe = 13`
 * spe=13 = permanent zombie; spe>=30000 = temporarily zombiPowdered (tag "zombified").
 * Greedy surfer (spe=8) is NOT here — they negotiate normally.
 */
function isZombie(player: Player): boolean {
  return player.tags.includes("zombified") || player.specialty === "zombie";
}

/**
 * Build the initial player dialog lines for the negotiating state.
 * Port of QB willingness + opening-line display (ILEX5.BAS:6337-6401).
 */
function buildInitialLines(
  teamNeedsRating: number,
  isPlayerSpecial: boolean,
  random: Random
): string[] {
  if (isPlayerSpecial) {
    // spe>=30000 or spe=13: skips willingness block, shows unintelligible sound
    return [rollLine("zombieSound", random)];
  }
  // Normal player: willingness reaction + opening line
  let willingnessKey: NegotiationDialogKey;
  if (teamNeedsRating < -1) {
    willingnessKey = "unhappy";
  } else if (teamNeedsRating < 0) {
    willingnessKey = "neutral";
  } else {
    willingnessKey = "happy";
  }
  return [rollLine(willingnessKey, random), rollLine("openingLine", random)];
}

function buildOutputEffects(ctx: ContractNegotiationContext): EventEffect[] {
  const result = ctx.result;
  if (!result || result.outcome === "cancelled") {
    return [];
  }
  if (result.outcome === "signed") {
    if (ctx.player.type === "market") {
      return [
        {
          type: "signMarketPlayer",
          manager: ctx.manager.id,
          player: ctx.player,
          contract: result.contract,
          playerWasHappy: result.playerWasHappy
        }
      ];
    }

    return [
      {
        type: "signRosterPlayer",
        manager: ctx.manager.id,
        player: ctx.player,
        contract: result.contract,
        playerWasHappy: result.playerWasHappy
      }
    ];
  }
  if (result.outcome === "refused" || result.outcome === "playerWalked") {
    return [
      {
        type: "irritatePlayer",
        managerId: ctx.manager.id,
        playerId: ctx.player.id,
        kind: ctx.player.type === "market" ? "market" : "hired"
      }
    ];
  }
  // alreadyNegotiated: tag already present, nothing to apply
  return [];
}

// ─── Machine ──────────────────────────────────────────────────────────────────

export const contractNegotiationMachine = setup({
  types: {
    context: {} as ContractNegotiationContext,
    input: {} as ContractNegotiationInput,
    events: {} as ContractNegotiationEvent,
    output: {} as ContractNegotiationOutput
  },
  guards: {
    earlyExit: ({ context }) => context.result !== null
  }
}).createMachine({
  id: "contractNegotiation",
  output: ({ context }): ContractNegotiationOutput => {
    const result = context.result ?? { outcome: "cancelled" as const };
    const effects = buildOutputEffects(context);
    if (result.outcome === "cancelled") {
      return { outcome: "cancelled", effects };
    }
    return { ...result, playerLines: context.playerLines, effects };
  },
  context: ({ input }) => {
    console.log("HEPS KUKKUU", input);

    const teamNeedsRating = computeTeamNeedsRating(input.budget, input.player);
    const baseSalary = computeSalary(input.player);
    const willingnessThreshold = computeWillingnessThreshold(
      teamNeedsRating,
      input.manager.attributes.charisma
    );
    const nhlOptionThreshold = computeNhlOptionThreshold(
      input.player.age,
      input.player.skill
    );

    let initialResult: InternalNegotiationResult | null = null;
    let initialLines: string[] = [];

    const playerIsZombie = isZombie(input.player);

    if (input.alreadyNegotiated) {
      initialResult = { outcome: "alreadyNegotiated" };
      initialLines = [rollLine("alreadyNegotiated", input.random)];
    } else if (!playerIsZombie && teamNeedsRating <= -4) {
      initialResult = { outcome: "refused" };
      initialLines = [rollLine("refused", input.random)];
    } else {
      initialLines = buildInitialLines(
        teamNeedsRating,
        playerIsZombie,
        input.random
      );
    }

    return {
      player: input.player,
      manager: input.manager,
      budget: input.budget,
      random: input.random,
      teamNeedsRating,
      baseSalary,
      willingnessThreshold,
      nhlOptionThreshold,
      negotiationRound: 0,
      duration: 1,
      clause: "none",
      offeredSalary: baseSalary,
      playerLines: initialLines,
      result: initialResult
    };
  },
  initial: "willingness",
  states: {
    /**
     * Guard state — checks if negotiation can start at all.
     * No UI shown here; transitions are immediate.
     */
    willingness: {
      always: [
        { guard: "earlyExit", target: "result" },
        { target: "negotiating" }
      ]
    },

    /**
     * Main interactive state. The player sees the offer and can adjust it.
     * Equivalent to QB's `davor1` / `DO…LOOP` block.
     */
    negotiating: {
      on: {
        INCREASE_DURATION: {
          actions: assign({
            duration: ({ context }) => Math.min(4, context.duration + 1)
          })
        },
        DECREASE_DURATION: {
          actions: assign({
            duration: ({ context }) => Math.max(1, context.duration - 1)
          })
        },
        NEXT_CLAUSE: {
          actions: assign({
            clause: ({ context }) => nextClause(context.clause, 1)
          })
        },
        PREV_CLAUSE: {
          actions: assign({
            clause: ({ context }) => nextClause(context.clause, -1)
          })
        },
        INCREASE_SALARY: {
          actions: assign({
            offeredSalary: ({ context }) =>
              adjustSalary(context.offeredSalary, "up")
          })
        },
        DECREASE_SALARY: {
          actions: assign({
            offeredSalary: ({ context }) =>
              adjustSalary(context.offeredSalary, "down")
          })
        },
        RESET_SALARY: {
          actions: assign({
            offeredSalary: ({ context }) => context.baseSalary
          })
        },
        NEGOTIATE: {
          actions: assign(({ context }) => {
            const newRound = context.negotiationRound + 2;

            const asking = computeAskingPrice(
              context.player,
              context.baseSalary,
              context.teamNeedsRating,
              context.duration,
              context.clause,
              context.nhlOptionThreshold
            );
            const probability = computeAcceptanceProbability(
              context.offeredSalary,
              asking,
              context.manager.attributes.negotiation
            );
            const attempt = attemptNegotiation(
              probability,
              context.willingnessThreshold,
              newRound,
              context.manager.attributes.negotiation,
              context.random.real(0, 1)
            );

            if (attempt.outcome === "accepted") {
              const acceptLine = rollLine(
                attempt.happy ? "acceptedHappy" : "acceptedOk",
                context.random
              );
              return {
                negotiationRound: newRound,
                playerLines: [...context.playerLines, acceptLine],
                result: {
                  outcome: "signed" as const,
                  contract: buildSignedContract({
                    ...context,
                    negotiationRound: newRound
                  }),
                  playerWasHappy: attempt.happy
                }
              };
            }

            const newThreshold = attempt.newThreshold;
            const newLines: string[] = [];

            if (newThreshold <= 0 || newThreshold < 30) {
              newLines.push(rollLine("veryImpatient", context.random));
            } else if (newThreshold < 50) {
              newLines.push(rollLine("impatient", context.random));
            } else {
              newLines.push(rollLine("rejection", context.random));
            }

            if (
              context.nhlOptionThreshold > 0 &&
              context.duration >= context.nhlOptionThreshold
            ) {
              newLines.push(rollLine("nhlHint", context.random));
            }

            if (context.clause === "free-fire") {
              newLines.push(rollLine("freeFireComplaint", context.random));
            }

            if (newThreshold <= 0) {
              return {
                negotiationRound: newRound,
                willingnessThreshold: 0,
                playerLines: [...context.playerLines, ...newLines],
                result: { outcome: "playerWalked" as const }
              };
            }

            return {
              negotiationRound: newRound,
              willingnessThreshold: newThreshold,
              playerLines: [...context.playerLines, ...newLines]
            };
          })
        },
        // QUIT exits immediately — no result state, no effect.
        QUIT: {
          target: "done",
          actions: assign({ result: () => ({ outcome: "cancelled" as const }) })
        }
      },
      always: [
        {
          guard: ({ context }) => context.result?.outcome === "signed",
          target: "result"
        },
        {
          guard: ({ context }) => context.result?.outcome === "playerWalked",
          target: "result"
        }
      ]
    },

    /**
     * Terminal display state — the player acknowledges the outcome.
     * The machine stays alive so the UI can read `context.playerLines`
     * and `context.result` directly. ADVANCE completes the machine.
     */
    result: {
      on: {
        ADVANCE: "done"
      }
    },

    done: {
      type: "final"
    }
  }
});
