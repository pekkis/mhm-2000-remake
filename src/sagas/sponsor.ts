import { append, range, prop } from "ramda";
import { call, put, select } from "redux-saga/effects";
import { v4 as uuid } from "uuid";
import {
  SponsorCreateProposalsAction,
  SPONSOR_CREATE_PROPOSALS
} from "../ducks/sponsor";
import difficultyLevelMap from "../services/difficulty-levels";
import {
  humanManagers,
  requireHumanManagersTeamObj,
  selectAllTeamsCompetitions,
  teamsAverageRankingFromLastYears,
  selectTeamSponsorshipDeals,
  selectCurrentTurn
} from "../services/selectors";
import {
  getArenaModifier,
  getRandomSponsorName,
  weightedSponsorshipClausuleList,
  getRandomAttitude,
  sponsorshipClausuleMap
} from "../services/sponsors";
import { CompetitionNames, FinancialTransaction, Turn } from "../types/base";
import { HumanManager } from "../types/manager";
import {
  SponsorshipProposal,
  SponsorshipProposalClausule,
  SponsorshipDeal
} from "../types/sponsor";
import { Team } from "../types/team";
import {
  TEAM_FINANCIAL_TRANSACTION,
  TeamFinancialTransactionAction
} from "../ducks/team";

const createClausules = (
  proposal: SponsorshipProposal
): SponsorshipProposal => {
  const proposalAfterClausules = weightedSponsorshipClausuleList().reduce(
    (p, ps) => {
      if (!ps.willSponsorOffer(p)) {
        return p;
      }

      const randomAttitude = getRandomAttitude(p);

      const clausule: SponsorshipProposalClausule = {
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
          basic: 0,
          cup: 0,
          ehl: 0
        },
        open: true,
        requirementsOpen: true,
        timesNegotiated: 0
      };

      return createClausules(proposal);
    }
  );
}

export function* executeSponsorFinancialTransaction(
  team: Team,
  clausuleType: string
) {
  const deals: SponsorshipDeal[] = yield select(
    selectTeamSponsorshipDeals(team.id)
  );

  const turn: Turn = yield select(selectCurrentTurn);

  const transactions: FinancialTransaction[] = deals
    .map(deal => {
      return deal.clausules
        .filter(c => c.type === clausuleType)
        .map(
          (clausule): FinancialTransaction => {
            return {
              team: team.id,
              season: turn.season,
              round: turn.round,
              category: "sponsorship",
              amount: clausule.amount,
              reference: `${sponsorshipClausuleMap[clausule.type].title}, ${
                deal.sponsorName
              }`
            };
          }
        );
    })
    .flat();

  yield put<TeamFinancialTransactionAction>({
    type: TEAM_FINANCIAL_TRANSACTION,
    payload: transactions
  });
}

export function* nullifySponsorshipDealClausule(
  team: Team,
  clausuleType: string
) {}

export function* createSponsorshipProposals() {
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
