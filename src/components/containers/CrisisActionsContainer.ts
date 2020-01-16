import { connect } from "react-redux";
import CrisisActions from "../CrisisActions";
import { crisisMeeting } from "../../ducks/manager";
export default connect(
  state => ({
    turn: state.game.get("turn"),
    manager: state.manager.getIn(["managers", state.manager.get("active")]),
    managers: state.manager.get("managers"),
    teams: state.game.get("teams"),
    competitions: state.game.get("competitions"),
    events: state.event.get("events"),
    news: state.news.get("news")
  }),
  { crisisMeeting }
)(CrisisActions);
