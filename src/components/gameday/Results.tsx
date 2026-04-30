import type { FC } from "react";
import { Table } from "@/components/ui/Table";
import MatchRow from "@/components/team/MatchRow";
import type { Team } from "@/state/game";
import type { Manager } from "@/state/manager";
import type { Group } from "@/types/competitions";

type ResultsProps = {
  teams: Team[];
  context: Group;
  round: number;
  managers: Record<string, Manager>;
};

const Results: FC<ResultsProps> = ({ teams, context, round, managers }) => {
  const pairings = (context.schedule[round] ?? []).filter((p) => {
    return p.result;
  });

  return (
    <Table>
      <tbody>
        {pairings.map((pairing, i) => (
          <MatchRow
            key={i}
            home={teams[context.teams[pairing.home]]}
            away={teams[context.teams[pairing.away]]}
            score={
              pairing.result
                ? `${pairing.result.home}–${pairing.result.away}`
                : undefined
            }
            managers={managers}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default Results;
