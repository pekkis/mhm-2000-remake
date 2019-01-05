import React from "react";
import Button from "../form/Button";
import pranks from "../../data/pranks";

const SelectType = props => {
  const { selectType } = props;
  return (
    <div>
      {pranks
        .map((prank, i) => {
          return (
            <Button
              block
              key={i}
              onClick={() => {
                selectType(i);
              }}
            >
              {prank.get("name")}
            </Button>
          );
        })
        .toList()}
    </div>
  );
};

export default SelectType;
