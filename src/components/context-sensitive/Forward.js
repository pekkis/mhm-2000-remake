import React from "react";
import calendar from "../../data/calendar";
import { List } from "immutable";

const Forward = props => {
  const { turn, competitions } = props;

  const calendarEntry = calendar.get(turn.get("round"));

  const gamedays = calendarEntry.get("gamedays", List());

  if (gamedays.count() > 0) {
    return (
      <span>
        Pelipäivä (
        {gamedays
          .map(gd => competitions.get(gd))
          .map(c => c.get("name"))
          .join(", ")}
        )
      </span>
    );
  }

  if (calendarEntry.get("title")) {
    return <span>{calendarEntry.get("title")}</span>;
  }

  return <span>Eteenpäin!</span>;
};

export default Forward;
