import { Map, List, Range } from "immutable";
import { select } from "redux-saga/effects";
import { managersMainCompetition, managersTeamId } from "./selectors";
import { amount as a } from "../services/format";

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
    award: 300000,
    description: amount =>
      `__Christmas Cup__ on euroopan perinteisin, suurin ja seuratuin jokavuotinen kutsuturnaus. Mukana on seurajoukkueita monesta maasta, ja osallistumisesta on luvassa __${a(
        amount
      )}__ pekkaa.`,
    isInvited: invitationCreator("phl", 5),
    filter: t => t.get("strength") > 200
  }),
  Map({
    name: "Go-Go Cola Cup",
    award: 250000,
    description: amount =>
      `__GoGo Cola-Cup__ on ei-kovin-perinteikäs, miedosti tunnettu ja arvostettu joulunajan kutsuturnaus Kööpenhaminassa, Tanskassa, ja joukkuettasi on pyydetty mukaan. Osallistuminen kartuttaisi kassaa __${a(
        amount
      )}__ pekalla.`,
    isInvited: invitationCreator("phl", 9),
    filter: t => Range(150, 225).includes(t.get("strength"))
  }),
  Map({
    name: "Cacca Cup",
    award: 100000,
    description: amount =>
      `Sloveniassa järjestettävään __Cacca Cupiin__ osallistuvat monet maanosan ehdottomat rupuseurat! Järjestäjät etsivät uusia jännittäviä kökköjoukkueita surkuhupaisaan pikku turnaukseensa, ja osallistumisesta on luvassa __${a(
        amount
      )}__ pekan palkkio.`,
    isInvited: invitationCreator("division", 5),
    filter: t => t.get("strength") <= 175
  })
);

export default tournamentList;
