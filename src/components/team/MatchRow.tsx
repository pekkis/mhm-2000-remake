import type { FC } from "react";
import type { Team } from "@/state/game";
import type { Manager } from "@/state/manager";
import { Td } from "@/components/ui/Table";
import TeamName from "@/components/team/Name";
import * as styles from "./MatchRow.css";

type MatchRowProps = {
  home?: Team;
  away?: Team;
  score?: string;
  managers?: Record<string, Manager>;
  // When true, the score cell always reserves room for a 2-digit score.
  // Use this for views where some rows have results and others don't —
  // stops the dash column from sliding around between rounds.
  reserveScore?: boolean;
};

const MatchRow: FC<MatchRowProps> = ({
  home,
  away,
  score,
  managers,
  reserveScore
}) => (
  <tr>
    <Td align="end" className={styles.halfColumn}>
      {home ? <TeamName team={home} managers={managers} /> : null}
    </Td>
    <Td align="center">–</Td>
    <Td align="start" className={styles.halfColumn}>
      {away ? <TeamName team={away} managers={managers} /> : null}
    </Td>
    {(score ?? reserveScore) ? (
      <Td>
        <span className={styles.scoreSlot}>{score ?? "\u00a0"}</span>
      </Td>
    ) : null}
  </tr>
);

export default MatchRow;
