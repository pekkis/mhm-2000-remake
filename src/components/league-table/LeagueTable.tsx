import type { FC } from "react";
import clsx from "clsx";
import { values } from "remeda";
import { Table, Td, Th } from "@/components/ui/Table";
import * as styles from "./LeagueTable.css";

import type { Team } from "@/state/game";
import type { Manager } from "@/state/game";
import type { Group, TeamStat } from "@/types/competitions";

type TableProps = {
  managers: Record<string, Manager>;
  teams: Team[];
  division: Group;
};

const LeagueTable: FC<TableProps> = ({ managers, teams, division }) => {
  const colors = "colors" in division ? (division.colors as string[]) : [];
  const managerTeams = values(managers).map((m) => m.team);
  const rows = (division.stats as TeamStat[]).map((entry) => ({
    ...entry,
    managerControlled: managerTeams.includes(entry.id)
  }));

  return (
    <Table maxInlineSize="600px">
      <thead>
        <tr>
          <Th sticky="inline-start">Joukkue</Th>
          <Th align="end">O</Th>
          <Th align="end">V</Th>
          <Th align="end">TP</Th>
          <Th align="end">H</Th>
          <Th align="end">TM</Th>
          <Th align="end">PM</Th>
          <Th sticky="inline-end" align="end">
            P
          </Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((t, i) => {
          const tone = colors[i] === "d" ? "dark" : "light";
          return (
            <tr
              key={t.id}
              className={clsx(
                styles.row[tone],
                t.managerControlled && styles.managerRow
              )}
            >
              <Td sticky="inline-start">{teams[t.id]?.name}</Td>
              <Td align="end">{t.gamesPlayed}</Td>
              <Td align="end">{t.wins}</Td>
              <Td align="end">{t.draws}</Td>
              <Td align="end">{t.losses}</Td>
              <Td align="end">{t.goalsFor}</Td>
              <Td align="end">{t.goalsAgainst}</Td>
              <Td sticky="inline-end" align="end" className={styles.points}>
                {t.points}
              </Td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default LeagueTable;
