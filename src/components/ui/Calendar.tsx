import React, { FunctionComponent, ReactNode } from "react";
import { MHMCalendar, MHMTurnDefinition } from "../../types/base";
import { nth } from "ramda";

interface Props {
  state: any;
  calendar: MHMCalendar;
  when: (turn: MHMTurnDefinition, calendar: MHMCalendar, state: any) => boolean;
  turn: unknown;
  fallback?: ReactNode;
}

const Calendar: FunctionComponent<Props> = props => {
  const { calendar, turn, when, children, fallback, state } = props;
  const entry = nth(turn.get("round"), calendar);
  if (!entry) {
    throw new Error("Invalid calendar entry");
  }

  if (when(entry, calendar, state)) {
    return <>children</>;
  }

  return fallback ? <>{fallback}</> : null;
};

export default Calendar;
