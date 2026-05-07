/**
 * Contract negotiation machine — port of QB `sopimusext (fat%)` SUB
 * (ILEX5.BAS:6312-6588).
 *
 * Each negotiation is a spawned actor. The parent passes player/manager/budget
 * data as `input`; the actor completes with a `ContractNegotiationOutput`
 * that describes the outcome. The parent writes the result to game state.
 *
 * QB `fat%` parameter:
 *   fat% = 1: negotiating with an existing player in a team's roster
 *   fat% = 2: signing a free agent from the market (`bel`)
 * We expose this as `mode: "roster" | "market"` — the machine logic is
 * identical; the parent handles the state mutation differently based on mode.
 */

import { setup, assign } from "xstate";
import type { Random } from "random-js";
import type { TeamBudget } from "@/data/mhm2000/budget";
import type { MarketPlayer, Player, RegularContract } from "@/state/player";
import {
  type SpecialClause,
  computeTeamNeedsRating,
  computeWillingnessThreshold,
  computeNhlOptionThreshold,
  computeAskingPrice,
  computeAcceptanceProbability,
  attemptNegotiation,
  adjustSalary,
  computeBaseSalary
} from "@/services/mhm-2000/contract-negotiation";
import {
  type NegotiationDialogKey,
  getDialogLine
} from "@/data/mhm2000/negotiation-dialog";

// ─── Public types ─────────────────────────────────────────────────────────────

export type ContractNegotiationMode = "roster" | "market";

export type ContractNegotiationInput = {
  player: MarketPlayer;
  mode: ContractNegotiationMode;
  /** QB `mtaito(3, manager)` — negotiation attribute, range -3..+3. */
  managerNegotiation: number;
  /** QB `mtaito(5, manager)` — charisma attribute, range -3..+3. */
  managerCharisma: number;
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
    }
  | { outcome: "refused" } // player refused to negotiate (a <= -4)
  | { outcome: "playerWalked" } // player's patience hit 0
  | { outcome: "alreadyNegotiated" } // neu = 1 this round
  | { outcome: "cancelled" }; // manager quit

// ─── Machine context ──────────────────────────────────────────────────────────

type ContractNegotiationContext = {
  player: MarketPlayer;
  mode: ContractNegotiationMode;
  managerNegotiation: number;
  managerCharisma: number;
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
  result: ContractNegotiationOutput | null;
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
  | { type: "QUIT" };

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

function isSpecial(player: Player): boolean {
  // ZOMBIE and GREEDY SURFER ARE NOT HANDLED SIMILARLY FOR REALS
  return (
    player.tags.includes("zombified") || player.specialty === "greedySurfer"
  );
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
    // Zombie / greedySurfer: skips willingness block, shows unintelligible sound
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
  output: ({ context }) => context.result ?? { outcome: "cancelled" },
  context: ({ input }) => {
    const teamNeedsRating = computeTeamNeedsRating(input.budget, input.player);

    const baseSalary = computeBaseSalary(input.player);

    const willingnessThreshold = computeWillingnessThreshold(
      teamNeedsRating,
      input.managerCharisma
    );

    const nhlOptionThreshold = computeNhlOptionThreshold(
      input.player.age,
      input.player.skill
    );

    // Resolve early-exit conditions immediately so the willingness state
    // can check context.result instead of input.
    let initialResult: ContractNegotiationOutput | null = null;
    let initialLines: string[] = [];

    /*
    There is a bug here. Surfers will probably (dig QB code) always negotiate,
    but they will NOT make zombie sounds. Their greed is silent.
    */
    const isPlayerSpecial = isSpecial(input.player);

    if (input.alreadyNegotiated) {
      initialResult = { outcome: "alreadyNegotiated" };
      initialLines = [rollLine("alreadyNegotiated", input.random)];
    } else if (!isPlayerSpecial && teamNeedsRating <= -4) {
      initialResult = { outcome: "refused" };
      initialLines = [rollLine("refused", input.random)];
    } else {
      initialLines = buildInitialLines(
        teamNeedsRating,
        isSpecial(input.player),
        input.random
      );
    }

    return {
      player: input.player,
      mode: input.mode,
      managerNegotiation: input.managerNegotiation,
      managerCharisma: input.managerCharisma,
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
        // alreadyNegotiated or refused — set in context factory
        { guard: "earlyExit", target: "done" },
        // Otherwise: open for negotiation
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
              context.managerNegotiation
            );
            const attempt = attemptNegotiation(
              probability,
              context.willingnessThreshold,
              newRound,
              context.managerNegotiation,
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

            // Primary reaction line — based on updated patience
            if (newThreshold <= 0 || newThreshold < 30) {
              newLines.push(rollLine("veryImpatient", context.random));
            } else if (newThreshold < 50) {
              newLines.push(rollLine("impatient", context.random));
            } else {
              newLines.push(rollLine("rejection", context.random));
            }

            // Add-on: NHL aspirations (when duration meets eligibility threshold)
            if (
              context.nhlOptionThreshold > 0 &&
              context.duration >= context.nhlOptionThreshold
            ) {
              newLines.push(rollLine("nhlHint", context.random));
            }

            // Add-on: free-fire clause complaint
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
        QUIT: {
          target: "done",
          actions: assign({ result: () => ({ outcome: "cancelled" as const }) })
        }
      },
      always: [
        {
          guard: ({ context }) => context.result?.outcome === "signed",
          target: "done"
        },
        {
          guard: ({ context }) => context.result?.outcome === "playerWalked",
          target: "done"
        }
      ]
    },

    done: {
      type: "final"
    }
  }
});
