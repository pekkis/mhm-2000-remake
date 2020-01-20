import { Map, List } from "immutable";
import { select, call, all } from "redux-saga/effects";
import rr from "../../round-robin";
import tournamentScheduler from "../../tournament";
import table from "../../league";
import { defaultMoraleBoost } from "../../morale";
import { addAnnouncement } from "../../../sagas/news";
import { amount as a } from "../../format";
import { incrementStrength, incrementReadiness } from "../../../sagas/team";
import { incrementBalance } from "../../../sagas/manager";
import { setSeasonStat } from "../../../sagas/stats";
import {
  CompetitionService,
  RoundRobinCompetitionGroup,
  RoundRobinCompetitionPhase,
  LeagueTableRow,
  TournamentCompetitionPhase,
  TournamentCompetitionGroup,
  Turn
} from "../../../types/base";
import { map, range, head, drop, prop } from "ramda";
import { sortLeagueTable } from "../../league";
import { MHMState } from "../../../ducks";
import { domesticTeams, foreignTeams } from "../../selectors";
import { Team } from "../../../types/team";
import random from "../../random";
import { setCompetitionTeams } from "../../../sagas/competition";

const awards = List.of(
  Map({
    amount: 2000000,
    strength: 30,
    text: amount =>
      `Voitimme jääkiekon euroopan mestaruuden. Johtokunta onnittelee menestyksekästä joukkuetta ja sen manageria yksissä tuumin. Sielua lämmittävän kiittelyn ohella joukkueen tilille napsahtaa aimo summa pätäkkää, kaiken kaikkiaan __${a(
        amount
      )}__ pekkaa. `
  }),
  Map({
    amount: 1600000,
    strength: 28,
    text: amount =>
      `Sijoituimme toiseksi EHL:n lopputurnauksessa. Hopea ei ole häpeä, ja johtokunta on samaan aikaan onnellinen saavutuksesta mutta haikea saavuttamattomasta. Onneksi palkkiosumma, __${a(
        amount
      )}__ pekkaa, lohduttaa tasaisesti kaikkia asianosaisia.`
  }),
  Map({
    amount: 1400000,
    strength: 26,
    text: amount =>
      `Sijoituimme kolmanneksi EHL:n lopputurnauksessa. Himmeinkin mitali kelpaa, ja johtokunta on miedosti onnellinen saavutuksestanne. Kättelyt ovat ainakin kädenlämpöisiä, ja rahapalkkio, __${a(
        amount
      )}__ pekkaa, kyllä kelpaa aivan jokaiselle.`
  }),
  Map({
    amount: 1200000,
    strength: 24,
    text: amount =>
      `Sijoituimme neljänneksi EHL:n lopputurnauksessa. Johtokunta tunnustaa haaveilleensa paremmasta, mutta ottaa silti ilolla vastaan rahapalkkion, __${a(
        amount
      )}__ pekkaa.`
  }),
  Map({
    amount: 1000000,
    strength: 22,
    text: amount =>
      `Sijoituimme viidenneksi EHL:n lopputurnauksessa. Johtokunta nyreilee ja kyräilee, he odottivat joukkueelta selvästi enemmän. Rahapalkkio, __${a(
        amount
      )}__ pekkaa, kelpaa heille kyllä, mutta se ei kuulemma "lohduta heitä pimeinä talvi-iltoina".`
  }),
  Map({
    amount: 800000,
    strength: 20,
    text: amount =>
      `Sijoituimme viimeiseksi EHL:n lopputurnauksessa. No, ainakin kohtuullinen rahapalkkio, __${a(
        amount
      )}__ pekkaa, napsahtaa tilillenne.`
  })
);

/*

FOR y = 1 TO 6
IF seh(elt(y)) = 1 THEN lemes = leh(elt(y))
FOR yy = 1 TO 6
IF elt(y) = eds1 AND edus1 <> u AND seh(elt(y)) = yy THEN v(edus1) = v(edus1) + (32 - seh(elt(y)) * 2)
IF elt(y) = eds2 AND edus2 <> u AND seh(elt(y)) = yy THEN v(edus2) = v(edus2) + (32 - seh(elt(y)) * 2)
IF elt(y) = eds3 AND edus3 <> u AND seh(elt(y)) = yy THEN v(edus3) = v(edus3) + (32 - seh(elt(y)) * 2)
*/

