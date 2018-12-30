import { connect } from "react-redux";
import Game from "../Game";
import { startGame, loadGame } from "../../ducks/meta";
import { withRouter } from "react-router";

export default withRouter(
  connect(
    state => ({
      started: state.meta.get("started"),
      turn: state.game.get("turn")
    }),
    { startGame, loadGame }
  )(Game)
);
