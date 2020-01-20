import React, { FunctionComponent } from "react";
import Notification from "./Notification";
import { useDispatch, useSelector } from "react-redux";
import { MHMState } from "../../ducks";
import { values } from "ramda";

const Notifications: FunctionComponent = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: MHMState) => state.notification.notifications
  );

  return (
    <div
      css={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%"
      }}
    >
      {values(notifications).map(n => (
        <Notification key={n.id} dispatch={dispatch} notification={n} />
      ))}
    </div>
  );
};

export default Notifications;
