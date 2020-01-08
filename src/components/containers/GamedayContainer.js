import { connect } from "react-redux";
import Gameday from "../Gameday";
import { advance } from "../../ducks/game";
import { resolveEvent } from "../../ducks/event";
import { saveGame, quitToMainMenu } from "../../ducks/meta";
import { currentCalendarEntry } from "../../data/selectors";
export default connect(
  state => ({
    calendarEntry: currentCalendarEntry(state),
    manager: state.manager.getIn(["managers", state.manager.get("active")]),
    managers: state.manager.get("managers"),
    teams: state.game.get("teams"),
    competitions: state.game.get("competitions"),
    events: state.event.get("events"),
    news: state.news.get("news")
  }),
  { advance, resolveEvent, saveGame, quitToMainMenu }
)(Gameday);
