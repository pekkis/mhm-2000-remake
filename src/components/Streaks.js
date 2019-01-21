import React from "react";
import { Map } from "immutable";
import Box from "./styled-system/Box";

const humanReadables = Map([
  ["loss", "tappiota"],
  ["noWin", "voitotonta ottelua"],
  ["noLoss", "tappiotonta ottelua"],
  ["win", "voittoa"]
]);

const Streaks = props => {
  const { competition, team, streaks } = props;

  const teamStreaks = streaks
    .getIn([team.toString(), competition], Map())
    .filter(s => s > 1);

  if (teamStreaks.count() === 0) {
    return null;
  }

  return (
    <Box my={1}>
      <h4>Putket</h4>
      {teamStreaks
        .filter(s => s > 1)
        .map((s, index) => {
          return (
            <div key={index}>
              <strong>{s}</strong> {humanReadables.get(index)} putkeen.
            </div>
          );
        })
        .toList()}
    </Box>
  );
};

export default Streaks;
