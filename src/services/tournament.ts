import { roundRobin } from "./round-robin";
import type { Pairing } from "@/types/competitions";

const tournamentScheduler = (numberOfTeams: number): Pairing[][] => {
  return roundRobin(numberOfTeams).map((round) => {
    return round.map((pairing) => {
      return {
        home: pairing[0],
        away: pairing[1]
      };
    });
  });
};

export default tournamentScheduler;
