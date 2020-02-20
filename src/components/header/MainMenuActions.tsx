import React from "react";
import Forward from "../fixed-bar/Forward";

const MainMenuActions = () => {
  const manager = useSelector(activeManager);
  const turn = useSelector(currentTurn);
  const team = useSelector(requireHumanManagersTeamObj(manager.id));
  const teams = useSelector(allTeamsMap);
  const teamsMatch = useSelector(teamsMatchOfTurn(team.id, turn));

  return (
    <div className="advance">
      <Forward />
    </div>
  );
};

export default MainMenuActions;
