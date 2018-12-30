import { connect } from "react-redux";
import SelectStrategy from "../SelectStrategy";
import { selectStrategy } from "../../ducks/player";

export default connect(
  state => ({
    player: state.player.getIn(["players", state.player.get("active")])
  }),
  { selectStrategy }
)(SelectStrategy);
