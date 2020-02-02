/*
Aligner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.Aligner-item {
  max-width: 50%;
}

.Aligner-item--top {
  align-self: flex-start;
}

.Aligner-item--bottom {
  align-self: flex-end;
}
*/

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoadingScreen = () => {
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw"
      }}
    >
      <div
        css={{
          textAlign: "center"
        }}
      >
        <div
          css={{
            fontSize: "5rem"
          }}
        >
          <FontAwesomeIcon pulse icon={["fa", "spinner"]} />
        </div>
        <div>Odota hetkinen!</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
