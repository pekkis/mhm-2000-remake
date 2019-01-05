import { connect } from "react-redux";
import MaxRound from "../MaxRound";

export default connect(state => ({
  turn: state.game.get("turn")
}))(MaxRound);
