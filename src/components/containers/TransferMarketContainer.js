import { connect } from "react-redux";
import TransferMarket from "../TransferMarket";
import { buyPlayer, sellPlayer } from "../../ducks/manager";

export default connect(
  state => ({
    manager: state.manager.getIn(["managers", state.manager.get("active")]),
    teams: state.game.get("teams")
  }),
  { buyPlayer, sellPlayer }
)(TransferMarket);
