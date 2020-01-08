import React from "react";
import { List } from "immutable";

const Forward = props => {
  const { turn, competitions, calendar } = props;

  const calendarEntry = calendar.get(turn.get("round"));

  const gamedays = calendarEntry.get("gamedays", List());

  if (gamedays.count() > 0) {
    return (
      <div>
        Pelipäivä (
        {gamedays
          .map(gd => competitions.get(gd))
          .map(c => c.get("abbr"))
          .join(", ")}
        )
      </div>
    );
  }

  if (calendarEntry.get("title")) {
    return <div>{calendarEntry.get("title")}</div>;
  }

  return <div>Eteenpäin!</div>;
};

export default Forward;
