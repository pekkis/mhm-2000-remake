import type { Random } from "random-js";

import type { HumanTeam } from "@/state/game";
import type { HiredPlayer } from "@/state/player";

/**
 * Collect all unique player IDs that are in the lineup — base slots
 * (goalie + 4 forward lines + 3 defensive pairings) plus PP/PK
 * special teams. A player can be slotted only in PP/PK without
 * appearing in any base line (the Patrik Laine special).
 *
 * QB `al 1` picks from `ket(xx) > 0` (the lineup array); we mirror
 * that by collecting the IDs from the structural lineup slots.
 */
export function lineupPlayerIds(team: HumanTeam): string[] {
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
  if (pp.lw) {
    ids.add(pp.lw);
  }
  if (pp.c) {
    ids.add(pp.c);
  }
  if (pp.rw) {
    ids.add(pp.rw);
  }
  if (pp.ld) {
    ids.add(pp.ld);
  }
  if (pp.rd) {
    ids.add(pp.rd);
  }

  const pk = team.lineup.penaltyKillTeam;
  if (pk.f1) {
    ids.add(pk.f1);
  }
  if (pk.f2) {
    ids.add(pk.f2);
  }
  if (pk.ld) {
    ids.add(pk.ld);
  }
  if (pk.rd) {
    ids.add(pk.rd);
  }

  return [...ids];
}

export type PlayerPredicate = (player: HiredPlayer) => boolean;

/**
 * Pick a random player from the lineup matching `predicate`.
 * Returns `undefined` if no eligible player exists.
 *
 * QB equivalent: `SUB al` with various mode parameters.
 */
export function pickLineupPlayer(
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
export const isHealthy: PlayerPredicate = (player) =>
  !player.effects.some(
    (e) =>
      e.type === "injury" ||
      e.type === "suspension" ||
      e.type === "strike" ||
      e.type === "nationals"
  );

export const isUnderContract: PlayerPredicate = (player) => {
  if (!player.contract) {
    return false;
  }

  if (player.contract.type === "guest") {
    return true;
  }

  if (player.contract.duration === 0) {
    return false;
  }

  return true;
};

/**
 * QB `al 2` — player with no active performance modifier (`plus = 0
 * AND kest = 0`). Maps to no `skill` effect on the player.
 */
export const hasNoMoodModifier: PlayerPredicate = (player) =>
  !player.effects.some((e) => e.type === "skill");
