import React from "react";
import Button from "../form/Button";
import pranks from "../../data/pranks";

const ConfirmPrank = props => {
  const { competition, manager, selectVictim, teams, prank, execute } = props;

  const prankInfo = pranks.get(prank.get("type"));

  return (
    <div>
      <Button
        block
        onClick={() => {
          execute(manager.get("id"), prank.get("type"), prank.get("victim"));
        }}
      >
        Varmista
      </Button>
    </div>
  );
};

export default ConfirmPrank;
