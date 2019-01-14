import calendar from "../../data/calendar";

const Calendar = props => {
  const { turn, when, children, fallback } = props;

  const entry = calendar.get(turn.get("round"));

  if (when(entry, calendar)) {
    return children;
  }
  return fallback || null;
};

export default Calendar;
