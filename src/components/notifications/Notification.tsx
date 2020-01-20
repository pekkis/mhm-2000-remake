import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { MHMNotification } from "../../ducks/notification";
import { Dispatch } from "redux";
import { dismissNotification } from "../../sagas/notification";

interface Props {
  notification: MHMNotification;
  dispatch: Dispatch;
}

const Notification: FunctionComponent<Props> = ({ notification, dispatch }) => {
  return (
    <div
      onClick={() => dispatch(dismissNotification(notification.id))}
      css={{
        backgroundColor: "rgb(33, 33, 33)",
        color: "rgb(222, 222, 222)",
        padding: "1em",
        cursor: "pointer"
      }}
    >
      {notification.message}
    </div>
  );
};

export default Notification;
