import React from "react";

const PrimaryButton = ({ children }) => {
  return (
    <div
      css={{
        alignSelf: "flex-end",
        textAlign: "right",
        flexGrow: 3,
        paddingLeft: "0.5em"
      }}
    >
      {children}
    </div>
  );
};

export default PrimaryButton;
