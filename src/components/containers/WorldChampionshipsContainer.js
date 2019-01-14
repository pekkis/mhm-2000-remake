import { connect } from "react-redux";
import WorldChampionships from "../WorldChampionships";
export default connect(state => ({
  results: state.game.get("worldChampionshipResults"),
  turn: state.game.get("turn")
}))(WorldChampionships);
