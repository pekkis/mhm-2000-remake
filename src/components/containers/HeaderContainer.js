import { connect } from "react-redux";
import Header from "../Header";
import { advance } from "../../ducks/game";
import { withRouter } from "react-router";

export default withRouter(
  connect(
    state => ({
      manager: state.manager.getIn(["managers", state.manager.get("active")]),
      advanceEnabled: state.ui.get("advanceEnabled")
    }),
    { advance }
  )(Header)
);
