import { Map, List, Range } from "immutable";
import { select } from "redux-saga/effects";
import { managersMainCompetition, managersTeamId } from "./selectors";

const invitationCreator = (competitionId, maxRanking) => {
  return function*(manager) {
    const mainCompetition = yield select(managersMainCompetition(manager));
    const teamId = yield select(managersTeamId(manager));
    if (mainCompetition !== competitionId) {
      return false;
    }

    const stats = yield select(state =>
      state.game.getIn([
        "competitions",
        mainCompetition,
        "phases",
        0,
        "groups",
        0,
        "stats"
      ])
    );

    const ranking = stats.findIndex(stat => stat.get("id") === teamId);
    return ranking <= maxRanking;
  };
};

const tournamentList = List.of(
  Map({
    name: "Christmas Cup",
    isInvited: invitationCreator("phl", 5),
    filter: t => t.get("strength") > 200
  }),
  Map({
    name: "Go-Go Cola Cup",
    isInvited: invitationCreator("phl", 9),
    filter: t => Range(150, 225).includes(t.get("strength"))
  }),
  Map({
    name: "Cacca Cup",
    isInvited: invitationCreator("division", 5),
    filter: t => t.get("strength") <= 175
  })
);

export default tournamentList;
