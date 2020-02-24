import { append, range } from "ramda";
import { call, put, select } from "redux-saga/effects";
import uuid from "uuid";
import {
  SponsorCreateProposalsAction,
  SPONSOR_CREATE_PROPOSALS
} from "../ducks/sponsor";
import difficultyLevelMap from "../services/difficulty-levels";
import {
  humanManagers,
  requireHumanManagersTeamObj,
  selectAllTeamsCompetitions,
  teamsAverageRankingFromLastYears
} from "../services/selectors";
import {
  getArenaModifier,
  getRandomSponsorName,
  weightedSponsorshipClausuleList,
  getRandomAttitude
} from "../services/sponsors";
import { CompetitionNames } from "../types/base";
import { HumanManager } from "../types/manager";
import { SponsorshipProposal, SponsorshipClausule } from "../types/sponsor";
import { Team } from "../types/team";

const createClausules = (
  proposal: SponsorshipProposal
): SponsorshipProposal => {
  const proposalAfterClausules = weightedSponsorshipClausuleList().reduce(
    (p, ps) => {
      if (!ps.willSponsorOffer(p)) {
        return p;
      }

      const randomAttitude = getRandomAttitude(p);

      const clausule: SponsorshipClausule = {
        type: ps.id,
        multiplier: randomAttitude
      };

      return {
        ...p,
        clausules: append(clausule, p.clausules)
      };
    },
    proposal
  );

  return proposalAfterClausules;
};

function* createSponsorshipProposalsForManager(manager: HumanManager) {
  console.log("CREATING SPONSORSHIP PROPOSALS FOR", manager.name);
  const team: Team = yield select(requireHumanManagersTeamObj(manager.id));

  const averageRankingFromLast3Years: number = yield select(
    teamsAverageRankingFromLastYears(team.id, 3)
  );
  const rankingModifier = 49 - averageRankingFromLast3Years;

  const difficultyObj = difficultyLevelMap[manager.difficultyLevel];

  const competitions: CompetitionNames[] = yield select(
    selectAllTeamsCompetitions(team.id)
  );

  const baseAmount =
    20000 * (1 + rankingModifier * 0.07) * difficultyObj.sponsorshipModifier();

  const attitudeBonus = getArenaModifier(team.arena);

  return range(0, 3).map(
    (r): SponsorshipProposal => {
      const proposal: SponsorshipProposal = {
        id: uuid(),
        weight: r * 1000,
        sponsorName: getRandomSponsorName(),
        baseAmount,
        attitudeBonus,
        team: team.id,
        competitions,
        clausules: [],
        requirements: {
          basic: 1,
          cup: 2,
          ehl: 0
        },
        open: true
      };

      return createClausules(proposal);
    }
  );
}

export function* createSponsorshipProposals() {
  console.log("CREATING SPONSORSHIP PROPOSALS");
  const managers = yield select(humanManagers);

  for (const manager of managers) {
    const proposals: SponsorshipProposal[] = yield call(
      createSponsorshipProposalsForManager,
      manager
    );

    yield put<SponsorCreateProposalsAction>({
      type: SPONSOR_CREATE_PROPOSALS,
      payload: { proposals }
    });
  }

  console.log(managers);
}
