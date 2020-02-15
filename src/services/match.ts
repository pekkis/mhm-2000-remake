import { Team, TeamStrength } from "../types/team";
import competitions from "./competitions";
import { mapObjIndexed, evolve, range, inc, values } from "ramda";
import random from "./random";
import {
  MatchInput,
  MatchOutput,
  PartialMatchResult,
  MatchResult,
  MatchFacts,
  ScheduleGame,
  MapOf
} from "../types/base";
import competitionTypeService from "./competition-type";
import { isHumanManager } from "../types/manager";
import { calculateStrengthFromLineup } from "./lineup";
import { getActualSkill } from "./player";
import { MHMState } from "../ducks";
import { select } from "redux-saga/effects";
import { Player } from "../types/player";
import { isHumanControlledTeam } from "./team";

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
  [key: string]: TeamStrength;
}

interface AttackRoles {
  attack: string;
  defend: string;
}

const matchAttack = (skills: Matchup) => (
  a: PartialMatchResult,
  roles: AttackRoles
) => {
  const aRand = skills[roles.attack].a * random.real(0, 1);
  const dRand = skills[roles.defend].d * random.real(0, 1);

  if (aRand > dRand) {
    const aRand = skills[roles.attack].a * random.real(0, 1);
    const gRand =
      skills[roles.defend].g * random.real(0, 1) + skills[roles.defend].d / 3;
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
};

const matchRound = (skills: Matchup) => (a: PartialMatchResult) => {
  return [
    { attack: "home", defend: "away" },
    { attack: "away", defend: "home" }
  ].reduce(matchAttack(skills), a);
};

const generatore = function*() {
  const roles = [
    { attack: "home", defend: "away" },
    { attack: "away", defend: "home" }
  ];
  do {
    for (const role of roles) {
      yield role;
    }
  } while (true);
};

const continuousOvertime = (skills: Matchup, result) => {
  const gen = generatore();
  let ot;
  do {
    const roles = gen.next().value;
    ot = matchAttack(skills)(result, roles);
  } while (ot === result);

  return ot;
};

const fiveMinutesOvertime = (skills: Matchup, result) => {
  const gen = generatore();
  for (let x = 1; x <= 4; x = x + 1) {
    const roles = gen.next().value;
    const ot = matchAttack(skills)(result, roles);
    if (ot !== result) {
      return ot;
    }
  }
  return result;
};

export const playMatch = function*(input: MatchInput) {
  const players: MapOf<Player> = yield select(
    (state: MHMState) => state.player.players
  );

  const advantages = {
    home: competitions[input.competition.id].homeAdvantage(
      input.phase.id,
      input.group.id
    ),
    away: competitions[input.competition.id].awayAdvantage(
      input.phase.id,
      input.group.id
    )
  };

  const { teams } = input;

  // TODO: forfeit game if invalid lineup

  const strengths = mapObjIndexed((team: Team) => {
    if (isHumanControlledTeam(team)) {
      return calculateStrengthFromLineup(
        getActualSkill,
        values(players),
        team.lineup
      );
    }
    // TODO: Calculate computer teams' effects
    return team.strength;
  }, teams);

  console.log("strenghts", strengths);

  const teamModifiers = [moraleModifier];

  const advantagesAfterTeamModifiers = mapObjIndexed((a, which) => {
    return teamModifiers.reduce((a2, tm) => tm(teams[which], a2), a);
  }, advantages);

  const effectiveStrengths = mapObjIndexed((strength, which) => {
    return evolve(
      {
        g: x => x * advantagesAfterTeamModifiers[which],
        d: x => x * advantagesAfterTeamModifiers[which],
        a: x => x * advantagesAfterTeamModifiers[which],
        pp: x => x * advantagesAfterTeamModifiers[which],
        pk: x => x * advantagesAfterTeamModifiers[which]
      },
      strength
    );
  }, strengths);

  const skills: Matchup = mapObjIndexed((strength, which) => {
    return evolve(
      {
        g: x => x / 30,
        d: x => x / 60,
        a: x => x / 120
      },
      strength
    );
  }, effectiveStrengths);

  const result = range(1, 16).reduce(matchRound(skills), {
    home: 0,
    away: 0
  });

  const needsOverTime = competitionTypeService[input.group.type].overtime(
    input.group,
    input.group.round,
    input.matchup,
    result
  );

  if (!needsOverTime) {
    const output: MatchOutput = {
      result: {
        ...result,
        audience: 3000,
        overtime: false
      }
    };

    return output;
  }

  const resultAfterOvertime =
    needsOverTime.type === "continuous"
      ? continuousOvertime(skills, result)
      : fiveMinutesOvertime(skills, result);

  const output: MatchOutput = {
    result: {
      ...resultAfterOvertime,
      audience: 3000,
      overtime: true
    }
  };

  return output;
};

export const resultFacts = (
  result: MatchResult,
  key: "home" | "away"
): MatchFacts => {
  const theirKey = key === "home" ? "away" : "home";

  const isWin = result[key] > result[theirKey];

  const isDraw = result[key] === result[theirKey];

  const isLoss = result[key] < result[theirKey];

  return {
    isWin,
    isDraw,
    isLoss,
    goalsFor: result[key],
    goalsAgainst: result[theirKey]
  };
};

export const matchFacts = (game: ScheduleGame, team: number): MatchFacts => {
  const isHome = team === game.home;
  const myKey = isHome ? "home" : "away";

  if (!game.result) {
    throw new Error("Trying to get facts for a game with no result");
  }

  return resultFacts(game.result, myKey);
};
