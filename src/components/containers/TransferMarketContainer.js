import { connect } from "react-redux";
import TransferMarket from "../TransferMarket";
import { buyPlayer, sellPlayer } from "../../ducks/manager";
import { selectTab } from "../../ducks/ui";

export default connect(
  state => ({
    manager: state.manager.getIn(["managers", state.manager.get("active")]),
    teams: state.game.get("teams"),
    tab: state.ui.getIn(["tabs", "transferMarket"])
  }),
  { buyPlayer, sellPlayer, selectTab }
)(TransferMarket);