function* ehlAwards() {
  const finalTournament = yield select(state =>
    state.game.getIn(["competitions", "ehl", "phases", 1, "groups", 0])
  );

  const managers = yield select(state => state.manager.get("managers"));
  const teams = yield select(state => state.game.get("teams"));

  for (const [ranking, stat] of finalTournament.get("stats").entries()) {
    console.log("stat", stat.toJS());
    const team = teams.get(stat.get("id"));

    if (ranking === 0) {
      yield call(setSeasonStat, ["ehlChampion"], team.get("id"));
    }

    if (team.get("domestic", true)) {
      yield call(incrementReadiness, team.get("id"), -2);

      console.log("team", ranking, team.toJS());

      if (team.get("manager") !== undefined) {
        const amount = awards.getIn([ranking, "amount"]);
        const manager = managers.get(team.get("manager"));
        console.log("manager", manager.toJS());

        yield all([
          call(
            addAnnouncement,
            manager.get("id"),
            awards.getIn([ranking, "text"])(amount)
          ),
          call(incrementBalance, manager.get("id"), amount)
        ]);
      } else {
        // Give strength to domestic computer teams
        yield call(
          incrementStrength,
          team.get("id"),
          awards.getIn([ranking, "strength"])
        );
      }
    }

    // Decrease readiness for everyone.

    // const manager = managers.find(m => stat.get("id") === m.get("team"));
    // if (manager) {
    //   console.log("manager", index, manager.toJS());
  }

  // yield call(addAnnouncement, 0, `Ripulikakka __haisee__.`);
}

const teamsFromCountrySet = (
  n: number,
  cs: string[],
  teams: Team[]
): string[] => {
  const filtered = teams.filter(t => cs.includes(t.country)).map(t => t.id);

  console.log("filterado", cs, filtered, n);

  return random.sample(filtered, n);
};

const ehl: CompetitionService = {
  relegateTo: false,
  promoteTo: false,

  homeAdvantage: (phase, group) => {
    return 1;
  },

  awayAdvantage: (phase, group) => {
    if (phase === 0) {
      return 0.85;
    }

    return 1;
  },

  start: function*() {
    const turn: Turn = yield select((state: MHMState) => state.game.turn);

    const domesticParticipants: [string, string, string] = yield select(
      (state: MHMState) => state.stats.seasons[turn.season - 1].medalists
    );

    const foreign: Team[] = yield select(foreignTeams);

    const countrySets: [string[], number][] = [
      [["SE"], 3],
      [["DE"], 2],
      [["CZ"], 3],
      [["RU"], 2],
      [["CH"], 2],
      [["SK"], 1],
      [
        [
          "IT",
          "AT",
          "EE",
          "NO",
          "FR",
          "PL",
          "LV",
          "NL",
          "GR",
          "IE",
          "BE",
          "GB",
          "DK"
        ],
        4
      ]
    ];

    const foreignParticipants: string[][] = countrySets.map(([cs, n]) =>
      teamsFromCountrySet(n, cs, foreign)
    );

    const teams = [...domesticParticipants, ...foreignParticipants.flat()];
    yield call(setCompetitionTeams, "ehl", teams);
  },

  groupEnd: function*(phase: number, group: number) {
    if (phase === 1) {
      yield call(ehlAwards);
    }
  },

  gameBalance: (phase, facts, manager) => {
    if (phase > 0) {
      return 0;
    }

    const arenaLevel = manager.arena.level + 1;
    return 100000 + 20000 * arenaLevel;
  },

  moraleBoost: (phase, facts, manager) => {
    if (phase > 0) {
      return 0;
    }

    return defaultMoraleBoost(facts);
  },

  readinessBoost: (phase, facts, manager) => {
    if (phase > 0) {
      return 0;
    }
    return -1;
  },

  parameters: {
    gameday: phase => ({
      advantage: {
        home: team => (phase === 0 ? 10 : 0),
        away: team => (phase === 0 ? -10 : 0)
      },
      base: () => 20,
      moraleEffect: team => {
        return team.morale * 2;
      }
    })
  },

  seed: [
    competitions => {
      const times = 1;
      const ehl = competitions.ehl;

      const teams = ehl.teams;

      const groups: RoundRobinCompetitionGroup[] = map(groupId => {
        const teamSlice = teams.slice(groupId * 4, groupId * 4 + 4);
        return {
          type: "round-robin",
          times,
          round: 0,
          name: `lohko ${groupId + 1}`,
          teams: teamSlice,
          schedule: rr(teamSlice.length, times),
          colors: ["d", "l", "l", "l"],
          penalties: [],
          stats: []
        } as RoundRobinCompetitionGroup;
      }, range(0, 5));

      return {
        teams,
        name: "runkosarja",
        type: "round-robin",
        groups
      } as RoundRobinCompetitionPhase;
    },
    competitions => {
      const ehlGroups = (competitions.ehl
        .phases[0] as RoundRobinCompetitionPhase).groups;

      const ehlTables = ehlGroups.map(table);
      const qualifiedVictors = ehlTables.map(t => head(t) as LeagueTableRow);
      const sortedSeconds = sortLeagueTable(ehlTables.flatMap(drop(1)));
      const qualifiedSecond = head(sortedSeconds) as LeagueTableRow;

      const teams = map(prop("id"), [...qualifiedVictors, qualifiedSecond]);

      return {
        name: "lopputurnaus",
        type: "tournament",
        teams,
        groups: [
          {
            type: "tournament",
            penalties: [],
            colors: ["d", "l", "l", "l", "l", "l"],
            teams,
            round: 0,
            name: "lopputurnaus",
            schedule: tournamentScheduler(teams.length),
            stats: []
          } as TournamentCompetitionGroup
        ]
      } as TournamentCompetitionPhase;
    }
  ]
};

export default ehl;
