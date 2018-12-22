import { Map, List } from "immutable";
import turnService from "../services/turn";

import gameService from "../services/game";
import competitionData from "../data/competitions";

export const GAME_START = "GAME_START";
export const SEASON_START = "SEASON_START";
export const GAME_ADVANCE_REQUEST = "GAME_ADVANCE_REQUEST";
export const GAME_ADVANCE = "GAME_ADVANCE";

const defaultState = Map({
  turn: Map({
    season: 1997,
    round: 1,
    phase: 1
  }),

  competitions: Map({
    phl: Map({
      id: "phl",
      phase: 0,
      name: "PHL",
      teams: List.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11),
      phases: List.of(
        Map({
          round: 0,
          name: "runkosarja",
          type: "round-robin",
          teams: 12,
          times: 2,
          schedule: List()
        })
      )
    }),
    division: Map({
      id: "division",
      phase: 0,
      name: "Divisioona",
      teams: List.of(12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23),
      phases: List.of(
        Map({
          round: 0,
          name: "runkosarja",
          type: "round-robin",
          teams: 12,
          times: 2,
          schedule: List()
        })
      )
    })
  }),

  teams: List.of(
    Map({ name: "KalPa", strength: 95 }),
    Map({ name: "Jokerit", strength: 221 }),
    Map({ name: "TPS", strength: 250 }),
    Map({ name: "JyP HT", strength: 158 }),
    Map({ name: "HPK", strength: 155 }),
    Map({ name: "HIFK", strength: 260 }),
    Map({ name: "Ilves", strength: 262 }),
    Map({ name: "Tappara", strength: 180 }),
    Map({ name: "Kiekko-Espoo", strength: 185 }),
    Map({ name: "Lukko", strength: 160 }),
    Map({ name: "Ässät", strength: 220 }),
    Map({ name: "SaiPa", strength: 195 }),
    Map({ name: "Maso HT", strength: 65 }),
    Map({ name: "Karhut", strength: 80 }),
    Map({ name: "Kärpät", strength: 145 }),
    Map({ name: "TuTo", strength: 65 }),
    Map({ name: "Hermes", strength: 96 }),
    Map({ name: "Pelicans", strength: 99 }),
    Map({ name: "Diskos", strength: 55 }),
    Map({ name: "Jääkotkat", strength: 40 }),
    Map({ name: "SaPKo", strength: 74 }),
    Map({ name: "Haukat", strength: 55 }),
    Map({ name: "Ahmat", strength: 40 }),
    Map({ name: "Sport", strength: 80 })
  )
});

/*
"KalPa   ","Jokerit ","TPS     ","JyP HT  ","HPK     ","HIFK    ","Ilves   ","Tappara ","K-Espoo ","Lukko   ","Žss„t   ","SaiPa   "
"Maso HT ","Karhut  ","K„rp„t  ","TuTo    ","Hermes  ","Pelicans","Diskos  ","J-Kotkat","SaPKo   ","Haukat  ","Ahmat   ","Sport   "
95,221,250,158,155,260,262,180,185,160,220,195
65,80,145,65,96,99,55,40,74,55,40,80
*/

export const advance = () => {
  return {
    type: GAME_ADVANCE_REQUEST
  };
};

export default function gameReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case SEASON_START:
      return state
        .update("teams", teams =>
          teams.map(t => {
            return t.set("effects", List());
          })
        )
        .update("competitions", competitions => {
          return competitions.map((c, k) =>
            competitionData.getIn([k, "hooks", SEASON_START])(c)
          );
        });

    case "GAME_SET_PHASE":
      return state.setIn(["turn", "phase"], payload);

    case "GAME_NEXT_TURN":
      return state
        .setIn(["turn", "phase"], 1)
        .updateIn(["turn", "round"], r => r + 1);

    case "GAME_GAMEDAY":
      return state.update("competitions", competitions => {
        return competitions.update(payload, c => {
          const teams = c.get("teams");

          console.log("competishöön", c.toJS());

          return c.updateIn(["phases", 0], phase => {
            return phase
              .updateIn(["schedule", phase.get("round")], round => {
                return round.map(pairing => {
                  // console.log("pairing", pairing.toJS());

                  const home = state.getIn([
                    "teams",
                    teams.get(pairing.get("home"))
                  ]);

                  const away = state.getIn([
                    "teams",
                    teams.get(pairing.get("away"))
                  ]);

                  const gameParams = competitionData.getIn([
                    c.get("id"),
                    "parameters",
                    "gameday"
                  ]);

                  // console.log(gameParams);

                  const game = Map({
                    ...gameParams,
                    home,
                    away
                  });

                  // console.log(game, "geim");

                  const result = gameService.simulate(game);

                  // console.log(result, "reslut");

                  return pairing.set("result", result);
                });
              })
              .update("round", r => r + 1);
          });
        });
      });

    default:
      return state;
  }
}
