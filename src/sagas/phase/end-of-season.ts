import { call, all, take, put, select, putResolve } from "redux-saga/effects";
import { seasonStart, promote, relegate, setPhase } from "../game";
import { victors, eliminated } from "../../services/playoffs";
import awards from "../../data/awards";
import { List } from "immutable";
import { cinteger } from "../../services/random";

import { setSeasonStat, createSeasonStories } from "../stats";
import { processChampionBets } from "../betting";
import { competition, allTeams } from "../../services/selectors";
import { setCountryStrength, Country } from "../../ducks/country";
import { MHMState } from "../../ducks";
import {
  pipe,
  map,
  sort,
  descend,
  prop,
  nth,
  takeLast,
  difference,
  differenceWith,
  slice,
  take as rTake,
  uniq
} from "ramda";
import { Team } from "../../types/team";
import {
  Competition,
  RoundRobinCompetitionPhase,
  PlayoffsCompetitionPhase,
  PlayoffStat,
  PlayoffTeamStat,
  TournamentCompetitionPhase,
  CupCompetitionPhase,
  RoundRobinCompetitionGroup
} from "../../types/base";
import { cupWinners } from "../../services/cup";
import { SeasonStatistic } from "../../types/stats";
import { sortLeagueTable } from "../../services/league";
import { GameSeasonEndAction, GAME_SEASON_END } from "../../ducks/game";
import { string } from "random-js";

const getLuck = () => {
  const isLucky = cinteger(1, 10);

  if (isLucky === 1) {
    return -(cinteger(0, 20) + 20);
  }

  if (isLucky === 10) {
    return cinteger(0, 20) + 20;
  }

  return 0;
};

function* definePekkalandiaStrength() {
  const phl = yield select(competition("phl"));
  const teams = yield select(allTeams);

  const avg = phl
    .get("teams")
    .map(t => teams.getIn([t, "strength"]))
    .reduce((r, s) => r + s, 0);

  const strength = Math.round(avg / phl.get("teams").count());

  console.log("strength", strength);

  yield putResolve(setCountryStrength("FI", strength));
}

interface ExtendedCountry extends Country {
  luck: number;
  random: number;
}

function* worldChampionships() {
  yield call(setPhase, "worldChampionships");
  yield call(definePekkalandiaStrength);

  const countries: Country[] = yield select(
    (state: MHMState) => state.country.countries
  );

  const entries = pipe(
    map<Country, ExtendedCountry>(c => {
      return {
        ...c,
        luck: getLuck(),
        random: cinteger(0, 20) - cinteger(0, 10)
      };
    }),
    sort(descend((c: ExtendedCountry) => c.strength + c.luck + c.random))
  )(countries);

  yield put({
    type: "GAME_WORLD_CHAMPIONSHIP_RESULTS",
    payload: entries
  });

  yield call(
    setSeasonStat,
    ["worldChampionships"],
    entries.map(e => e.iso)
  );

  yield take("GAME_ADVANCE_REQUEST");
}

