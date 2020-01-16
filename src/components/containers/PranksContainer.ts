import { connect } from "react-redux";
import Pranks from "../Pranks";
import {
  orderPrank,
  selectPrankType,
  selectPrankVictim,
  cancelPrank
} from "../../ducks/prank";
export default connect(
  state => ({
    turn: state.game.get("turn"),
    manager: state.manager.getIn(["managers", state.manager.get("active")]),
    managers: state.manager.get("managers"),
    teams: state.game.get("teams"),
    events: state.event.get("events"),
    news: state.news.get("news"),
    advanceEnabled: state.ui.get("advanceEnabled"),
    prank: state.ui.get("prank"),
    competitions: state.game.get("competitions")
  }),
  { orderPrank, selectPrankType, selectPrankVictim, cancelPrank }
)(Pranks);
