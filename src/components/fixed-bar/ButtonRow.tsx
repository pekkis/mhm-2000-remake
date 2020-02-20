import React from "react";

const ButtonRow = ({ children }) => {
  return (
    <div
      css={{
        display: "flex",
        flexBasis: "100%"
      }}
    >
      {children}
    </div>
  );
};

export default ButtonRow;
