import { roundRobin } from "./round-robin";
import type { Pairing } from "@/types/competitions";

const tournamentScheduler = (teams: number[]): Pairing[][] => {
  return roundRobin(teams.length).map((round) => {
    return round.map((pairing) => {
      return {
        home: teams[pairing[0]],
        away: teams[pairing[1]]
      };
    });
  });
};

export default tournamentScheduler;
