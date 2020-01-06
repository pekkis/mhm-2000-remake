import { connect } from "react-redux";
import StartMenu from "../StartMenu";
import { startGame, loadGame } from "../../ducks/meta";
import { advance } from "../../ducks/game";
import { withRouter } from "react-router";
import { playableCompetitions } from "../../data/selectors";

export default withRouter(
  connect(
    state => ({
      started: state.meta.get("started"),
      starting: state.meta.get("starting"),
      manager: state.meta.get("manager"),
      teams: state.game.get("teams"),
      competitions: playableCompetitions(state)
    }),
    { startGame, loadGame, advance }
  )(StartMenu)
);
