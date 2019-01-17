import { connect } from "react-redux";
import Stats from "../Stats";

export default connect(state => ({
  manager: state.manager.getIn(["managers", state.manager.get("active")]),
  teams: state.game.get("teams"),
  competitions: state.game.get("competitions"),
  stats: state.stats
}))(Stats);
