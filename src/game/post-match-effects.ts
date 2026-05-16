/**
 * Post-match random effects — QB `dap` rolls from Layer 4 of `sattuma`.
 *
 * After every match a human manager plays, three independent rolls fire:
 *   1. Injury  — `vai(4)%` gate (difficulty-scaled), picks healthy lineup player
 *   2. Mood    — 20% flat, picks player with no active skill modifier
 *   3. Suspension — 5% flat, picks healthy lineup player
 *
 * QB source: ILEX5.BAS:5634-5650 (`dap` CASE 1/2/3 inside `sattuma`).
 * Fires regardless of round type (runkosarja, EHL, cup, playoffs).
 *
 * Pure function: reads draft, returns EventEffect[]. No side effects.
 */

import type { Random } from "random-js";
import type { Draft } from "immer";

import type { GameContext } from "@/state/game-context";
import type { HumanTeam } from "@/state/game";
import type { HiredPlayer } from "@/state/player";
import type { EventEffect } from "@/game/event-effects";
import { difficultyLevels } from "@/data/mhm2000/difficulty-levels";
import { injuries } from "@/data/injuries";
import { banDefinitions } from "@/data/bans";
import { moodDefinitions } from "@/data/performance-modifier";

/**
 * Collect all unique player IDs that are in the lineup's base slots
 * (goalie + 4 forward lines + 3 defensive pairings). Powerplay and
 * penalty kill overlap with the base slots and are excluded to avoid
 * double-counting.
 *
 * QB `al 1` picks from `ket(xx) > 0` (the lineup array); we mirror
 * that by collecting the IDs from the structural lineup slots.
 */
function lineupPlayerIds(team: HumanTeam): string[] {
  const ids = new Set<string>();

  if (team.lineup.g) {
    ids.add(team.lineup.g);
  }

  for (const line of team.lineup.forwardLines) {
    if (line.lw) {
      ids.add(line.lw);
    }
    if (line.c) {
      ids.add(line.c);
    }
    if (line.rw) {
      ids.add(line.rw);
    }
  }
  for (const pair of team.lineup.defensivePairings) {
    if (pair.ld) {
      ids.add(pair.ld);
    }
    if (pair.rd) {
      ids.add(pair.rd);
    }
  }

  // A player can be slotted only in PP/PK (the Patrik Laine special).
  const pp = team.lineup.powerplayTeam;
  if (pp.lw) {ids.add(pp.lw);}
  if (pp.c) {ids.add(pp.c);}
  if (pp.rw) {ids.add(pp.rw);}
  if (pp.ld) {ids.add(pp.ld);}
  if (pp.rd) {ids.add(pp.rd);}

  const pk = team.lineup.penaltyKillTeam;
  if (pk.f1) {ids.add(pk.f1);}
  if (pk.f2) {ids.add(pk.f2);}
  if (pk.ld) {ids.add(pk.ld);}
  if (pk.rd) {ids.add(pk.rd);}

  return [...ids];
}

type PlayerPredicate = (player: HiredPlayer) => boolean;

/**
 * Pick a random player from the lineup matching `predicate`.
 * Returns `undefined` if no eligible player exists.
 *
 * QB equivalent: `SUB al` with various mode parameters.
 */
function pickLineupPlayer(
  team: HumanTeam,
  predicate: PlayerPredicate,
  random: Random
): HiredPlayer | undefined {
  const ids = lineupPlayerIds(team);
  const eligible = ids
    .map((id) => team.players[id])
    .filter((p): p is HiredPlayer => p !== undefined && predicate(p));

  if (eligible.length === 0) {
    return undefined;
  }

  return eligible[random.integer(0, eligible.length - 1)];
}

/**
 * QB `al 1` — healthy lineup player: no injury, suspension, strike,
 * or national-team absence effects.
 */
const isHealthy: PlayerPredicate = (player) =>
  !player.effects.some(
    (e) =>
      e.type === "injury" ||
      e.type === "suspension" ||
      e.type === "strike" ||
      e.type === "nationals"
  );

/**
 * QB `al 2` — player with no active performance modifier (`plus = 0
 * AND kest = 0`). Maps to no `skill` effect on the player.
 */
const hasNoMoodModifier: PlayerPredicate = (player) =>
  !player.effects.some((e) => e.type === "skill");

