import { connect } from "react-redux";
import Calendar from "../Calendar";

export default connect(state => ({
  turn: state.game.get("turn"),
  state
}))(Calendar);
