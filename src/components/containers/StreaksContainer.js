import { connect } from "react-redux";
import Streaks from "../Streaks";
export default connect(state => ({
  teams: state.game.get("teams"),
  competitions: state.game.get("competitions"),
  streaks: state.stats.getIn(["streaks", "team"])
}))(Streaks);
