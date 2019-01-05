import { connect } from "react-redux";
import Pranks from "../Pranks";
import {
  executePrank,
  selectPrankType,
  selectPrankVictim
} from "../../ducks/prank";
export default connect(
  state => ({
    turn: state.game.get("turn"),
    manager: state.manager.getIn(["managers", state.manager.get("active")]),
    managers: state.manager.get("managers"),
    teams: state.game.get("teams"),
    events: state.event.get("events"),
    news: state.news.get("news"),
    advanceEnabled: state.ui.get("advanceEnabled")
  }),
  { executePrank, selectPrankType, selectPrankVictim }
)(Pranks);
