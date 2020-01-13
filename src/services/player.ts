import { Player, PlayerPosition } from "../types/player";
import random, { doubleNormalizedInt } from "./random";
import {
  countryFromLegacyCountry,
  createFirstName,
  createLastName,
  legacyCountryFromCountry
} from "./country";
import { AllCountries, PlayableCountries } from "../types/country";
import util from "util";
import { skillGenerationMap, randoms } from "./data/player-randomization";
import { min, max } from "ramda";

const legacyPositionMap = {
  1: "g",
  2: "d",
  3: "lw",
  4: "c",
  5: "rw"
};

/*
  DIM pros(1 TO 200) AS INTEGER
c = 1
d = 1
FOR qwe = 1 TO 200
IF borssix(c, nats) > d THEN pros(qwe) = c: d = d + 1: GOTO purkka
IF borssix(c, nats) = d THEN pros(qwe) = c: d = 1: c = c + 1
purkka:
NEXT qwe
bel(xxx).psk = ((pros(INT(200 * RND) + 1)) * 2) + INT(3 * RND) - 1
ERASE pros
IF bel(xxx).psk > 6 THEN
temp% = INT(100 * RND) + 1
IF temp% < 11 THEN bel(xxx).spe = 8 ELSE IF temp% < 16 THEN bel(xxx).spe = 5 ELSE IF temp% < 19 THEN bel(xxx).spe = 2 ELSE IF temp% < 22 AND bel(xxx).age >= 30 THEN bel(xxx).spe = 1
END IF
}
*/

export const randomSkill = (country: PlayableCountries) => {
  if (!skillGenerationMap[country]) {
    throw new Error(`Invalid country "${country}"`);
  }
  return (
    random.pick(skillGenerationMap[country]) * 2 + random.integer(0, 2) - 1
  );
};

export const normalizeAbility = (ability: number): number => {
  return max(1, min(ability, 20));
};

export const normalizeModifier = (modifier: number): number => {
  return max(-3, min(modifier, 3));
};

export const positionFromLegacyPosition = (
  legacyPosition: number
): PlayerPosition => legacyPositionMap[legacyPosition];

export const createRandomPlayer = (): Player => {
  const country = countryFromLegacyCountry(random.pick(randoms.nationality));
  const firstName = createFirstName(country);
  const lastName = createLastName(country);
  const skill = randomSkill(country);

  const position = positionFromLegacyPosition(random.pick(randoms.positions));

  const age = random.pick(randoms.age);
  const ego = random.pick(randoms.ego);

  const leadership =
    randoms.leadership[doubleNormalizedInt(randoms.leadership.length)];

  const charisma =
    randoms.charisma[doubleNormalizedInt(randoms.charisma.length)];

  const pp = random.pick(randoms.specialTeams);
  const pk = random.pick(randoms.specialTeams);

  return createPlayer(
    lastName,
    firstName,
    skill,
    country,
    position,
    age,
    ego,
    leadership,
    charisma,
    pp,
    pk
  );
};

export const createPlayer = (
  lastName: string,
  firstName: string,
  skill: number,
  country: AllCountries,
  position: PlayerPosition,
  age: number,
  ego: number,
  leadership: number,
  charisma: number,
  pp: number,
  pk: number
): Player => {
  const player: Player = {
    firstName: firstName.substr(0, 1),
    lastName,
    skill: normalizeAbility(skill),
    country,
    position,
    age,
    ego: normalizeAbility(ego),
    leadership: normalizeAbility(leadership),
    charisma: normalizeAbility(charisma),
    pp: normalizeModifier(pp),
    pk: normalizeModifier(pk)
  };
  return player;
};
