import React, { FunctionComponent } from "react";

const FixedBar: FunctionComponent = ({ children }) => {
  /*
  const manager = useSelector(activeManager);

  const turn = useSelector(currentTurn);
  const team = useSelector(requireHumanManagersTeamObj(manager.id));
  const teams = useSelector(allTeamsMap);
  const teamsMatch = useSelector(teamsMatchOfTurn(team.id, turn));
  */

  return (
    <div
      css={{
        backgroundColor: "rgb(133, 133, 133)",
        padding: "0.5em 0.5em",
        color: "rgb(255, 255, 255)",
        position: "fixed",
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 1000
      }}
    >
      {children}
    </div>
  );
};

export default FixedBar;
