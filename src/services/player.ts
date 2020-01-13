import { Player, PlayerPosition } from "../types/player";
import random from "./random";
import {
  countryFromLegacyCountry,
  createFirstName,
  createLastName
} from "./country";
import { AllCountries } from "../types/country";

interface PlayerRandomGenerator {
  nationality: number[];
  positions: number[];
  age: number[];
  ego: number[];
  leadership: number[];
  charisma: number[];
  specialTeams: number[];
}

const legacyPositionMap = {
  1: "g",
  2: "d",
  3: "lw",
  4: "c",
  5: "rw"
};

const randoms: PlayerRandomGenerator = {
  positions: [
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5
  ],
  nationality: [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    5,
    6,
    6,
    6,
    6,
    7,
    7,
    7,
    7,
    8,
    8,
    8,
    8,
    9,
    9,
    9,
    9,
    10,
    10,
    10,
    10,
    10,
    11,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    14,
    14,
    14,
    14,
    15,
    15,
    15,
    15,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17
  ],
  age: [
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    21,
    21,
    22,
    22,
    22,
    22,
    23,
    23,
    23,
    23,
    23,
    23,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    30,
    30,
    30,
    30,
    30,
    30,
    31,
    31,
    31,
    31,
    31,
    32,
    32,
    32,
    33,
    33,
    33,
    34,
    35
  ],
  ego: [
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    4,
    5,
    5,
    5,
    6,
    6,
    6,
    7,
    7,
    7,
    7,
    7,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    13,
    14,
    14,
    14,
    15,
    15,
    15,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20
  ],
  leadership: [
    20,
    19,
    18,
    17,
    16,
    15,
    14,
    14,
    13,
    13,
    13,
    12,
    12,
    12,
    12,
    11,
    11,
    11,
    11,
    6,
    10,
    10,
    10,
    10,
    7,
    1,
    1,
    1,
    8,
    9,
    9,
    9,
    2,
    2,
    2,
    3,
    3,
    4,
    4,
    4,
    5,
    6,
    7,
    8,
    5,
    6,
    7,
    8,
    5,
    6,
    7,
    8,
    5,
    6,
    7,
    8,
    5,
    6,
    7,
    8,
    4,
    4,
    3,
    3,
    3,
    2,
    2,
    2,
    8,
    9,
    9,
    9,
    1,
    1,
    1,
    7,
    10,
    10,
    10,
    10,
    6,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    14,
    14,
    15,
    16,
    17,
    18,
    19,
    20
  ],
  charisma: [
    1,
    2,
    1,
    2,
    1,
    2,
    1,
    2,
    1,
    2,
    1,
    2,
    1,
    2,
    1,
    2,
    3,
    4,
    3,
    4,
    3,
    4,
    5,
    6,
    5,
    6,
    5,
    6,
    5,
    6,
    6,
    8,
    6,
    8,
    7,
    8,
    7,
    8,
    7,
    8,
    9,
    10,
    11,
    9,
    10,
    11,
    9,
    10,
    11,
    9,
    10,
    11,
    9,
    10,
    11,
    9,
    10,
    12,
    9,
    10,
    12,
    13,
    12,
    13,
    12,
    13,
    7,
    8,
    7,
    8,
    7,
    5,
    6,
    14,
    15,
    14,
    15,
    16,
    14,
    15,
    16,
    14,
    15,
    16,
    17,
    18,
    16,
    17,
    18,
    16,
    17,
    18,
    16,
    17,
    18,
    19,
    20,
    19,
    20,
    10
  ],
  specialTeams: [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    2,
    -2,
    2,
    -2,
    2,
    -2,
    2,
    -2,
    2,
    -2,
    2,
    -2,
    2,
    -2,
    2,
    -2,
    3,
    -3,
    3,
    -3,
    3,
    -3,
    3,
    -3,
    3,
    -3
  ]
};

export const positionFromLegacyPosition = (
  legacyPosition: number
): PlayerPosition => legacyPositionMap[legacyPosition];

export const createRandomPlayer = (): Player => {
  const country = countryFromLegacyCountry(random.pick(randoms.nationality));
  const firstName = createFirstName(country);
  const lastName = createLastName(country);
  const position = positionFromLegacyPosition(random.pick(randoms.positions));

  const age = random.pick(randoms.age);
  const ego = random.pick(randoms.ego);

  const pp = random.pick(randoms.specialTeams);
  const pk = random.pick(randoms.specialTeams);

  return createPlayer(lastName, firstName, country, position);
};

export const createPlayer = (
  lastName: string,
  firstName: string,
  country: AllCountries,
  position: PlayerPosition
): Player => {
  const player: Player = {
    firstName: firstName.substr(0, 1),
    lastName,
    country,
    position,
    age,
    ego,
    leadership,
    charisma,
    pp,
    pk
  };
  return player;
};
