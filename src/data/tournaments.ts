import { select } from "redux-saga/effects";
import { managersMainCompetition, managersTeamId } from "../services/selectors";
import { amount as a } from "../services/format";
import { Team, CompetitionNames, LeagueTable } from "../types/base";
import { inRange } from "ramda-adjunct";
import { MHMState } from "../ducks";

const invitationCreator = (
  competitionId: string,
  maxRanking: number
): ((manager: string) => Generator<any, boolean, any>) => {
  return function*(manager) {
    const mainCompetition: CompetitionNames = yield select(
      managersMainCompetition(manager)
    );
    const teamId: number = yield select(managersTeamId(manager));

    if (mainCompetition !== competitionId) {
      return false;
    }

    const stats: LeagueTable = yield select(
      (state: MHMState) =>
        state.game.competitions[mainCompetition].phases[0].groups[0].stats
    );

    const ranking = stats.findIndex(stat => stat.id === teamId);
    return ranking <= maxRanking;
  };
};

interface TournamentDefinition {
  name: string;
  award: number;
  description: (amount: number) => string;
  filter: (team: Team) => boolean;
  isInvited: (manager: string) => Generator<any, boolean, any>;
}

const tournamentList: TournamentDefinition[] = [
  {
    name: "Christmas Cup",
    award: 300000,
    description: amount =>
      `__Christmas Cup__ on euroopan perinteisin, suurin ja seuratuin jokavuotinen kutsuturnaus. Mukana on seurajoukkueita monesta maasta, ja osallistumisesta on luvassa __${a(
        amount
      )}__ pekkaa.`,
    isInvited: invitationCreator("phl", 5),
    filter: t => t.strength > 200
  },
  {
    name: "Go-Go Cola Cup",
    award: 250000,
    description: amount =>
      `__GoGo Cola-Cup__ on ei-kovin-perinteikäs, miedosti tunnettu ja arvostettu joulunajan kutsuturnaus Kööpenhaminassa, Tanskassa, ja joukkuettasi on pyydetty mukaan. Osallistuminen kartuttaisi kassaa __${a(
        amount
      )}__ pekalla.`,
    isInvited: invitationCreator("phl", 9),
    filter: t => inRange(150, 226, t.strength)
  },
  {
    name: "Cacca Cup",
    award: 100000,
    description: amount =>
      `Sloveniassa järjestettävään __Cacca Cupiin__ osallistuvat monet maanosan ehdottomat rupuseurat! Järjestäjät etsivät uusia jännittäviä kökköjoukkueita surkuhupaisaan pikku turnaukseensa, ja osallistumisesta on luvassa __${a(
        amount
      )}__ pekan palkkio.`,
    isInvited: invitationCreator("division", 5),
    filter: t => t.strength <= 175
  }
];

export default tournamentList;
