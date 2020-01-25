import { Team } from "../types/team";
import competitions from "./competitions";
import { mapObjIndexed, evolve, range, inc } from "ramda";
import random from "./random";
import { MatchInput, MatchOutput } from "../types/base";

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

interface Matchup {
  [key: string]: Team;
}

export const playMatch = (input: MatchInput) => {
  const advantages = {
    home: competitions[input.competition.id].homeAdvantage(
      input.competition.phase,
      input.competition.group
    ),
    away: competitions[input.competition.id].awayAdvantage(
      input.competition.phase,
      input.competition.group
    )
  };

  const { teams } = input;

  console.log("advantages", advantages);

  const teamModifiers = [moraleModifier];

  const advantagesAfterTeamModifiers = mapObjIndexed((a, which) => {
    return teamModifiers.reduce((a2, tm) => tm(teams[which], a2), a);
  }, advantages);

  const effectiveTeams = mapObjIndexed((team, which) => {
    return evolve(
      {
        strength: {
          g: x => x * advantages[which],
          d: x => x * advantages[which],
          a: x => x * advantages[which],
          pp: x => x * advantages[which],
          pk: x => x * advantages[which]
        }
      },
      team
    );
  }, teams);

  const skills: Matchup = mapObjIndexed((team, which) => {
    return evolve(
      {
        strength: {
          g: x => x / 30,
          d: x => x / 60,
          a: x => x / 120
        }
      },
      team
    );
  }, effectiveTeams);

  console.log(teams, effectiveTeams, skills, "PUUPPA");

  const result = range(1, 16).reduce(
    (a, r) => {
      return [
        { attack: "home", defend: "away" },
        { attack: "away", defend: "home" }
      ].reduce((a, roles) => {
        const aRand = skills[roles.attack].strength.a * random.real(0, 1);
        const dRand = skills[roles.defend].strength.d * random.real(0, 1);

        if (aRand > dRand) {
          const aRand = skills[roles.attack].strength.a * random.real(0, 1);
          const gRand =
            skills[roles.defend].strength.g * random.real(0, 1) +
            skills[roles.defend].strength.d / 3;
          if (aRand > gRand) {
            return evolve(
              {
                [roles.attack]: inc
              },
              a
            );
          }
        }

        return a;
      }, a);
    },
    {
      home: 0,
      away: 0,
      audience: 3000
    }
  );

  /*
  const advantagesAfterTeamModifiers = ["home", "away"].reduce((a, which) => {
    return teamModifiers.reduce(
      (a, modifier) => modifier(match.teams[which], a),
      a[which]
    );
  }, advantages);
  */

  console.log("advantages after team", advantagesAfterTeamModifiers);

  const output: MatchOutput = {
    result: {
      ...result,
      audience: 3000,
      overtime: false
    }
  };

  return output;
};
