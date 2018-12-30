import { connect } from "react-redux";
import StartMenu from "../StartMenu";
import { startGame, loadGame } from "../../ducks/meta";
import { advance } from "../../ducks/game";
import { withRouter } from "react-router";

export default withRouter(
  connect(
    state => ({
      started: state.meta.get("started"),
      starting: state.meta.get("starting"),
      player: state.meta.get("player")
    }),
    { startGame, loadGame, advance }
  )(StartMenu)
);
