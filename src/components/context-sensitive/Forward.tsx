import React, { FunctionComponent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MHMState } from "../../ducks";
import {
  currentCalendarEntry,
  allMatchesOfTurn,
  currentTurn,
  activeManager,
  requireHumanManagersTeamObj,
  teamsMatchOfTurn,
  allTeamsMap,
  advanceEnabled
} from "../../services/selectors";
import Button from "../form/Button";
import { advance } from "../../ducks/game";

const Forward: FunctionComponent = () => {
  const competitions = useSelector(
    (state: MHMState) => state.competition.competitions
  );
  const dispatch = useDispatch();
  const turn = useSelector(currentTurn);
  const calendarEntry = useSelector(currentCalendarEntry);
  const manager = useSelector(activeManager);
  const team = useSelector(requireHumanManagersTeamObj(manager.id));
  const teams = useSelector(allTeamsMap);
  const isAdvanceEnabled = useSelector(advanceEnabled);

  const teamsMatch = useSelector(teamsMatchOfTurn(team.id, turn));

  console.log("YOUR MATCH", teamsMatch);

  const gamedays = calendarEntry.gamedays;

  /*
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
  */

  // return <div>{calendarEntry.title || "Eteenpäin!"}</div>;

  return (
    <div>
      {teamsMatch && <div>{JSON.stringify(teamsMatch)}</div>}

      <Button
        terse
        block
        disabled={!isAdvanceEnabled}
        onClick={() => dispatch(advance())}
      >
        <div>{calendarEntry.title || "Eteenpäin!"}</div>
      </Button>
    </div>
  );
};

export default Forward;
