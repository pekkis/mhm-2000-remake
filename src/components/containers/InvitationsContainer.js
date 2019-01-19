import { connect } from "react-redux";
import Invitations from "../Invitations";
import { acceptInvitation } from "../../ducks/invitation";
export default connect(
  state => ({
    manager: state.manager.getIn(["managers", state.manager.get("active")]),
    invitations: state.invitation
      .get("invitations")
      .filter(i => i.get("manager") === state.manager.get("active"))
  }),
  { acceptInvitation }
)(Invitations);
