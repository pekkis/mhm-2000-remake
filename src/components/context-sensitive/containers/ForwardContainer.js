import { connect } from "react-redux";
import Forward from "../Forward";
import { advance } from "../../../ducks/game";
import { resolveEvent } from "../../../ducks/event";
import { closeMenu } from "../../../ducks/ui";
import { saveGame, quitToMainMenu } from "../../../ducks/meta";
export default connect(
  state => ({
    turn: state.game.get("turn"),
    manager: state.manager.getIn(["managers", state.manager.get("active")]),
    managers: state.manager.get("managers"),
    teams: state.game.get("teams"),
    competitions: state.game.get("competitions"),
    events: state.event.get("events"),
    news: state.news.get("news"),
    calendar: state.game.get("calendar")
  }),
  { advance, resolveEvent, saveGame, quitToMainMenu, closeMenu }
)(Forward);