/**
 * Roll all three post-match effects for one human manager.
 *
 * Returns EventEffect[] to be applied by the caller via `applyEffects`.
 * All random rolls happen here (the "resolve" step in our architecture);
 * the effects are deterministic over the roll results.
 */
export function rollPostMatchEffects(
  draft: Draft<GameContext>,
  managerId: string,
  random: Random
): EventEffect[] {
  const effects: EventEffect[] = [];

  const manager = draft.managers[managerId];
  if (!manager || manager.kind !== "human" || manager.team === undefined) {
    return effects;
  }

  const team = draft.teams[manager.team];
  if (team.kind !== "human") {
    return effects;
  }

  // ── 1. Injury roll ──
  // QB: IF INT(101*RND) < vai(4, pv) THEN al 1: IF lukka = 0 THEN ...
  const injuryPercent =
    difficultyLevels[manager.difficulty].postMatchInjuryRollPercent;

  if (random.integer(0, 100) < injuryPercent) {
    const player = pickLineupPlayer(team, isHealthy, random);
    if (player) {
      // Roll injury type 1..44 (QB: lukka = INT(44*RND)+1)
      const injuryIndex = random.integer(0, 43);
      const injury = injuries[injuryIndex];
      if (injury) {
        const duration = injury.duration(team.budget.health);
        const playerName = `${player.initial}. ${player.surname}`;

        effects.push({
          type: "playerInjury",
          managerId,
          playerId: player.id,
          rounds: duration
        });

        // QB: lax 115 (season-ending) / lax 116 (timed) prefix + I.MHM body
        const prefix =
          duration === -1
            ? `**${playerName}** on loukkaantunut ja on sivussa loppukauden!`
            : `**${playerName}** on loukkaantunut ja on sivussa ${duration} ottelua.`;

        effects.push({
          type: "addAnnouncement",
          manager: managerId,
          text: `${prefix} ${injury.explanation(player)}`
        });
      }
    }
  }

  // ── 2. Mood roll ──
  // QB: IF INT(101*RND) < 20 THEN dap 3
  if (random.integer(0, 100) < 20) {
    const player = pickLineupPlayer(team, hasNoMoodModifier, random);
    if (player) {
      // Roll mood type 1..45 (QB: muud = INT(45*RND)+1)
      const moodIndex = random.integer(0, 44);
      const mood = moodDefinitions[moodIndex];
      if (mood) {
        // QB guard: psk + amount > 0 (don't reduce skill to ≤ 0)
        if (player.skill + mood.amount > 0) {
          // Duration: Math.floor(durationRange * RND) + durationBase + 1
          const duration =
            Math.floor(mood.durationRange * random.real(0, 1)) +
            mood.durationBase +
            1;
          const playerName = `${player.initial}. ${player.surname}`;

          effects.push({
            type: "playerMood",
            managerId,
            playerId: player.id,
            amount: mood.amount,
            rounds: duration
          });

          // QB: lax 120 (positive) / lax 121 (negative) prefix + M.MHM body
          const prefix =
            mood.amount > 0
              ? `**${playerName}** — hyviä uutisia pelaajasta:`
              : `**${playerName}** — huonoja uutisia pelaajasta:`;

          effects.push({
            type: "addAnnouncement",
            manager: managerId,
            text: `${prefix} ${mood.explanation}`
          });
        }
      }
    }
  }

  // ── 3. Suspension roll ──
  // QB: IF INT(101*RND) < 5 THEN al 1: IF lukka = 0 THEN lukka = INT(16*RND)+1: dap 2
  if (random.integer(0, 100) < 5) {
    const player = pickLineupPlayer(team, isHealthy, random);
    if (player) {
      // Roll suspension code 1..16 (QB: lukka = INT(16*RND)+1)
      const banIndex = random.integer(0, 15);
      const ban = banDefinitions[banIndex];
      if (ban) {
        const playerName = `${player.initial}. ${player.surname}`;

        effects.push({
          type: "playerSuspension",
          managerId,
          playerId: player.id,
          rounds: ban.duration
        });

        // QB: lax 117 prefix + PK.MHM body
        effects.push({
          type: "addAnnouncement",
          manager: managerId,
          text: `**${playerName}** on saanut pelikiellon (${ban.duration} ottelua). ${ban.explanation}`
        });
      }
    }
  }

  return effects;
}
