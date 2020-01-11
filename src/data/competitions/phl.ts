import { Map, List } from "immutable";
import rr from "../../services/round-robin";
import playoffScheduler, { victors, eliminated } from "../../services/playoffs";
import { defaultMoraleBoost } from "../../services/morale";
import r from "../../services/random";
import { Manager } from "../../ducks/manager";
import { Team } from "../../ducks/game";
import { sortBy, take, map, prop } from "ramda";

/*
competitions: Map({
    phl: Map({
      weight: 500,
      id: "phl",
      abbr: "phl",
      phase: -1,
      name: "PHL",
      teams: List.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11),
      phases: List()
    }),
    division: Map({
      abbr: "div",
      weight: 1000,
      id: "division",
      phase: -1,
      name: "Divisioona",
      teams: List.of(13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24),
      phases: List()
    }),
    mutasarja: Map({
      abbr: "mut",
      weight: 2000,
      id: "mutasarja",
      phase: -1,
      name: "Mutasarja",
      teams: List.of(
        12,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47
      ),
      phases: List()
    }),
    tournaments: Map({
      weight: 2000,
      id: "tournaments",
      phase: -1,
      name: "Joulutauon turnaukset",
      abbr: "tournaments",
      phases: List(),
      teams: List()
    }),
    ehl: Map({
      weight: 2000,
      id: "ehl",
      phase: -1,
      name: "EHL",
      abbr: "ehl",
      phases: List()
    })
  }),
*/

export type Competitions = {
  phl: Competition;
  division: Competition;
  ehl: Competition;
  tournaments: Competition;
  mutasarja: Competition;
};

export type CompetitionName = keyof Competitions;
export type CompetitionNameList = CompetitionName[];

export interface Competition {
  teams: number[];
  phases: CompetitionPhase[];
}

export type CompetitionType = "round-robin" | "playoffs";

export interface TeamPenalty {}

export type Schedule = ScheduleRound[];
export type ScheduleRound = ScheduleGame[];
export interface ScheduleGame {
  home: number;
  away: number;
}

export type Stats = Stat[];

export interface Stat {
  id: number;
}

export interface CompetitionGroup {
  type: CompetitionType;
  round: number;
  name: string;
  teams: number[];
  stats: Stats;
}

export interface RoundRobinCompetitionGroup extends CompetitionGroup {
  penalties: TeamPenalty[];
  type: "round-robin";
  times: number;
  schedule: Schedule;
  colors: Color[];
}

export interface PlayoffsCompetitionGroup extends CompetitionGroup {
  type: "playoffs";
  schedule: Schedule;
  matchups: Matchups;
  winsToAdvance: number;
}

type Color = "l" | "d";

interface CompetitionPhase {
  name: string;
  type: CompetitionType;
  teams: number[];
  groups: CompetitionGroup[];
}

export interface RoundRobinCompetitionPhase extends CompetitionPhase {
  groups: RoundRobinCompetitionGroup[];
}

export interface PlayoffsCompetitionPhase extends CompetitionPhase {
  groups: PlayoffsCompetitionGroup[];
}

export interface Facts {
  isLoss: boolean;
  isDraw: boolean;
  isWin: boolean;
}

export type Matchups = Matchup[];
export type Matchup = [number, number];

export interface CompetitionService {
  gameBalance: (phase: number, facts: Facts, manager: Manager) => number;
  moraleBoost: (phase: number, facts: Facts, manager: Manager) => number;
  readinessBoost: (phase: number, facts: Facts, manager: Manager) => number;

  relegateTo: CompetitionName | false;
  promoteTo: CompetitionName | false;

  parameters: {
    gameday: (
      phase: number
    ) => {
      advantage: {
        home: (team: Team) => number;
        away: (team: Team) => number;
      };
      base: () => number;
      moraleEffect: (team: Team) => number;
    };
  };

  seed: ((competitions: Competitions) => CompetitionPhase)[];
}

const phl: CompetitionService = {
  gameBalance: (phase, facts, manager) => {
    const arenaLevel = manager.arena.level + 1;
    if (facts.isLoss) {
      return manager.extra;
    }

    if (facts.isDraw) {
      return 5000 + 3000 * arenaLevel + manager.extra;
    }

    return 10000 + 3000 * arenaLevel + manager.extra;
  },

  moraleBoost: (phase, facts, manager) => {
    return defaultMoraleBoost(facts);
  },

  readinessBoost: (phase, facts, manager) => {
    return 0;
  },

  relegateTo: "division",
  promoteTo: false,

  parameters: {
    gameday: phase => ({
      advantage: {
        home: team => 10,
        away: team => -10
      },
      base: () => 20,
      moraleEffect: team => {
        return team.morale * 2;
      }
    })
  },

  seed: [
    competitions => {
      const competition = competitions.phl;
      const teams = sortBy(() => r.real(1, 1000), competition.teams);
      const times = 2;

      const phase: RoundRobinCompetitionPhase = {
        name: "runkosarja",
        type: "round-robin",
        teams,
        groups: [
          {
            penalties: [],
            type: "round-robin",
            round: 0,
            name: "runkosarja",
            teams,
            times,
            schedule: rr(teams.length, times),
            colors: ["d", "d", "d", "d", "d", "d", "d", "d", "l", "l", "l", "d"]
          }
        ]
      };
      return phase;
    },
    competitions => {
      const teams = take(
        8,
        map(prop("id"), competitions.phl.phases[0].groups[0].stats)
      );

      const winsToAdvance = 3;
      const matchups: Matchups = [
        [0, 7],
        [1, 6],
        [2, 5],
        [3, 4]
      ];

      const phase: PlayoffsCompetitionPhase = {
        name: "quarterfinals",
        type: "playoffs",
        teams,
        groups: [
          {
            type: "playoffs",
            name: "playoffs",
            round: 0,
            teams,
            winsToAdvance,
            matchups,
            schedule: playoffScheduler(matchups, 3),
            stats: []
          } as PlayoffsCompetitionGroup
        ]
      };
      return phase;
    },
    competitions => {
      const teams = map(
        victors(competitions.phl.phases[1].groups[0]),
        prop("id")
      );

      const matchups: Matchups = [
        [0, 3],
        [1, 2]
      ];

      const winsToAdvance = 3;

      return {
        name: "semifinals",
        type: "playoffs",
        teams,
        groups: [
          {
            type: "playoffs",
            round: 0,
            teams,
            matchups,
            winsToAdvance,
            schedule: playoffScheduler(matchups, winsToAdvance)
          }
        ]
      } as PlayoffsCompetitionPhase;
    },
    competitions => {
      const teams = victors(
        competitions.getIn(["phl", "phases", 2, "groups", 0])
      )
        .map(t => t.get("id"))
        .concat(
          eliminated(
            competitions.getIn(["phl", "phases", 2, "groups", 0])
          ).map(t => t.get("id"))
        );

      const matchups = List.of(List.of(0, 1), List.of(2, 3));

      const winsToAdvance = 4;

      return Map({
        name: "finals",
        type: "playoffs",
        teams,
        groups: List.of(
          Map({
            type: "playoffs",
            teams,
            round: 0,
            matchups,
            winsToAdvance,
            schedule: playoffScheduler(matchups, winsToAdvance)
          })
        )
      });
    }
  ]
};
