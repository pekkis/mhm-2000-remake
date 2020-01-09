import { connect } from "react-redux";
import Betting from "../Betting";
import { bet } from "../../ducks/betting";
import { MHMState } from "../../ducks";

export default connect(
  (state: MHMState) => ({
    turn: state.game.get("turn"),
    manager: state.manager.getIn(["managers", state.manager.get("active")]),
    teams: state.game.get("teams"),
    competition: state.game.getIn(["competitions", "phl"])
  }),
  { bet }
)(Betting);
