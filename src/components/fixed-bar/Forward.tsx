import React, { FunctionComponent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MHMState } from "../../ducks";
import { currentCalendarEntry, advanceEnabled } from "../../services/selectors";
import Button from "../form/Button";
import { advance } from "../../ducks/game";

const ButtonContent = () => {
  const calendarEntry = useSelector(currentCalendarEntry);
  const gamedays = calendarEntry.gamedays;
  const competitions = useSelector(
    (state: MHMState) => state.competition.competitions
  );

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

  return <div>{calendarEntry.title || "Eteenpäin!"}</div>;
};

const Forward: FunctionComponent = () => {
  const dispatch = useDispatch();
  const isAdvanceEnabled = useSelector(advanceEnabled);

  return (
    <Button
      block
      terse
      disabled={!isAdvanceEnabled}
      onClick={() => {
        dispatch(advance());
      }}
    >
      <ButtonContent />
    </Button>
  );
};

export default Forward;
