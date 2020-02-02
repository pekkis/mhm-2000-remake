import { Map } from "immutable";
import createStore from "./store";
import gameService from "./services/game";

const store = createStore();
store.dispatch({
  type: "GAME_START_REQUEST"
});

const state = store.getState();

const home = state.game.getIn(["teams", 1]);
const away = state.game.getIn(["teams", 2]);

const game = Map({
  home,
  away,
  advantage: Map({
    home: strength => strength + 10,
    away: strength => strength - 10
  }),
  base: () => 20
});

const result = gameService.simulate(game);
