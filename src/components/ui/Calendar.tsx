import type { FC, ReactNode } from "react";
import calendar from "@/data/calendar";
import type { CalendarEntry } from "@/data/calendar";
import { useGameContext } from "@/context/game-machine-context";
import type { Competition, CompetitionId } from "@/types/competitions";

type CalendarProps = {
  when: (
    entry: CalendarEntry,
    calendar: CalendarEntry[],
    competitions: Record<CompetitionId, Competition>
  ) => boolean;
  children: ReactNode;
  fallback?: ReactNode;
};

const Calendar: FC<CalendarProps> = ({ when, children, fallback = null }) => {
  const turn = useGameContext((ctx) => ctx.turn);
  const competitions = useGameContext((ctx) => ctx.competitions);

  const entry = calendar[turn.round];

  if (when(entry, calendar, competitions)) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
};

export default Calendar;
