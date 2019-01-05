import { connect } from "react-redux";
import Arena from "../Arena";
import { improveArena } from "../../ducks/manager";

export default connect(
  state => ({
    manager: state.manager.getIn(["managers", state.manager.get("active")]),
    teams: state.game.get("teams")
  }),
  { improveArena }
)(Arena);