export default function* endOfSeasonPhase() {
  // yield call(worldChampionships);

  yield call(setPhase, "endOfSeason");

  // yield call(awards);

  yield call(setPhase, "endOfSeason");

  const phl: Competition = yield select(
    (state: MHMState) => state.competition.competitions.phl
  );

  const division: Competition = yield select(
    (state: MHMState) => state.competition.competitions.division
  );

  const mutasarja: Competition = yield select(
    (state: MHMState) => state.competition.competitions.mutasarja
  );

  const cup: Competition = yield select(
    (state: MHMState) => state.competition.competitions.cup
  );

  const ehl: Competition = yield select(
    (state: MHMState) => state.competition.competitions.ehl
  );

  const ehlWinner = nth(
    0,
    (ehl.phases[1] as TournamentCompetitionPhase).groups[0].stats
  );
  if (!ehlWinner) {
    throw new Error("EHL winner error");
  }

  const cupWinner = nth(
    0,
    cupWinners((cup.phases[5] as CupCompetitionPhase).groups[0])
  );
  if (!cupWinner) {
    throw new Error("Cup winner error");
  }

  const presidentsTrophy = nth(
    0,
    (phl.phases[0] as RoundRobinCompetitionPhase).groups[0].stats
  );
  if (!presidentsTrophy) {
    throw new Error("Presidents trophy fail");
  }

  const phlLoser = nth(
    11,
    (phl.phases[0] as RoundRobinCompetitionPhase).groups[0].stats
  );
  if (!phlLoser) {
    throw new Error("PHL loser fail");
  }

  const divisionVictor = nth(
    0,
    victors((division.phases[3] as PlayoffsCompetitionPhase).groups[0])
  );

  if (!divisionVictor) {
    throw new Error("Division victor loser fail");
  }

  const divisionEliminated = nth(
    0,
    eliminated((division.phases[3] as PlayoffsCompetitionPhase).groups[0])
  );

  if (!divisionEliminated) {
    throw new Error("Division final eliminated loser fail");
  }

  // yield call(setSeasonStat, ["presidentsTrophy"], presidentsTrophy);

  const phlVictors = victors(
    (phl.phases[3] as PlayoffsCompetitionPhase).groups[0]
  );

  const phlLosers = eliminated(
    (phl.phases[3] as PlayoffsCompetitionPhase).groups[0]
  );

  const medalists = [
    nth(0, phlVictors),
    nth(0, phlLosers),
    nth(1, phlVictors)
  ] as PlayoffTeamStat[];

  if (!medalists.every(m => m)) {
    throw new Error("Medalists fail");
  }

  const mutasarjaVictors = victors(
    (mutasarja.phases[3] as PlayoffsCompetitionPhase).groups[0]
  );

  if (!mutasarjaVictors.every(m => m)) {
    throw new Error("Mutasarja victors fail");
  }

  const divisionLosers = takeLast(
    2,
    (division.phases[0] as RoundRobinCompetitionPhase).groups[0].stats
  );
  if (divisionLosers.length !== 2) {
    throw new Error("PHL loser fail");
  }

  const relegatedFromPHL = phlLoser.id === divisionVictor.id ? [] : [phlLoser];

  const promotedFromDivision =
    phlLoser.id === divisionVictor.id ? [] : [divisionVictor];

  interface Comparable {
    id: string;
  }
  const cmp = (a: Comparable, b: Comparable) => a.id === b.id;

  const promotedFromMutasarja = differenceWith(
    cmp,
    mutasarjaVictors,
    divisionLosers
  );

  const relegatedFromDivision = differenceWith(
    cmp,
    divisionLosers,
    mutasarjaVictors
  );

  const stats: SeasonStatistic = {
    medalists: medalists.map(m => m.id),
    presidentsTrophy: presidentsTrophy.id,
    cupWinner: cupWinner,
    ehlWinner: ehlWinner.id,
    relegated: {
      phl: relegatedFromPHL.map(t => t.id),
      division: relegatedFromDivision.map(r => r.id)
    },
    promoted: {
      division: promotedFromDivision.map(t => t.id),
      mutasarja: promotedFromMutasarja.map(p => p.id)
    }
  };

  console.log("SEASON STATS", stats);

  console.log(
    relegatedFromPHL,
    promotedFromDivision,
    phlLoser,
    divisionVictor,
    "dsiohdsoih"
  );

  const worstOfTheWorst = sortLeagueTable([
    ...takeLast(
      6,
      (mutasarja.phases[0].groups[0] as RoundRobinCompetitionGroup).stats
    ),
    ...takeLast(
      6,
      (mutasarja.phases[0].groups[1] as RoundRobinCompetitionGroup).stats
    )
  ]);

  const ranking = [
    ...medalists.map(m => m.id),
    nth(1, phlLosers)?.id,
    ...eliminated((phl.phases[1] as PlayoffsCompetitionPhase).groups[0]).map(
      t => t.id
    ),
    ...slice(
      8,
      11,
      (phl.phases[0] as RoundRobinCompetitionPhase).groups[0].stats
    ).map(t => t.id),
    divisionVictor.id,
    divisionEliminated.id,
    ...eliminated(
      (division.phases[2] as PlayoffsCompetitionPhase).groups[0]
    ).map(t => t.id),
    ...eliminated(
      (division.phases[1] as PlayoffsCompetitionPhase).groups[0]
    ).map(t => t.id),
    ...slice(
      6,
      10,
      (division.phases[0] as RoundRobinCompetitionPhase).groups[0].stats
    ).map(t => t.id),
    ...victors((mutasarja.phases[3] as PlayoffsCompetitionPhase).groups[0]).map(
      t => t.id
    ),
    ...eliminated(
      (mutasarja.phases[3] as PlayoffsCompetitionPhase).groups[0]
    ).map(t => t.id),
    ...eliminated(
      (mutasarja.phases[2] as PlayoffsCompetitionPhase).groups[0]
    ).map(t => t.id),
    ...eliminated(
      (mutasarja.phases[1] as PlayoffsCompetitionPhase).groups[0]
    ).map(t => t.id),
    ...worstOfTheWorst.map(t => t.id)
  ];

  const uniqs = uniq(ranking);

  if (uniqs.length !== ranking.length) {
    throw new Error("YÄK");
  }

  const rankings = ranking.map((id, index) => ({ id, ranking: index + 1 }));

  console.log("DA RANKING", ranking);
  console.log("RANKAT RANKINGIT", rankings);

  if (ranking.length !== 48) {
    throw new Error("Ranking error");
  }

  // TODO FIX TYPING
  yield all([
    ...stats.relegated.phl.map(t => relegate("phl", t)),
    ...stats.relegated.division.map(t => relegate("division", t)),
    ...stats.promoted.division.map(t => promote("division", t)),
    ...stats.promoted.mutasarja.map(t => promote("mutasarja", t)),
    putResolve<GameSeasonEndAction>({
      type: GAME_SEASON_END,
      payload: {
        seasonStats: stats,
        rankings
      } as {
        seasonStats: SeasonStatistic;
        rankings: { id: string; ranking: number }[];
      }
    })
  ]);

  // yield call(processChampionBets);
  // yield call(setSeasonStat, ["medalists"], medalists);

  /*
  if (divisionVictor !== phlLoser) {
    yield call(setSeasonStat, ["relegated"], phlLoser);
    yield call(setSeasonStat, ["promoted"], divisionVictor);
  }*/

  return;

  throw new Error("Oolalal");

  yield call(createSeasonStories);

  yield take("GAME_ADVANCE_REQUEST");

  yield put({
    type: "GAME_SEASON_END"
  });

  if (divisionVictor !== phlLoser) {
    yield all([promote("division", divisionVictor), relegate("phl", phlLoser)]);
  }

  yield call(seasonStart);
}
