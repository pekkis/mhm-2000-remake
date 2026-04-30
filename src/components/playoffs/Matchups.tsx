import type { FC } from "react";
import type { Team } from "@/state/game";
import type { Manager } from "@/state/manager";
import type { PlayoffGroup, MatchupStat } from "@/types/competitions";
import { Table } from "@/components/ui/Table";
import MatchRow from "@/components/team/MatchRow";

type MatchupsProps = {
  managers: Record<string, Manager>;
  teams: Team[];
  group: PlayoffGroup;
};

const Matchups: FC<MatchupsProps> = ({ teams, group, managers }) => {
  const matches = group.stats as MatchupStat[];

  return (
    <Table>
      <tbody>
        {matches.map((m, i) => (
          <MatchRow
            key={i}
            home={teams[m.home.id]}
            away={teams[m.away.id]}
            score={`${m.home.wins}–${m.away.wins}`}
            managers={managers}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default Matchups;
