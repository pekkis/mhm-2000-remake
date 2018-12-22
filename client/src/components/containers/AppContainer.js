import { connect } from "react-redux";
import App from "../App";
import { advance } from "../../ducks/game";

export default connect(
  state => ({
    turn: state.game.get("turn"),
    player: state.player.getIn(["players", state.player.get("active")]),
    teams: state.game.get("teams"),
    competitions: state.game.get("competitions")
  }),
  { advance }
)(App);
