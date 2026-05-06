import type { Random } from "random-js";
import type { MarketPlayer } from "@/state/player";
import type { PlayerSpecialtyKey } from "@/data/player-specialties";
import { keisit } from "@/data/keisit";
import { borssix } from "@/data/borssix";
import { createUniqueId } from "@/services/id";
import { generateBaseAttributes } from "./generate-player";

/**
 * Build the weighted 200-slot skill-bucket array for one nation.
 * Port of the inner loop in QB borsgene (ILEX5.BAS:1066-1073).
 * Each bucket b (1-based 1..9) occupies exactly borssix[nat0][b-1] slots.
 */
function buildSkillPool(nat0: number): number[] {
  const pros: number[] = new Array(200);
  let c = 0; // 0-based bucket index
  let d = 1; // running fill counter within current bucket
  for (let qwe = 0; qwe < 200; qwe++) {
    const count = borssix[nat0][c];
    if (count > d) {
      pros[qwe] = c + 1; // 1-based bucket for psk formula
      d++;
    } else {
      pros[qwe] = c + 1;
      d = 1;
      c++;
    }
  }
  return pros;
}

/**
 * Port of `borsgene` SUB (ILEX5.BAS:1061-1083).
 * Generates `count` free-agent market players.
 */
export function generateMarketPlayers(
  count: number,
  random: Random
): Record<string, MarketPlayer> {
  const result: Record<string, MarketPlayer> = {};

  for (let i = 0; i < count; i++) {
    const legacyNation = keisit[0][random.integer(0, 99)];
    const nat0 = legacyNation - 1; // 0-based for borssix

    const base = generateBaseAttributes(legacyNation, random);

    // Skill via borssix weighted bucket, then noise (QB: psk = bucket*2 + INT(3*RND) - 1)
    const pool = buildSkillPool(nat0);
    const bucket = pool[random.integer(0, 199)];
    const skill = Math.max(1, bucket * 2 + random.integer(0, 2) - 1);

    // Specialty roll — only for players with psk > 6
    let specialty: PlayerSpecialtyKey | null = null;
    if (skill > 6) {
      const roll = random.integer(1, 100);
      if (roll < 11) {
        specialty = "greedySurfer"; // QB spe=8
      } else if (roll < 16) {
        specialty = "enforcer"; // QB spe=5
      } else if (roll < 19) {
        specialty = "foulMouth"; // QB spe=2
      } else if (roll < 22 && base.age >= 30) {
        specialty = "evangelist"; // QB spe=1
      }
    }

    const player: MarketPlayer = {
      ...base,
      skill,
      specialty,
      effects: [],
      tags: [],
      condition: 0,
      askingSalary: skill * 1000,
      stats: {
        season: { games: 0, goals: 0, assists: 0 },
        total: { games: 0, goals: 0, assists: 0 }
      }
    };

    result[createUniqueId()] = player;
  }

  return result;
}
