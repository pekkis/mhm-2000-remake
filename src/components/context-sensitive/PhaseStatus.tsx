import PhaseStatusPhase from "@/components/context-sensitive/PhaseStatusPhase";
import Games from "@/components/gameday/Games";
import LeagueTable from "@/components/league-table/LeagueTable";
import Matchups from "@/components/playoffs/Matchups";
import Stack from "@/components/ui/Stack";
import type { Manager, Team } from "@/state";
import type { Phase, PlayoffGroup } from "@/types/competitions";
import { Fragment, type FC } from "react";

type Props = {
  phase: Phase;
  manager: Manager;
  teams: Team[];
};

const PhaseStatus: FC<Props> = ({ phase, manager, teams }) => {
  return (
    <Stack>
      {phase.groups
        .filter(
          (group) =>
            phase.groups.length === 1 || group.teams.includes(manager.team!)
        )
        .map((group, i) => {
          return (
            <Fragment key={i}>
              <PhaseStatusPhase heading="Seuraavat ottelut">
                <Games
                  context={group}
                  round={group.round}
                  teams={teams}
                  managers={{ [manager.id]: manager }}
                />
              </PhaseStatusPhase>

              {phase.type === "round-robin" && (
                <PhaseStatusPhase heading="Sarjataulukko">
                  <LeagueTable
                    managers={{ [manager.id]: manager }}
                    teams={teams}
                    division={group}
                  />
                </PhaseStatusPhase>
              )}
              {phase.type === "tournament" && (
                <PhaseStatusPhase heading="Sarjataulukko">
                  <LeagueTable
                    managers={{ [manager.id]: manager }}
                    teams={teams}
                    division={group}
                  />
                </PhaseStatusPhase>
              )}

              {phase.type === "playoffs" && (
                <PhaseStatusPhase heading="Tilanteet playoff-sarjoissa">
                  <Matchups
                    managers={{ [manager.id]: manager }}
                    teams={teams}
                    group={group as PlayoffGroup}
                  />
                </PhaseStatusPhase>
              )}
            </Fragment>
          );
        })}
    </Stack>
  );
};

export default PhaseStatus;
