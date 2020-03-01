import { put, putResolve, select, call } from "redux-saga/effects";
import strategies from "../../services/strategies";
import { MHMState } from "../../ducks";
import {
  Turn,
  MapOf,
  CalendarEntry,
  FinancialTransaction
} from "../../types/base";
import { Team } from "../../types/team";
import { values, concat, sum, map, append } from "ramda";
import {
  GameDecrementDurationsActions,
  GAME_DECREMENT_DURATIONS
} from "../../ducks/game";
import {
  TeamIncrementReadinessAction,
  TEAM_INCREMENT_READINESS,
  TeamFinancialTransactionAction,
  TEAM_FINANCIAL_TRANSACTION
} from "../../ducks/team";
import {
  currentCalendarEntry,
  selectCurrentTurn,
  selectTeamsContractedPlayers
} from "../../services/selectors";
import { isHumanControlledTeam } from "../../services/team";
import { Player } from "../../types/player";

function* paySalaries(teams: MapOf<Team>) {
  let transactions: FinancialTransaction[] = [];

  const turn: Turn = yield select(selectCurrentTurn);

  for (const team of values(teams)) {
    if (isHumanControlledTeam(team)) {
      const players: Player[] = yield select(
        selectTeamsContractedPlayers(team.id, true)
      );
      const totalSalaries = sum(players.map(p => p.contract?.salary || 0));
      transactions = append(
        {
          season: turn.season,
          round: turn.round,
          team: team.id,
          amount: -totalSalaries,
          category: "salary"
        },
        transactions
      );
    }
  }

  yield put<TeamFinancialTransactionAction>({
    type: TEAM_FINANCIAL_TRANSACTION,
    payload: transactions
  });
}

export default function* calculationsPhase() {
  const turn: Turn = yield select(selectCurrentTurn);

  const calendarEntry: CalendarEntry = yield select(currentCalendarEntry);

  console.log("DOING CALCULATIONS FOR TURN", calendarEntry);

  const teams: MapOf<Team> = yield select(
    (state: MHMState) => state.team.teams
  );

  if (calendarEntry.tags.includes("paySalaries")) {
    yield call(paySalaries, teams);
  }

  if (calendarEntry.tags.includes("sponsorRoundlyPayment")) {
    // todo
  }

  if (calendarEntry.tags.includes("incrementReadiness")) {
    console.log("DOING READINESS INCREMENTS");
    const readinessIncrements = values(teams).map(team => {
      if (!team.strategy) {
        throw new Error(
          `Team ${team.id} has no strategy. It should not happen?!?`
        );
      }

      return {
        team: team.id,
        amount: strategies[team.strategy].incrementReadiness(turn)
      };
    });

    yield put<TeamIncrementReadinessAction>({
      type: TEAM_INCREMENT_READINESS,
      payload: readinessIncrements
    });
  }

  // Durations are always calculated no matter what
  yield putResolve<GameDecrementDurationsActions>({
    type: GAME_DECREMENT_DURATIONS
  });
}
