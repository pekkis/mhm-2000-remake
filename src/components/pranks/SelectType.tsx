import React from "react";
import Button from "../form/Button";
import ButtonContainer from "../ui/ButtonContainer";
import pranks from "../../services/data/pranks";
import { currency as c } from "../../services/format";

const SelectType = props => {
  const { manager, selectType, competition, enabled } = props;
  return (
    <div>
      <ButtonContainer>
        {pranks
          .map((prank, i) => {
            const price = prank.get("price")(competition);

            return (
              <Button
                disabled={!enabled || price > manager.get("balance")}
                block
                key={i}
                onClick={() => {
                  selectType(i);
                }}
              >
                <div>{prank.get("name")}</div>
                <div>
                  <small>{c(price)}</small>
                </div>
              </Button>
            );
          })
          .toList()}
      </ButtonContainer>
    </div>
  );
};

export default SelectType;
