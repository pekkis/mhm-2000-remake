import { createActorRefContext } from "@/lib/createActorRefContext";
import { notificationsMachine } from "@/machines/notifications";

export const NotificationsContext = createActorRefContext(notificationsMachine);
