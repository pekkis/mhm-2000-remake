import React, { FunctionComponent } from "react";
import Table from "../league-table/Table";
import ResponsiveTable from "../responsive-table/ResponsiveTable";
import Matchups from "../playoffs/Matchups";
import { List } from "immutable";
import Games from "../gameday/Games";
import Streaks from "../containers/StreaksContainer";
import {
  ForEveryCompetition,
  Competition,
  CompetitionNames,
  MapOf,
  CompetitionGroup,
  isRoundRobinCompetitionGroup,
  isTournamentCompetitionGroup,
  isPlayoffsCompetitionGroup
} from "../../types/base";
import { Team } from "../../types/team";
import { HumanManager } from "../../types/manager";
import { isCompetitionGroupOver } from "../../services/competitions";

interface Props {
  competitions: ForEveryCompetition<Competition>;
  interesting: CompetitionNames[];
  teams: MapOf<Team>;
  manager: HumanManager;
}

const Situation: FunctionComponent<Props> = props => {
  const { competitions, interesting, teams, manager } = props;

  return (
    <div>
      {interesting
        .map(i => competitions[i])
        .map((competition, key) => {
          const phaseNo = competition.phase;
          const phase = competition.phases[phaseNo];

          return (
            <div key={competition.id}>
              <h3>{competition.name}</h3>

              {/*<Streaks competition={key} team={manager.get("team")} />*/}

              {(phase.groups as CompetitionGroup[])
                .filter(
                  group =>
                    phase.groups.length === 1 ||
                    (manager.team && group.teams.includes(manager.team))
                )
                .map((group, i) => {
                  const isOver = isCompetitionGroupOver(group);

                  return (
                    <div key={i}>
                      {!isOver && (
                        <div>
                          <h4>Seuraavat ottelut</h4>

                          <Games
                            context={group}
                            round={group.round}
                            teams={teams}
                            managers={[manager]}
                          />
                        </div>
                      )}

                      <div>
                        {isRoundRobinCompetitionGroup(group) && (
                          <div>
                            <h4>Sarjataulukko</h4>
                            <ResponsiveTable>
                              <Table
                                managers={[manager]}
                                teams={teams}
                                division={group}
                              />
                            </ResponsiveTable>
                          </div>
                        )}
                        {isTournamentCompetitionGroup(group) && (
                          <div>
                            <h4>Tilanne</h4>
                            <ResponsiveTable>
                              <Table
                                managers={[manager]}
                                teams={teams}
                                division={group}
                              />
                            </ResponsiveTable>
                          </div>
                        )}

                        {isPlayoffsCompetitionGroup(group) && (
                          <div>
                            <h4>Tilanteet playoff-sarjoissa</h4>
                            <Matchups
                              managers={[manager]}
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
        })}
    </div>
  );
};

export default Situation;
