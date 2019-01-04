import { connect } from "react-redux";
import Notifications from "../Notifications";
import { dismissNotification } from "../../../ducks/notification";

export default connect(
  state => ({
    manager: state.manager.getIn(["managers", state.manager.get("active")]),
    notifications: state.notification.get("notifications")
  }),
  { dismissNotification }
)(Notifications);
