import {
  Player,
  PlayerPosition,
  Contract,
  ContractNegotiation
} from "../types/player";
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
import uuid from "uuid";

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

export const randomSkill = (country: AllCountries) => {
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

export const getRandomCountry = () =>
  countryFromLegacyCountry(random.pick(randoms.nationality));

export const createRandomPlayer = (preset: Partial<Player> = {}): Player => {
  console.log("PRESET", preset);

  const country = preset.country || getRandomCountry();

  const firstName = preset.firstName || createFirstName(country);
  const lastName = preset.lastName || createLastName(country);
  const skill = preset.skill || randomSkill(country);

  const position =
    preset.position ||
    positionFromLegacyPosition(random.pick(randoms.positions));

  const age = preset.age || random.pick(randoms.age);
  const ego = preset.ego || random.pick(randoms.ego);

  const leadership =
    preset.leadership ||
    randoms.leadership[doubleNormalizedInt(randoms.leadership.length)];

  const charisma =
    preset.charisma ||
    randoms.charisma[doubleNormalizedInt(randoms.charisma.length)];

  const pp = preset.pp || random.pick(randoms.specialTeams);
  const pk = preset.pk || random.pick(randoms.specialTeams);

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
    id: uuid(),
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

/*
lhinta(1) = 20
lhinta(2) = 18
lhinta(3) = 15
perusraha = 100
potenssi = 1.17
potenssiplus = .035
xvolisa = .05
johlisa = .02
karlisa = .015
*/

const EXPONENTIAL = 1.17;
const EXPONENTIAL_PLUS = 0.035;
const BASE_SALARY = 100;

const SPECIAL_TEAMS_BONUS = 0.05;
const LEADERSHIP_BONUS = 0.02;
const CHARISMA_BONUS = 0.015;

const positionSpecificModifier = (player: Player, salary: number) => {
  if (player.position === "g") {
    return salary;
  }

  return salary * (1 + (player.pk + player.pp) * SPECIAL_TEAMS_BONUS);
};

const charismaModifier = (player: Player, salary: number) => {
  return salary * (1 + (-10 + player.charisma) * CHARISMA_BONUS);
};

const leadershipModifier = (player: Player, salary: number) => {
  return salary * (1 + (-6 + player.leadership) * LEADERSHIP_BONUS);
};

export const getInterestInNHL = (player: Player): number => {
  if (player.age >= 26) {
    return 0;
  }

  if ([18, 19, 20].includes(player.age)) {
    if (player.skill >= 13) {
      return 2;
    }

    if (player.skill >= 10) {
      return 3;
    }

    if (player.skill >= 8) {
      return 4;
    }
  }

  if ([21, 22, 23].includes(player.age)) {
    if (player.skill >= 13) {
      return 2;
    }

    if (player.skill >= 11) {
      return 3;
    }

    if (player.skill >= 9) {
      return 4;
    }
  }

  if (player.age === 24) {
    if (player.skill >= 13) {
      return 2;
    }

    if (player.skill >= 12) {
      return 3;
    }
  }

  if (player.age === 25) {
    if (player.skill >= 13) {
      return 2;
    }
  }

  return 0;
};

const freeKickOptionModifier = (
  player: Player,
  contract: Contract,
  salary: number
) => {
  if (!contract.freeKickOption) {
    return salary;
  }

  return salary * (1.1 + 0.02 * player.leadership);
};

const nhlOptionModifier = (
  player: Player,
  contract: Contract,
  salary: number
) => {
  if (contract.years === 1) {
    return salary;
  }

  if (contract.nhlOption) {
    return salary;
  }

  const interestInNHL = getInterestInNHL(player);
  if (!interestInNHL) {
    return salary;
  }

  if (contract.years < interestInNHL) {
    return salary;
  }

  return salary * (1 + 0.1 * (contract.years - interestInNHL + 1));
};

export const getDesiredSalary = (
  player: Player,
  negotiation: ContractNegotiation
) => {
  const contract = negotiation.contract;

  const s = getBaseSalary(player);

  const s1 = s * (1 + (-10 + player.ego) * 0.01);

  const normalizedOrganizationOpinion = Math.min(
    0,
    negotiation.organizationOpinion
  );

  const s2 = s1 * (1 + Math.abs(normalizedOrganizationOpinion) * 0.1);
  const s3 = s2 * (1 + (26 - player.age) * 0.01 * (contract.years - 1));

  const s4 = freeKickOptionModifier(player, contract, s3);
  const s5 = nhlOptionModifier(player, contract, s4);

  console.log("DESIRED SALARY CALC", s, s1, s2, s3, s4, s5);
  return s5;
};

export const getBaseSalary = (player: Player) => {
  const exponent = EXPONENTIAL + player.skill * EXPONENTIAL_PLUS;
  console.log("exponent", exponent);
  const sin1 = Math.pow(player.skill, exponent);
  console.log("sin1", sin1);

  const money = sin1 * BASE_SALARY;
  console.log("money", money);

  const moneyAfterModifiers = [
    positionSpecificModifier,
    leadershipModifier,
    charismaModifier
  ].reduce((salary, modifier) => modifier(player, salary), money);

  console.log("money after modifiers", moneyAfterModifiers);

  return Math.round(moneyAfterModifiers);

  /*
  potenssix = potenssi + (neup.psk * potenssiplus)
sin1 = neup.psk ^ potenssix
rahna = CLNG(sin1 * perusraha)
IF neup.ppp <> 1 THEN
rahna = rahna * (1 + ((neup.avo + neup.yvo) * xvolisa))
END IF
rahna = rahna * (1 + ((-6 + neup.ldr) * johlisa))
rahna = rahna * (1 + ((-10 + neup.kar) * karlisa))
END SUB
*/
};

export const isDefenceman = (player: Player) => player.position === "d";

export const isGoalkeeper = (player: Player) => player.position === "g";

export const isForward = (player: Player) =>
  ["lw", "c", "rw"].includes(player.position);
