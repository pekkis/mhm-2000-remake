import { roundRobin } from "./round-robin";
import { Schedule } from "../types/base";

const tournamentScheduler = (numberOfTeams: number): Schedule => {
  return roundRobin(numberOfTeams).map(round => {
    return round.map(pairing => {
      return {
        home: pairing[0],
        away: pairing[1]
      };
    });
  });
};

export default tournamentScheduler;
