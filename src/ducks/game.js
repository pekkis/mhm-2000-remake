import { Map, List, fromJS } from "immutable";

import teams from "../data/teams";
import managers from "../data/managers";

export const GAME_START = "GAME_START";
export const SEASON_START = "SEASON_START";
export const GAME_ADVANCE_REQUEST = "GAME_ADVANCE_REQUEST";
export const GAME_ADVANCE = "GAME_ADVANCE";

const defaultState = Map({
  turn: Map({
    season: 1997,
    round: 0,
    phase: undefined
  }),

  flags: Map({
    jarko: false,
    usa: false,
    canada: false
  }),

  ehlParticipants: List.of(2, 3, 12),
  insurancePrice: 1000,

  managers,

  competitions: Map({
    ehl: Map({
      weight: 2000,
      id: "ehl",
      phase: 0,
      name: "EHL",
      phases: List()
    }),
    phl: Map({
      weight: 1000,
      id: "phl",
      phase: 0,
      name: "PHL",
      teams: List.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12),
      phases: List()
    }),
    division: Map({
      weight: 1000,
      id: "division",
      phase: 0,
      name: "Divisioona",
      teams: List.of(11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23),
      phases: List()
    })
  }),

  teams: teams.map(t => t.update("strength", s => s()))
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

    case "COMPETITION_SET_TEAMS":
      return state.setIn(
        ["competitions", payload.competition, "teams"],
        payload.teams
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
      return state
        .update("teams", teams =>
          teams.map(t => {
            return t
              .set("effects", List())
              .set("morale", 0)
              .set("strategy", 2);
          })
        )
        .setIn(["flags", "jarko"], false);

    case "SEASON_END":
      return state.update("turn", turn => {
        return turn.update("season", season => season + 1).set("round", -1);
      });

    case "GAME_RESULT":
      // console.log("pl", payload);

      return state.updateIn(
        [
          "competitions",
          payload.competition,
          "phases",
          payload.phase,
          "groups",
          payload.group,
          "schedule",
          payload.round,
          payload.pairing
        ],
        r => r.set("result", payload.result)
      );

    case "GAME_GAMEDAY_COMPLETE":
      return state.updateIn(
        [
          "competitions",
          payload.competition,
          "phases",
          payload.phase,
          "groups",
          payload.group,
          "round"
        ],
        r => r + 1
      );

    case "GAME_SET_PHASE":
      return state.setIn(["turn", "phase"], payload);

    case "TEAM_INCREMENT_MORALE":
      return state.updateIn(
        ["teams", payload.team, "morale"],
        m => m + payload.amount
      );
    case "TEAM_DECREMENT_MORALE":
      return state.updateIn(
        ["teams", payload.team, "morale"],
        m => m - payload.amount
      );

    case "TEAM_SET_STRATEGY":
      return state.setIn(["teams", payload.team, "strategy"], payload.strategy);

    case "TEAM_INCREMENT_STRENGTH":
      return state.updateIn(
        ["teams", payload.team, "strength"],
        m => m + payload.amount
      );

    case "TEAM_SET_STRENGTH":
      return state.setIn(["teams", payload.team, "strength"], payload.amount);

    case "TEAM_SET_STRENGTHS":
      return payload.reduce((state, entry) => {
        return state.setIn(["teams", entry.id, "strength"], entry.strength);
      }, state);

    case "TEAM_DECREMENT_STRENGTH":
      return state.updateIn(
        ["teams", payload.team, "strength"],
        m => m - payload.amount
      );

    case "TEAM_RENAME":
      return state.setIn(["teams", payload.team, "name"], payload.name);

    case "TEAM_ADD_EFFECT":
      return state.updateIn(["teams", payload.team, "effects"], effects =>
        effects.push(Map(payload.effect))
      );

    case "GAME_DECREMENT_DURATIONS":
      return state.update("teams", teams => {
        return teams.map(team => {
          return team.update("effects", effects => {
            return effects.map(e => e.update("duration", d => d - 1));
          });
        });
      });

    case "GAME_CLEAR_EXPIRED":
      return state.update("teams", teams => {
        return teams.map(team => {
          return team.update("effects", effects => {
            return effects.filter(e => e.get("duration") > 0);
          });
        });
      });

    case "GAME_NEXT_TURN":
      return state.updateIn(["turn", "round"], r => r + 1);

    case "GAME_SET_FLAG":
      return state.setIn(["flags", payload.flag], payload.value);

    default:
      return state;
  }
}
