import type { Random } from "random-js";
import type { HiredPlayer, BasePlayer } from "@/state/player";
import type { HumanTeam } from "@/state/game";
import type { ManagerAttributes } from "@/data/managers";
import type { CrisisOption } from "@/data/crisis";
import { values } from "remeda";

/**
 * One narrative scene from the crisis meeting evening.
 * Each scene maps to a KR.MHM record and carries its gameplay effect.
 */
export type CrisisMeetingScene = {
  /** KR.MHM record number (1-based). */
  textKey: number;
  /** Template vars for the text: {captainName}, {egoPlayerName}, {randomTeammateName}. */
  templateVars: Record<string, string>;
  /** Morale delta applied by this scene. */
  moraleDelta: number;
  /** If this scene causes an injury. */
  injury?: { playerId: string; rounds: number };
};

export type CrisisMeetingResult = {
  option: CrisisOption;
  hasCaptain: boolean;
  scenes: CrisisMeetingScene[];
  totalMoraleDelta: number;
};

// ── Helpers ──────────────────────────────────────────────────────

/**
 * Captain quality score — QB `sin1 = (age + ldr^1.3) / 50`,
 * penalised if captain skill is below team average.
 * (ILEX5.BAS:2782-2783, identical to `suosikki(2, ...)` ranking)
 */
export const captainScore = (
  captain: BasePlayer,
  teamAvgSkill: number
): number => {
  let sin1 = (captain.age + captain.leadership ** 1.3) / 50;
  if (captain.skill < teamAvgSkill) {
    sin1 *= captain.skill / teamAvgSkill;
  }
  return sin1;
};

/**
 * Find a high-ego player — port of QB `SUB al` with fat=6 (gnome=3)
 * and fat=7 (gnome=5). Makes 60 random attempts to find a player
 * with `ego > 15` AND a probability check `100*RND < (ego-15)*gnome`.
 *
 * Returns the player or undefined. The found player is the one whose
 * name renders as `@1` in the ego-player scenes (QB overwrites `xx`).
 */
export const findEgoPlayer = (
  players: readonly HiredPlayer[],
  random: Random,
  gnome: 3 | 5
): HiredPlayer | undefined => {
  if (players.length === 0) {
    return undefined;
  }

  for (let attempt = 0; attempt < 60; attempt++) {
    const idx = random.integer(0, players.length - 1);
    const player = players[idx];
    if (player.ego > 15) {
      if (random.integer(1, 100) < (player.ego - 15) * gnome) {
        return player;
      }
    }
  }
  return undefined;
};

/**
 * Compute the team's average skill from its roster.
 * QB `avg(1, pv)` — mean of `pel(*, pv).psk` for all rostered players.
 */
const teamAverageSkill = (players: readonly HiredPlayer[]): number => {
  if (players.length === 0) {
    return 1;
  }
  const sum = players.reduce((acc, p) => acc + p.skill, 0);
  return sum / players.length;
};

const playerName = (p: BasePlayer): string => `${p.initial}. ${p.surname}`;

// ── Option resolvers ────────────────────────────────────────────

/**
 * Option 1: KRIISIPALAVERI — one roll, captain-only.
 * QB ILEX5.BAS:2787-2793
 */
const resolveOption1 = (
  sin1: number,
  resourcefulness: number,
  captainName: string,
  random: Random
): CrisisMeetingScene[] => {
  const scenes: CrisisMeetingScene[] = [];
  const vars = { captainName };

  // Setup: rec 4
  scenes.push({ textKey: 4, templateVars: vars, moraleDelta: 0 });

  // QB: a = 50 + mtaito(4) * 10; a = a * sin1^2; IF 100*RND < a THEN ...
  const threshold = (50 + resourcefulness * 10) * sin1 ** 2;
  if (random.integer(1, 100) < threshold) {
    // Success: +1 or +2 morale
    const gain = random.integer(1, 2);
    scenes.push({ textKey: 5, templateVars: vars, moraleDelta: gain });
  } else {
    // Failure: no morale change
    scenes.push({ textKey: 6, templateVars: vars, moraleDelta: 0 });
  }

  return scenes;
};

