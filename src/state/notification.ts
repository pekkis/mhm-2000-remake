export type Notification = {
  id: string;
  manager: string;
  message: string;
  type: string;
};

export type NotificationState = {
  notifications: Notification[];
};
