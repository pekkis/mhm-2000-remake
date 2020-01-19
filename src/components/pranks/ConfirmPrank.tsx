import React from "react";
import ButtonContainer from "../ui/ButtonContainer";
import Button from "../form/Button";
import pranks from "../../data/pranks";

const ConfirmPrank = props => {
  const { cancel, manager, teams, prank, execute } = props;

  const prankInfo = pranks.get(prank.get("type"));

  console.log(prankInfo.toJS(), "pinfo");

  return (
    <div>
      <p>
        <strong>Jäynä: </strong>
        {prankInfo.get("name")}
      </p>

      <p>
        <strong>Uhri: </strong>
        {teams.getIn([prank.get("victim"), "name"])}
      </p>

      <ButtonContainer>
        <Button
          block
          onClick={() => {
            execute(manager.get("id"), prank.get("type"), prank.get("victim"));
          }}
        >
          Varmista
        </Button>

        <Button
          block
          secondary
          onClick={() => {
            cancel();
          }}
        >
          Peruuta
        </Button>
      </ButtonContainer>
    </div>
  );
};

export default ConfirmPrank;
