import { connect } from "react-redux";
import GamedayResults from "../GamedayResults";
import { advance } from "../../ducks/game";
import { resolveEvent } from "../../ducks/event";
import { saveGame, quitToMainMenu } from "../../ducks/meta";
export default connect(
  state => ({
    turn: state.game.get("turn"),
    player: state.player.getIn(["players", state.player.get("active")]),
    players: state.player.get("players"),
    teams: state.game.get("teams"),
    competitions: state.game.get("competitions"),
    events: state.event.get("events"),
    news: state.news.get("news")
  }),
  { advance, resolveEvent, saveGame, quitToMainMenu }
)(GamedayResults);
