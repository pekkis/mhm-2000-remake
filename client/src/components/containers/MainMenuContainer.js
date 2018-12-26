import { connect } from "react-redux";
import MainMenu from "../MainMenu";
import { advance } from "../../ducks/game";
import { resolveEvent } from "../../ducks/event";
import { saveGame } from "../../ducks/meta";
export default connect(
  state => ({
    turn: state.game.get("turn"),
    player: state.player.getIn(["players", state.player.get("active")]),
    players: state.player.get("players"),
    teams: state.game.get("teams"),
    competitions: state.game.get("competitions"),
    events: state.event.get("events")
  }),
  { advance, resolveEvent, saveGame }
)(MainMenu);
