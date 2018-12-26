import { connect } from "react-redux";
import TransferMarket from "../TransferMarket";
import { buyPlayer, sellPlayer } from "../../ducks/player";

export default connect(
  state => ({
    player: state.player.getIn(["players", state.player.get("active")]),
    teams: state.game.get("teams")
  }),
  { buyPlayer, sellPlayer }
)(TransferMarket);
