import { connect } from "react-redux";
import Notifications from "../Notifications";
import { dismissNotification } from "../../../ducks/notification";
import { MHMState } from "../../../ducks";
import { values } from "ramda";

export default connect(
  (state: MHMState) => ({
    notifications: values(state.notification.notifications)
  }),
  { dismissNotification }
)(Notifications);
