import type { Random } from "random-js";
import type { Player } from "@/state/player";
import type { TeamStrength } from "@/data/levels";
import { keisit } from "@/data/keisit";
import { createUniqueId } from "@/services/id";
import { generateBaseAttributes } from "./generate-player";

type QbPosition = Player["position"];

/**
 * Map QB slot index (1-based, 1..24) to player position.
 * Port of the position assignment in `gene` (MHM2K.BAS:1038-1038, 1089-1089).
 */
function positionForSlot(slot: number): QbPosition {
  if (slot <= 2) return "g";
  if (slot <= 8) return "d";
  if (slot <= 12) return "lw";
  if (slot <= 16) return "c";
  if (slot <= 20) return "rw";
  // Slots 21-24: bench
  if (slot === 21) return "d";
  if (slot === 22) return "lw";
  if (slot === 23) return "c";
  return "rw"; // slot 24
}

function pickNation(random: Random): number {
  // 70% Pekkalandian, 30% random from nation pool — QB gene:1033,1085
  return random.integer(0, 100) < 70 ? 1 : keisit[0][random.integer(0, 99)];
}

/**
 * Port of `gene` SUB (MHM2K.BAS:1026-1120).
 * Generates the 24-player human team roster from team strength parameters.
 *
 * Slot layout (1-indexed, as in QB):
 *   1-2    goalies       (ppp=1)
 *   3-8    defenders     (ppp=2)
 *   9-12   left wings    (ppp=3)
 *  13-16   centres       (ppp=4)
 *  17-20   right wings   (ppp=5)
 *  21      bench D       (ppp=2)
 *  22      bench LW      (ppp=3)
 *  23      bench C       (ppp=4)
 *  24      bench RW      (ppp=5)
 */
export function generateTeamRoster(
  strength: TeamStrength,
  random: Random
): Record<string, Player> {
  const { goalie: mw, defence: pw, attack: hw } = strength;

  // Target averages (CINT = round in QB)
  const defAvg = Math.round(pw / 6);
  const fwdAvg = Math.round(hw / 12);

  // Build 24 player skill slots (1-indexed internally)
  const skills: number[] = new Array(25).fill(0); // index 0 unused
  const nations: number[] = new Array(25).fill(1);

  // Slots 1-20: generate base skills from team strength
  for (let xx = 1; xx <= 20; xx++) {
    nations[xx] = pickNation(random);
    if (xx === 1) {
      skills[xx] = mw;
    } else if (xx === 2) {
      skills[xx] = mw - random.integer(0, 2) - 1;
    } else if (xx <= 8) {
      skills[xx] = defAvg;
    } else {
      skills[xx] = fwdAvg;
    }
  }

  // Balance defence (slots 3-8) to hit pw total
  const defTotal = skills.slice(3, 9).reduce((s, v) => s + v, 0);
  const defDelta = pw - defTotal;
  const defSign = defDelta < 0 ? -1 : 1;
  for (let i = 0; i < Math.abs(defDelta); i++) {
    const idx = random.integer(3, 8);
    skills[idx] += defSign;
  }

  // Balance forwards (slots 9-20) to hit hw total
  const fwdTotal = skills.slice(9, 21).reduce((s, v) => s + v, 0);
  const fwdDelta = hw - fwdTotal;
  const fwdSign = fwdDelta < 0 ? -1 : 1;
  for (let i = 0; i < Math.abs(fwdDelta); i++) {
    const idx = random.integer(9, 20);
    skills[idx] += fwdSign;
  }

  // Slots 21-24: bench players (QB:1084-1092)
  for (let xx = 21; xx <= 24; xx++) {
    nations[xx] = pickNation(random);
    const isDefence = xx === 21;
    const base = isDefence ? defAvg : fwdAvg;
    skills[xx] = Math.max(1, base - random.integer(0, 3) - 1);
  }

  // Defence redistribution passes (QB:1096-1106)
  const defPasses = defAvg <= 7 ? 3 : defAvg <= 9 ? 5 : 6;
  for (let d = 0; d < defPasses; d++) {
    let z: number, zz: number;
    do {
      z = random.integer(3, 8);
      zz = random.integer(3, 8);
    } while (z === zz || skills[z] === 1);
    skills[z]--;
    skills[zz]++;
  }

  // Forward redistribution passes (QB:1108-1118)
  const fwdPasses = fwdAvg <= 7 ? 7 : fwdAvg <= 9 ? 9 : 11;
  for (let d = 0; d < fwdPasses; d++) {
    let z: number, zz: number;
    do {
      z = random.integer(9, 20);
      zz = random.integer(9, 20);
    } while (z === zz || skills[z] === 1);
    skills[z]--;
    skills[zz]++;
  }

  // Assemble Player records
  const result: Record<string, Player> = {};

  for (let slot = 1; slot <= 24; slot++) {
    const legacyNation = nations[slot];
    const base = generateBaseAttributes(legacyNation, random);
    const position = positionForSlot(slot);

    // Contract duration: bench players get 1 year, main roster 0-1 (QB svu = INT(2*RND))
    const contractDuration = slot >= 21 ? 1 : random.integer(0, 1);

    const player: Player = {
      ...base,
      position,
      skill: Math.max(1, skills[slot]),
      specialty: null,
      effects: [],
      tags: [],
      condition: 0,
      contract: {
        type: "regular",
        duration: contractDuration,
        salary: Math.max(1, skills[slot]) * 1000
      },
      stats: {
        season: { games: 0, goals: 0, assists: 0 },
        total: { games: 0, goals: 0, assists: 0 }
      }
    };

    result[createUniqueId()] = player;
  }

  return result;
}
