import { connect } from "react-redux";
import Events from "../Events";
import { advance } from "../../ducks/game";
import { resolveEvent } from "../../ducks/event";
export default connect(
  state => ({
    turn: state.game.get("turn"),
    player: state.player.getIn(["players", state.player.get("active")]),
    players: state.player.get("players"),
    teams: state.game.get("teams"),
    events: state.event.get("events"),
    news: state.news.get("news"),
    advanceEnabled: state.ui.get("advanceEnabled")
  }),
  { advance, resolveEvent }
)(Events);
