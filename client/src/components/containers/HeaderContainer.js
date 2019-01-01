import { connect } from "react-redux";
import Header from "../Header";
import { advance } from "../../ducks/game";
export default connect(
  state => ({
    player: state.player.getIn(["players", state.player.get("active")]),
    advanceEnabled: state.ui.get("advanceEnabled")
  }),
  { advance }
)(Header);
