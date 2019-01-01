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

  const myCompetitions = competitions
    .sortBy(c => c.get("weight", 0))
    .filter(c => {
      return true;
      const phase = c.getIn(["phases", c.get("phase")]);

      console.log(c.get("name"), phase.toJS());

      return phase.get("teams").includes(player.get("team"));
    });

  return (
    <div>
      {myCompetitions
        .map((competition, key) => {
          const phaseNo = competition.get("phase");
          const phase = competition.getIn(["phases", phaseNo]);

          return (
            <div key={competition}>
              <h3>{competition.get("name")}</h3>
              {phase.get("groups").map((group, i) => {
                return (
                  <div key={i}>
                    <h4>{group.get("name")}</h4>
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
