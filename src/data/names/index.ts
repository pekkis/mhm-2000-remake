// Aggregated player-surname pools keyed by ISO 3166-1 alpha-2 nationality.
// One source-of-truth lookup over the per-nation arrays in this folder
// (originally generated from DATA/<n>.MHX). Used by player generation
// to pick a surname matching a player's nationality.

import AT from "./AT";
import CA from "./CA";
import CH from "./CH";
import CZ from "./CZ";
import DE from "./DE";
import EE from "./EE";
import FI from "./FI";
import FR from "./FR";
import IT from "./IT";
import JP from "./JP";
import LV from "./LV";
import NO from "./NO";
import PL from "./PL";
import RU from "./RU";
import SE from "./SE";
import SK from "./SK";
import US from "./US";

export const surnamesByNationality: Readonly<Record<string, readonly string[]>> = {
  AT,
  CA,
  CH,
  CZ,
  DE,
  EE,
  FI,
  FR,
  IT,
  JP,
  LV,
  NO,
  PL,
  RU,
  SE,
  SK,
  US
};

/**
 * Surname pool for a nationality, or `undefined` if we have no pool
 * for it. Nations 18..22 from KANSAT.M2K (BR, ZW, ES, XX, KP) have no
 * .MHX surname file in the QB source — callers must decide on a
 * fallback (e.g. random pool / Pekkalandian default).
 */
export function getSurnamesFor(iso: string): readonly string[] | undefined {
  return surnamesByNationality[iso];
}
