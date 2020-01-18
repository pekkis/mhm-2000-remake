import { putResolve } from "redux-saga/effects";
import {
  CompetitionRemoveTeamAction,
  COMPETITION_REMOVE_TEAM,
  CompetitionAddTeamAction,
  COMPETITION_ADD_TEAM,
  CompetitionSetTeamsAction,
  COMPETITION_SET_TEAMS
} from "../ducks/competition";
import { CompetitionNames } from "../types/base";

export function* removeTeamFromCompetition(
  competition: CompetitionNames,
  team: string
) {
  yield putResolve<CompetitionRemoveTeamAction>({
    type: COMPETITION_REMOVE_TEAM,
    payload: {
      competition,
      team
    }
  });
}

export function* addTeamToCompetition(
  competition: CompetitionNames,
  team: string
) {
  yield putResolve<CompetitionAddTeamAction>({
    type: COMPETITION_ADD_TEAM,
    payload: {
      competition,
      team
    }
  });
}

export function* setCompetitionTeams(
  competition: CompetitionNames,
  teams: string[]
) {
  yield putResolve<CompetitionSetTeamsAction>({
    type: COMPETITION_SET_TEAMS,
    payload: {
      competition,
      teams
    }
  });
}
