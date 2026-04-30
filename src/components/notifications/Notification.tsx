import type { FC } from "react";
import { useSelector } from "@xstate/react";
import * as styles from "./Notification.css";
import type { NotificationActorRef } from "@/machines/notifications";

type NotificationProps = {
  actorRef: NotificationActorRef;
  dismiss: (id: string) => void;
};

const Notification: FC<NotificationProps> = ({ actorRef, dismiss }) => {
  const notification = useSelector(actorRef, (s) => s.context);

  return (
    <div
      onClick={() => dismiss(notification.id)}
      className={styles.notification}
    >
      {notification.message}
    </div>
  );
};

export default Notification;
