import React, { FunctionComponent } from "react";
import Notification from "./Notification";
import {
  MHMNotification,
  dismissNotification,
  NotificationDismissAction
} from "../../ducks/notification";

interface Props {
  notifications: MHMNotification[];
  dismissNotification: (id: string) => NotificationDismissAction;
}

const Notifications: FunctionComponent<Props> = props => {
  const { notifications, dismissNotification } = props;

  return (
    <div
      css={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%"
      }}
    >
      {notifications.map(n => (
        <Notification
          key={n.id}
          dismiss={dismissNotification}
          notification={n}
        />
      ))}
    </div>
  );
};

export default Notifications;
