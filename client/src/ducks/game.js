import { Map, List, fromJS } from "immutable";

import teams from "../data/teams";

export const GAME_START = "GAME_START";
export const SEASON_START = "SEASON_START";
export const GAME_ADVANCE_REQUEST = "GAME_ADVANCE_REQUEST";
export const GAME_ADVANCE = "GAME_ADVANCE";

const defaultState = Map({
  turn: Map({
    season: 1997,
    round: 1,
    phase: "action"
  }),

  flags: Map(),

  managers: List.of(
    "Marcó Harcimó",
    "Hannes DeAnsas",
    "Carlos Numminen",
    "Marty Saariganges",
    "Per von Bachman",
    "Micho Magelä",
    "Sven Stenvall",
    "Curt Lindman",
    "Jannu Hortikka",
    "Kari P.A. Sietilä",
    "Sulpo Ahonen",
    "Aimo S. Rummanen",
    "Juri Simonov",
    "Nykan Hågren",
    "Juri Simonov Jr."
  ),

  /*

  .of(
        Map({
          round: 0,
          name: "runkosarja",
          type: "round-robin",
          teams: 12,
          times: 2,
          schedule: List()
        })
      )

  .of(
        Map({
          round: 0,
          name: "runkosarja",
          type: "round-robin",
          teams: 12,
          times: 2,
          schedule: List()
        })
      )

  */

  competitions: Map({
    phl: Map({
      id: "phl",
      phase: 0,
      name: "PHL",
      teams: List.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11),
      phases: List()
    }),
    division: Map({
      id: "division",
      phase: 0,
      name: "Divisioona",
      teams: List.of(12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23),
      phases: List()
    })
  }),

  teams
});

export const advance = payload => {
  return {
    type: GAME_ADVANCE_REQUEST,
    payload
  };
};

export default function gameReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case "META_QUIT_TO_MAIN_MENU":
      return defaultState;

    case "META_GAME_LOAD_STATE":
      return fromJS(payload.game);

    case "COMPETITION_REMOVE_TEAM":
      return state.updateIn(
        ["competitions", payload.competition, "teams"],
        teams => teams.filterNot(t => t === payload.team)
      );

    case "COMPETITION_ADD_TEAM":
      return state.updateIn(
        ["competitions", payload.competition, "teams"],
        teams => teams.push(payload.team)
      );

    case "COMPETITION_START":
      return state.updateIn(["competitions", payload.competition], c => {
        return c.set("phases", List());
      });

    case "COMPETITION_SEED":
      return state
        .setIn(
          ["competitions", payload.competition, "phases", payload.phase],
          payload.seed
        )
        .setIn(["competitions", payload.competition, "phase"], payload.phase);

    case SEASON_START:
      return state.update("teams", teams =>
        teams.map(t => {
          return t
            .set("effects", List())
            .set("morale", 0)
            .set("strategy", 2);
        })
      );

    case "SEASON_END":
      return state.update("turn", turn => {
        return turn.update("season", season => season + 1).set("round", 0);
      });

    case "GAME_RESULT":
      // console.log("pl", payload);

      return state.updateIn(
        [
          "competitions",
          payload.competition,
          "phases",
          payload.phase,
          "schedule",
          payload.round,
          payload.pairing
        ],
        r => r.set("result", payload.result)
      );

    case "GAME_GAMEDAY_COMPLETE":
      return state.updateIn(
        ["competitions", payload.competition, "phases", payload.phase, "round"],
        r => r + 1
      );

    case "GAME_SET_PHASE":
      return state.setIn(["turn", "phase"], payload);

    case "TEAM_INCREMENT_MORALE":
      return state.updateIn(
        ["teams", payload.team, "morale"],
        m => m + payload.amount
      );

    case "TEAM_SET_STRATEGY":
      return state.setIn(["teams", payload.team, "strategy"], payload.strategy);

    case "TEAM_INCREMENT_STRENGTH":
      return state.updateIn(
        ["teams", payload.team, "strength"],
        m => m + payload.amount
      );

    case "TEAM_RENAME":
      return state.setIn(["teams", payload.team, "name"], payload.name);

    case "GAME_NEXT_TURN":
      return state.updateIn(["turn", "round"], r => r + 1);

    case "GAME_SET_FLAG":
      return state.setIn(["flags", payload.flag], payload.value);

    default:
      return state;
  }
}
