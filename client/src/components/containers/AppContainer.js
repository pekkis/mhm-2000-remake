import { connect } from "react-redux";
import App from "../App";
import { startGame, loadGame } from "../../ducks/meta";
import { withRouter } from "react-router";

export default withRouter(
  connect(
    state => ({
      started: state.meta.get("started")
    }),
    { startGame, loadGame }
  )(App)
);
