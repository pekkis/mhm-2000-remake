import React from "react";
import Table from "../league-table/Table";
import Matchups from "../playoffs/Matchups";
import { List } from "immutable";

/*


              {phase.get("type") === "round-robin" && (
                <div>
                      <Table
                        players={List.of(player)}
                        teams={teams}
                        division={division}
                      />
                </div>
              )}

              */

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
              {phase.get("groups").map((group, i) => {
                return (
                  <div key={i}>
                    <h3>{key}</h3>
                    {phase.get("type") === "round-robin" && (
                      <div>
                        <Table
                          players={List.of(player)}
                          teams={teams}
                          division={group}
                        />
                      </div>
                    )}
                    {phase.get("type") === "playoffs" && (
                      <Matchups
                        players={List.of(player)}
                        teams={teams}
                        group={group}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })
        .toList()}
    </div>
  );
};

export default Situation;
