import { Team } from "../types/team";
import competitions from "../data/competitions";
import { Competitions, CompetitionNames } from "../types/base";
import { mapObjIndexed } from "ramda";
import { takeMaybe } from "redux-saga/effects";

/*
TODO:
- intensiteetti
- kannatusryhmät
- intensiteetti tuurilla kehnompi
- treeni (hyvin huonosti ok)
- jäynät
- spessueffut (voodoomies? )
*/

const moraleModifier = (team: Team, advantage: number) => {
  if (team.morale === 0) {
    return advantage;
  }

  if (team.morale > 0) {
    return advantage + team.morale / 155;
  }

  return advantage + team.morale / 125;
};

export interface MatchInput {
  competition: {
    id: CompetitionNames;
    phase: number;
    group: number;
  };

  teams: {
    home: Team;
    away: Team;
  };
}

export interface MatchOutput {}

export const playMatch = (match: MatchInput) => {
  const advantages = {
    home: competitions[match.competition.id].homeAdvantage(
      match.competition.phase,
      match.competition.group
    ),
    away: competitions[match.competition.id].awayAdvantage(
      match.competition.phase,
      match.competition.group
    )
  };

  console.log("advantages", advantages);

  const teamModifiers = [moraleModifier];

  const advantagesAfterTeamModifiers = mapObjIndexed((a, which) => {
    return teamModifiers.reduce((a2, tm) => tm(match.teams[which], a2), a);
  }, advantages);

  /*
  const advantagesAfterTeamModifiers = ["home", "away"].reduce((a, which) => {
    return teamModifiers.reduce(
      (a, modifier) => modifier(match.teams[which], a),
      a[which]
    );
  }, advantages);
  */

  console.log("advantages after team", advantagesAfterTeamModifiers);

  return {
    result: {
      home: 5,
      away: 0
    }
  };
};
