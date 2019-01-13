import React from "react";
import Table from "../league-table/Table";
import Matchups from "../playoffs/Matchups";
import { List } from "immutable";
import Games from "../gameday/Games";

const Situation = props => {
  const { competitions, interesting, teams, manager } = props;

  return (
    <div>
      {interesting
        .map(i => competitions.get(i))
        .map((competition, key) => {
          const phaseNo = competition.get("phase");
          const phase = competition.getIn(["phases", phaseNo]);

          return (
            <div key={competition}>
              <h3>{competition.get("name")}</h3>

              {phase
                .get("groups")
                .filter(
                  group =>
                    phase.get("groups").count() === 1 ||
                    group.get("teams").includes(manager.get("team"))
                )
                .map((group, i) => {
                  return (
                    <div key={i}>
                      <div>
                        <h4>Seuraavat ottelut</h4>

                        <Games
                          context={group}
                          round={group.get("round")}
                          teams={teams}
                          managers={List.of(manager)}
                        />
                      </div>

                      <div>
                        {phase.get("type") === "round-robin" && (
                          <div>
                            <h4>Sarjataulukko</h4>
                            <Table
                              managers={List.of(manager)}
                              teams={teams}
                              division={group}
                            />
                          </div>
                        )}
                        {phase.get("type") === "tournament" && (
                          <div>
                            <h4>Tilanne</h4>
                            <Table
                              managers={List.of(manager)}
                              teams={teams}
                              division={group}
                            />
                          </div>
                        )}

                        {phase.get("type") === "playoffs" && (
                          <div>
                            <h4>Tilanteet playoff-sarjoissa</h4>
                            <Matchups
                              managers={List.of(manager)}
                              teams={teams}
                              group={group}
                            />
                          </div>
                        )}
                      </div>
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