/**
 * Option 2: ALKOHOLITON SAUNAILTA — three independent rolls.
 * QB ILEX5.BAS:2795-2824
 */
const resolveOption2 = (
  sin1: number,
  resourcefulness: number,
  captainName: string,
  rosterPlayers: readonly HiredPlayer[],
  random: Random
): CrisisMeetingScene[] => {
  const scenes: CrisisMeetingScene[] = [];
  const captainVars = { captainName };

  // Intro: rec 7
  scenes.push({ textKey: 7, templateVars: captainVars, moraleDelta: 0 });

  // ── Roll A: captain behavior ──
  // QB: sin2 = (1 - sin1^1.5) * 100 + 30
  const sin2 = (1 - sin1 ** 1.5) * 100 + 30;
  if (random.integer(1, 100) < sin2) {
    // Captain misbehaves: recs 9, 10, 11
    const rec = random.integer(0, 2) + 9;
    scenes.push({ textKey: rec, templateVars: captainVars, moraleDelta: -1 });
  } else {
    // Captain shines: recs 12, 13, 14
    const rec = random.integer(0, 2) + 12;
    scenes.push({ textKey: rec, templateVars: captainVars, moraleDelta: 2 });
  }

  // ── Roll B: manager performance ──
  // QB: CASE IS <= 20 - mtaito(4) * 5 / CASE IS >= 80 - mtaito(4) * 5
  const roll = random.integer(1, 100);
  const badThreshold = 20 - resourcefulness * 5;
  const goodThreshold = 80 - resourcefulness * 5;
  if (roll <= badThreshold) {
    scenes.push({ textKey: 15, templateVars: captainVars, moraleDelta: -1 });
  } else if (roll >= goodThreshold) {
    scenes.push({ textKey: 16, templateVars: captainVars, moraleDelta: 2 });
  } else {
    scenes.push({ textKey: 17, templateVars: captainVars, moraleDelta: 0 });
  }

  // ── Roll C: ego player no-show ──
  // QB: al 6 (gnome=3); if found, recs 18/19/20, morale -1
  const egoPlayer = findEgoPlayer(rosterPlayers, random, 3);
  if (egoPlayer) {
    const rec = random.integer(0, 2) + 18;
    const vars = { egoPlayerName: playerName(egoPlayer) };
    scenes.push({ textKey: rec, templateVars: vars, moraleDelta: -1 });
  }

  return scenes;
};

/**
 * Option 3: KALJAHUURUINEN SAUNAILTA — up to four rolls, swingier.
 * QB ILEX5.BAS:2826-2867
 */
