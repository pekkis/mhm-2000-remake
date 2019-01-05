import { connect } from "react-redux";
import Services from "../Services";
import { toggleService } from "../../ducks/manager";

export default connect(
  state => ({
    manager: state.manager.getIn(["managers", state.manager.get("active")]),
    teams: state.game.get("teams"),
    basePrices: state.game.get("serviceBasePrices")
  }),
  { toggleService }
)(Services);
