import React from "react";
import Table from "../league-table/Table";
import Matchups from "../playoffs/Matchups";
import { List } from "immutable";

const Situation = props => {
  const { competitions, teams, player } = props;

  return (
    <div>
      {competitions
        .map((competition, key) => {
          const phaseNo = competition.get("phase");
          const phase = competition.getIn(["phases", phaseNo]);

          return (
            <div key={competition}>
              <h3>{key}</h3>
              {phase.get("type") === "round-robin" && (
                <Table
                  players={List.of(player)}
                  competition={competition}
                  teams={teams}
                  phase={phaseNo}
                />
              )}
              {phase.get("type") === "playoffs" && (
                <Matchups
                  players={List.of(player)}
                  competition={competition}
                  teams={teams}
                  phase={phaseNo}
                />
              )}
            </div>
          );
        })
        .toList()}
    </div>
  );
};

export default Situation;