const resolveOption3 = (
  sin1: number,
  resourcefulness: number,
  captainName: string,
  rosterPlayers: readonly HiredPlayer[],
  coachingBudget: number,
  random: Random
): CrisisMeetingScene[] => {
  const scenes: CrisisMeetingScene[] = [];
  const captainVars = { captainName };

  // Intro: rec 8
  scenes.push({ textKey: 8, templateVars: captainVars, moraleDelta: 0 });

  // ── Roll A: assistant coach misbehavior ──
  // QB: IF valb(1, pv) < 4 THEN IF 100*RND < (4-valb(1,pv))*5 THEN ...
  if (coachingBudget < 4) {
    if (random.integer(1, 100) < (4 - coachingBudget) * 5) {
      const rec = random.integer(0, 2) + 21;
      scenes.push({ textKey: rec, templateVars: captainVars, moraleDelta: -1 });
    }
  }

  // ── Roll B: captain behavior ──
  // QB: sin2 = (1 - sin1^2) * 100 + 40
  const sin2 = (1 - sin1 ** 2) * 100 + 40;
  if (random.integer(1, 100) < sin2) {
    // Captain fails: recs 27, 28, 29
    const rec = random.integer(0, 2) + 27;
    scenes.push({ textKey: rec, templateVars: captainVars, moraleDelta: -2 });
  } else {
    // Captain shines: recs 24, 25, 26
    const rec = random.integer(0, 2) + 24;
    scenes.push({ textKey: rec, templateVars: captainVars, moraleDelta: 3 });
  }

  // ── Roll C: manager performance ──
  // QB: CASE IS <= 30 - mtaito(4)*10 / CASE IS >= 70 - mtaito(4)*10
  const roll = random.integer(1, 100);
  const badThreshold = 30 - resourcefulness * 10;
  const goodThreshold = 70 - resourcefulness * 10;
  if (roll <= badThreshold) {
    scenes.push({ textKey: 30, templateVars: captainVars, moraleDelta: -2 });
  } else if (roll >= goodThreshold) {
    scenes.push({ textKey: 31, templateVars: captainVars, moraleDelta: 3 });
  } else {
    scenes.push({ textKey: 32, templateVars: captainVars, moraleDelta: 0 });
  }

  // ── Roll D: ego player meltdown + possible injury ──
  // QB: al 7 (gnome=5); if found, recs 33/34/35
  const egoPlayer = findEgoPlayer(rosterPlayers, random, 5);
  if (egoPlayer) {
    const qwe = random.integer(0, 2);
    const rec = qwe + 33;
    const vars = { egoPlayerName: playerName(egoPlayer) };
    let moraleDelta = -2;
    let injury: CrisisMeetingScene["injury"] | undefined;

    // QB: IF qwe = 2 THEN injury + extra morale hit
    if (qwe === 2) {
      moraleDelta = -3; // -2 base + -1 extra
      // QB: IF pel(xx,pv).inj = 0 THEN pel(xx,pv).inj = INT(5*RND) + 3
      const hasInjury = egoPlayer.effects.some((e) => e.type === "injury");
      if (!hasInjury) {
        injury = {
          playerId: egoPlayer.id,
          rounds: random.integer(3, 7)
        };
      }
    }

    scenes.push({ textKey: rec, templateVars: vars, moraleDelta, injury });
  }

  return scenes;
};

// ── Main resolve function ───────────────────────────────────────

/**
 * Resolve a crisis meeting. All random rolls happen here (random
 * discipline). The result is a snapshot that can be rendered and
 * replayed deterministically.
 *
 * Faithful port of `SUB kriisipalaveri` (ILEX5.BAS:2747-2872).
 */
export const resolveCrisisMeeting = (
  team: HumanTeam,
  manager: { attributes: ManagerAttributes },
  option: CrisisOption,
  random: Random
): CrisisMeetingResult => {
  const rosterPlayers = values(team.players);
  const captain = team.lineup.captain
    ? team.players[team.lineup.captain]
    : undefined;

  // ── No captain: shame scene + flat morale loss ──
  // QB: IF xx = 0 THEN lt "kr", 0+kurso; mor u(pv), -kurso
  if (!captain) {
    const templateVars: Record<string, string> = {};

    // Option 3 (wet sauna) uses @7 = random teammate name
    if (option === 3 && rosterPlayers.length > 0) {
      const randomIdx = random.integer(0, rosterPlayers.length - 1);
      templateVars.randomTeammateName = playerName(rosterPlayers[randomIdx]);
    }

    return {
      option,
      hasCaptain: false,
      scenes: [
        {
          textKey: option, // rec 1, 2, or 3
          templateVars,
          moraleDelta: -option // -1, -2, or -3
        }
      ],
      totalMoraleDelta: -option
    };
  }

  // ── Has captain: compute quality score and resolve option ──
  const avgSkill = teamAverageSkill(rosterPlayers);
  const sin1 = captainScore(captain, avgSkill);
  const cName = playerName(captain);
  const resourcefulness = manager.attributes.resourcefulness;

  let scenes: CrisisMeetingScene[];
  switch (option) {
    case 1:
      scenes = resolveOption1(sin1, resourcefulness, cName, random);
      break;
    case 2:
      scenes = resolveOption2(
        sin1,
        resourcefulness,
        cName,
        rosterPlayers,
        random
      );
      break;
    case 3:
      scenes = resolveOption3(
        sin1,
        resourcefulness,
        cName,
        rosterPlayers,
        team.budget.coaching,
        random
      );
      break;
  }

  const totalMoraleDelta = scenes.reduce((sum, s) => sum + s.moraleDelta, 0);

  return { option, hasCaptain: true, scenes, totalMoraleDelta };
};
