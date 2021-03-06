import React, { FunctionComponent, ReactNode } from "react";
import {
  MHMCalendar,
  CalendarEntry,
  ForEveryCompetition,
  Competition
} from "../../types/base";
import { useSelector } from "react-redux";
import { currentCalendarEntry } from "../../services/selectors";
import { MHMState } from "../../ducks";

interface Props {
  when: (
    turn: CalendarEntry,
    calendar: MHMCalendar,
    competitions: ForEveryCompetition<Competition>
  ) => boolean;
  fallback?: ReactNode;
}

const Calendar: FunctionComponent<Props> = ({ when, children, fallback }) => {
  const calendar = useSelector((state: MHMState) => state.game.calendar);
  const entry = useSelector(currentCalendarEntry);
  const competitions = useSelector(
    (state: MHMState) => state.competition.competitions
  );

  if (when(entry, calendar, competitions)) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
};

export default Calendar;
