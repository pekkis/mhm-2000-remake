import { connect } from "react-redux";
import App from "../App";
import { startGame, loadGame } from "../../ducks/meta";
import { withRouter } from "react-router";
import { MHMState } from "../../ducks";

export default withRouter(
  connect(
    (state: MHMState) => ({
      started: state.meta.started
    }),
    { startGame, loadGame }
  )(App)
);
