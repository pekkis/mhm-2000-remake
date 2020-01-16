import { connect } from "react-redux";
import StartMenu from "../StartMenu";
import { startGame, loadGame } from "../../ducks/meta";
import { advance } from "../../ducks/game";
import { withRouter } from "react-router";
import { playableCompetitions } from "../../data/selectors";
import { MHMState } from "../../ducks";

export default withRouter(
  connect(
    (state: MHMState) => ({
      started: state.meta.started,
      starting: state.meta.starting,
      manager: state.meta.manager,
      teams: state.game.teams,
      competitions: playableCompetitions(state)
    }),
    { startGame, loadGame, advance }
  )(StartMenu)
);
