import type { Random } from "random-js";
import type { CountryIso } from "@/data/countries";
import type { Player } from "@/state/player";
import { keisit } from "@/data/keisit";
import { legacyNationalityToIso } from "@/services/country";
import { initialsFor } from "@/data/initials";
import { getSurnamesFor } from "@/data/names";

/** QB position integer → Player.position string */
const positionByQbIndex: Record<number, Player["position"]> = {
  1: "g",
  2: "d",
  3: "lw",
  4: "c",
  5: "rw"
};

/**
 * Pick a random surname from the .MHX pool for the given nationality.
 * Nations 18..22 (BR, ZW, ES, XX, KP) have no .MHX file — fall back to FI.
 */
function pickSurname(iso: CountryIso, random: Random): string {
  const pool = getSurnamesFor(iso) ?? getSurnamesFor("FI")!;
  return pool[random.integer(0, pool.length - 1)];
}

/**
 * Port of the `rela` SUB (ILEX5.BAS:5228) + `mahmax` name picker
 * (MHM2K.BAS:1548).
 *
 * Fills all player attributes from KEISIT.M2K distributions. The caller
 * must set `skill` (psk) separately — both `borsgene` and `gene` set it
 * after calling `rela`.
 *
 * @param legacyNation  QB nation index 1..17 (already picked by caller)
 */
export function generateBaseAttributes(
  legacyNation: number,
  random: Random
): Omit<Player, "skill" | "contract" | "specialty" | "effects" | "tags" | "stats" | "condition" | "plannedDeparture"> {
  // keisit rows are 0-indexed; QB keisix(row, col) → keisit[row-1][col-1]
  const posQb = keisit[1][random.integer(0, 99)];
  const age    = keisit[2][random.integer(0, 99)];
  const ego    = keisit[3][random.integer(0, 99)];

  // Leadership & charisma use triangular distribution (average of two rolls)
  const ldrIdx = Math.floor((random.integer(0, 99) + random.integer(0, 99)) / 2);
  const karIdx = Math.floor((random.integer(0, 99) + random.integer(0, 99)) / 2);
  const leadership = keisit[4][ldrIdx];
  const charisma   = keisit[5][karIdx];

  const powerplayMod   = keisit[6][random.integer(0, 99)];
  const penaltyKillMod = keisit[6][random.integer(0, 99)];

  const position: Player["position"] = positionByQbIndex[posQb] ?? "c";

  const nationality = legacyNationalityToIso(legacyNation);

  // mahmax: pick surname from .MHX pool, pick initial letter
  const surname = pickSurname(nationality, random);
  const initials = initialsFor(nationality);
  const initial = initials[random.integer(0, initials.length - 1)];

  return {
    initial,
    surname,
    position,
    nationality,
    age,
    ego,
    leadership,
    charisma,
    powerplayMod,
    penaltyKillMod
  };
}
