import { Schedule } from "../types/base";
import { range, splitEvery } from "ramda";
import random from "./random";

const cupScheduler = (numberOfTeams: number): Schedule => {
  const teams = range(0, numberOfTeams);
  random.shuffle<number>(teams);

  const pairs = splitEvery(2, teams);

  return [
    pairs.map(pair => ({
      home: pair[0],
      away: pair[1]
    })),
    pairs.map(pair => ({
      home: pair[1],
      away: pair[0]
    }))
  ];
};

export default cupScheduler;
