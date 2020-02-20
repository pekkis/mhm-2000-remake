import React from "react";
import Button from "../form/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { toggleMenu } from "../../ducks/ui";

const MenuButton = () => {
  const dispatch = useDispatch();

  return (
    <div css={{}}>
      <Button secondary onClick={() => dispatch(toggleMenu())}>
        <FontAwesomeIcon icon={["fas", "bars"]} />
      </Button>
    </div>
  );
};

export default MenuButton;
