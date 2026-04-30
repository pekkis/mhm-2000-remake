const DUMMY = -1;

const assertValidNumberOfTeams = (numberOfTeams: number): void => {
  if (numberOfTeams < 2) {
    throw new RangeError("roundRobin requires at least 2 teams");
  }
};

const assertValidTimes = (times: number): void => {
  if (!Number.isInteger(times) || times < 1) {
    throw new RangeError("scheduler requires times to be a positive integer");
  }
};

/** Generates a range from 0 to n-1, padding with DUMMY if n is odd */
const getRange = (n: number): number[] => {
  const range = Array.from({ length: n }, (_, i) => i);
  if (n % 2 === 0) {
    return range;
  }
  return [...range, DUMMY];
};

/** Reverses each pairing in each round */
const reverser = (rr: number[][][]): number[][][] => {
  return rr.map((round) => round.map((pairing) => pairing.toReversed()));
};

export type Pairing = {
  home: number;
  away: number;
};

/** Repeats an array a specified number of times */
const repeatArray = <T>(arr: T[], times: number): T[] => {
  return Array.from({ length: times }, () => arr).flat();
};

/** Generates a full schedule with home/away matches, repeating times times */
export const scheduler = (
  numberOfTeams: number,
  times: number
): Pairing[][] => {
  assertValidNumberOfTeams(numberOfTeams);
  assertValidTimes(times);
  const baseSchedule = roundRobin(numberOfTeams);
  const schedule = baseSchedule.concat(reverser(baseSchedule));

  return repeatArray(schedule, times).map((round) =>
    round.map((pairing) => ({
      home: pairing[0],
      away: pairing[1]
    }))
  );
};

/**
 * Core round-robin scheduling algorithm using the rotation method.
 * Returns array of rounds, each round contains pairings as [home, away] arrays.
 */
export const roundRobin = (numberOfTeams: number): number[][][] => {
  assertValidNumberOfTeams(numberOfTeams);
  const px = getRange(numberOfTeams);
  const n = px.length;

  const rs: number[][][] = [];

  for (let j = 0; j < n - 1; j++) {
    // Reconstruct array for this round using rotation
    const lastJElements = j === 0 ? [] : px.slice(-j);
    const ps: number[] = [
      ...px.slice(0, 1),
      ...lastJElements,
      ...px.slice(1, n - j)
    ];

    const pairs: number[][] = [];
    for (let i = 0; i < n / 2; i++) {
      const pair = [ps[i], ps[n - 1 - i]];
      // Filter out pairs containing DUMMY
      if (!pair.includes(DUMMY)) {
        pairs.push(pair);
      }
    }

    const round = j % 2 === 1 ? pairs : pairs.map((pair) => pair.toReversed());
    rs.push(round);
  }

  return rs;
};

export default scheduler;
