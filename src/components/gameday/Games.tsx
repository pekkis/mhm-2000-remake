import type { FC } from "react";
import competitionTypes from "@/services/competition-type";
import { Table } from "@/components/ui/Table";
import MatchRow from "@/components/team/MatchRow";
import type { Team } from "@/state/game";
import type { Manager } from "@/state/game";
import type { Group } from "@/types/competitions";

type GamesProps = {
  teams: Team[];
  context: Group;
  round: number;
  managers: Record<string, Manager>;
};

const Games: FC<GamesProps> = ({ teams, context, round, managers }) => {
  const playMatch = competitionTypes[context.type].playMatch;
  const pairings = (context.schedule[round] ?? []).filter((_p, i) => {
    return playMatch(context, round, i);
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
            reserveScore
            managers={managers}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default Games;
