import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { MHMState } from "../../ducks";
import { currentCalendarEntry } from "../../data/selectors";

const Forward: FunctionComponent = () => {
  const competitions = useSelector(
    (state: MHMState) => state.competition.competitions
  );
  const calendarEntry = useSelector(currentCalendarEntry);

  const gamedays = calendarEntry.gamedays;

  if (gamedays.length > 0) {
    return (
      <div>
        Pelipäivä (
        {gamedays
          .map(gd => competitions[gd])
          .map(c => c.abbr)
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
