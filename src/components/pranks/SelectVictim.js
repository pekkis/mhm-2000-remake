import React from "react";
import Button from "../form/Button";
import pranks from "../../data/pranks";

const SelectVictim = props => {
  const { competition, manager, selectVictim, teams, prank, cancel } = props;

  return (
    <div>
      <h3>Valitse uhrisi</h3>
      <Button secondary block onClick={cancel}>
        Peruuta jäynä
      </Button>

      {competition
        .get("teams")
        .filter(teamId => teamId !== manager.get("team"))
        .map(teamId => {
          return (
            <Button key={teamId} block onClick={() => selectVictim(teamId)}>
              {teams.get(teamId).get("name")}
            </Button>
          );
        })}
    </div>
  );
};

export default SelectVictim;
