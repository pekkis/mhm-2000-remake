import { connect } from "react-redux";
import Current from "../Current";
import { advance } from "../../../ducks/game";
import { resolveEvent } from "../../../ducks/event";
import { closeMenu } from "../../../ducks/ui";
import { saveGame, quitToMainMenu } from "../../../ducks/game";
export default connect(
  state => ({
    calendar: state.game.get("calendar"),
    turn: state.game.get("turn"),
    manager: state.manager.getIn(["managers", state.manager.get("active")]),
    managers: state.manager.get("managers"),
    teams: state.game.get("teams"),
    competitions: state.game.get("competitions"),
    events: state.event.get("events"),
    news: state.news.get("news"),
    invitations: state.invitation
      .get("invitations")
      .filter(i => i.get("manager") === state.manager.get("active"))
  }),
  { advance, resolveEvent, saveGame, quitToMainMenu, closeMenu }
)(Current);
