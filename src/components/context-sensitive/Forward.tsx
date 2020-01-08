import React, { FunctionComponent } from "react";
import { MHMCalendar } from "../../types/base";
import { nth } from "ramda";

interface Props {
  calendar: MHMCalendar;
}

const Forward: FunctionComponent<Props> = props => {
  const { turn, competitions, calendar } = props;

  const calendarEntry = nth(turn.get("round"), calendar);
  if (!calendarEntry) {
    return null;
  }

  const gamedays = calendarEntry.gamedays;

  if (gamedays.length > 0) {
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

  if (calendarEntry.title) {
    return <div>{calendarEntry.title}</div>;
  }

  return <div>Eteenpäin!</div>;
};

export default Forward;
