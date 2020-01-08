const Calendar = props => {
  const { calendar, turn, when, children, fallback, state } = props;

  const entry = calendar.get(turn.get("round"));

  if (when(entry, calendar, state)) {
    return children;
  }
  return fallback || null;
};

export default Calendar;
