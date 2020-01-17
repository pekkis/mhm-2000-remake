import {
  range,
  append,
  map,
  take,
  takeLast,
  slice,
  pair,
  reverse,
  concat,
  repeat
} from "ramda";
import { Schedule, ScheduleGame, ScheduleRound } from "../types/base";

const DUMMY = -1;

const getRange = (n: number): number[] => {
  const r = range(0, n);

  if (n % 2 === 0) {
    return r;
  }
  return append(DUMMY, r);
};

const reverser = (roundRobin: [number, number][][]): [number, number][][] => {
  return map(r => map(rr => reverse(rr) as [number, number], r), roundRobin);
};

const createScheduleGame = (pairing: [number, number]): ScheduleGame => {
  const [first, second] = pairing;

  return {
    home: first,
    away: second
  } as ScheduleGame;
};

const createScheduleRound = (data: unknown): ScheduleRound => {
  return map(createScheduleGame, data);
};

const scheduler = (numberOfTeams: number, times: number): Schedule => {
  const rr = roundRobin(numberOfTeams);
  const schedule = concat(reverser(rr), rr);
  const rounds = map(createScheduleRound, schedule);
  const repeated = repeat(rounds, times);
  return repeated.flat(1);
};

const createRound = (round: number, teams: number[]) => {
  const ordered = [
    ...take(1, teams),
    ...takeLast(round, teams),
    ...slice(1, teams.length - round, teams)
  ];

  const pairings = range(0, teams.length / 2);

  const pairs = map(
    pairing => pair(ordered[pairing], ordered[teams.length - 1 - pairing]),
    pairings
  );

  return round % 2 ? pairs : reverse(pairs);
};

export const roundRobin = (numberOfTeams: number) => {
  const px = getRange(numberOfTeams);
  const n = px.length;
  const rounds = range(0, n - 1);
  const rs = map(r => createRound(r, px), rounds);
  return rs;
};

export default scheduler;
