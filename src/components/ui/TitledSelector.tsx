import React, { FunctionComponent } from "react";
import { Flex, Box } from "theme-ui";
import Button from "../form/Button";

interface Props {
  titleGetter: (obj: any) => string;
  setIndex: (index: number) => void;
  current: number;
  max: number;
  obj: any;
}

const TitledSelector: FunctionComponent<Props> = ({
  current,
  max,
  titleGetter,
  setIndex,
  obj
}) => {
  return (
    <Flex
      sx={{
        justifyContent: "center",
        alignItems: "stretch"
      }}
    >
      <Box sx={{ flex: "1 1 auto" }}>
        <Button
          block
          disabled={current === 0}
          onClick={() => setIndex(current - 1)}
        >
          -
        </Button>
      </Box>
      <Box sx={{ flex: "3 1 auto", textAlign: "center" }}>
        <h2>{titleGetter(obj)}</h2>
      </Box>
      <Box sx={{ flex: "1 1 auto" }}>
        <Button
          disabled={current === max}
          block
          onClick={() => setIndex(current + 1)}
        >
          +
        </Button>
      </Box>
    </Flex>
  );
};

export default TitledSelector;
