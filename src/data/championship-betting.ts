/*
IF v(x) >= yttre - 100 THEN ker(x) = 460: GOTO esukki
IF v(x) <= yttre - 100 THEN ker(x) = 1000: GOTO esukki
*/

import type { Team } from "@/state/game";
import type { Competition } from "@/types/competitions";

type OddsEntry = {
  id: number;
  name: string;
  odds: number;
};

const getOdds = (): number => {
  return 1.5;
};

const odds = (competition: Competition, teams: Team[]): OddsEntry[] => {
  /*
  const average =
    competition.teams.map((t) => teams[t]).reduce((r, t) => r + t.strength, 0) /
    competition.teams.length;
    */

  const oddsArr = competition.teams
    .map((t) => teams[t])
    .map((team) => ({
      id: team.id,
      name: team.name,
      odds: getOdds()
    }))
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .toSorted((a, b) => a.odds - b.odds);

  return oddsArr;
};

export default odds;
