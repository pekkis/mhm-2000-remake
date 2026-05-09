import type { FC } from "react";
import clsx from "clsx";
import type {
  Competition,
  Phase,
  PlayoffGroup,
  MatchupStat
} from "@/types/competitions";
import type { Team, Manager } from "@/state/game";
import TeamName from "@/components/team/Name";
import * as styles from "./Bracket.css";

// --- helpers ---

/**
 * Returns all playoff phases in order, starting from the first one.
 * Non-playoff phases that may come before (regular season) are skipped.
 * Any non-playoff phases interspersed after the first are also excluded.
 */
function collectPlayoffPhases(competition: Competition): Phase[] {
  const firstIdx = competition.phases.findIndex((p) => p.type === "playoffs");
  if (firstIdx === -1) {
    return [];
  }
  return competition.phases
    .slice(firstIdx)
    .filter((p) => p.type === "playoffs");
}

// --- sub-components ---

type BracketMatchupProps = {
  homeTeam?: Team;
  awayTeam?: Team;
  homeWins: number;
  awayWins: number;
  winsToAdvance: number;
  managers: Record<string, Manager>;
};

const BracketMatchup: FC<BracketMatchupProps> = ({
  homeTeam,
  awayTeam,
  homeWins,
  awayWins,
  winsToAdvance,
  managers
}) => {
  const homeIsWinner = homeWins >= winsToAdvance;
  const awayIsWinner = awayWins >= winsToAdvance;
  const isDecided = homeIsWinner || awayIsWinner;

  return (
    <div className={styles.matchup}>
      <div
        className={clsx(
          styles.teamRow,
          isDecided &&
            (homeIsWinner ? styles.teamRowWinner : styles.teamRowEliminated)
        )}
      >
        <div className={styles.teamName}>
          {homeTeam ? <TeamName team={homeTeam} managers={managers} /> : "—"}
        </div>
        <span className={styles.teamScore}>{homeWins}</span>
      </div>
      <div
        className={clsx(
          styles.teamRow,
          isDecided &&
            (awayIsWinner ? styles.teamRowWinner : styles.teamRowEliminated)
        )}
      >
        <div className={styles.teamName}>
          {awayTeam ? <TeamName team={awayTeam} managers={managers} /> : "—"}
        </div>
        <span className={styles.teamScore}>{awayWins}</span>
      </div>
    </div>
  );
};

type BracketRoundProps = {
  phase: Phase;
  teams: Team[];
  managers: Record<string, Manager>;
};

const BracketRound: FC<BracketRoundProps> = ({ phase, teams, managers }) => {
  const matchups = phase.groups.flatMap((group) => {
    if (group.type !== "playoffs") {
      return [];
    }
    const playoffGroup = group as PlayoffGroup;
    return playoffGroup.matchups.map((matchup, idx) => {
      const stat = playoffGroup.stats[idx] as MatchupStat | undefined;
      // `matchup` entries are team IDs directly. Stats also carry IDs.
      const homeId = stat ? stat.home.id : matchup[0];
      const awayId = stat ? stat.away.id : matchup[1];
      return {
        homeTeam: teams[homeId],
        awayTeam: teams[awayId],
        homeWins: stat?.home.wins ?? 0,
        awayWins: stat?.away.wins ?? 0,
        winsToAdvance: playoffGroup.winsToAdvance
      };
    });
  });

  return (
    <div className={styles.round}>
      <div className={styles.roundHeader}>{phase.name}</div>
      <div className={styles.matchupsWrapper}>
        {matchups.map((m, idx) => (
          <BracketMatchup key={idx} {...m} managers={managers} />
        ))}
      </div>
    </div>
  );
};

// --- main export ---

type BracketProps = {
  competition: Competition;
  teams: Team[];
  managers?: Record<string, Manager>;
};

export const Bracket: FC<BracketProps> = ({
  competition,
  teams,
  managers = {}
}) => {
  const phases = collectPlayoffPhases(competition);
  if (phases.length === 0) {
    return null;
  }

  return (
    <div className={styles.bracket}>
      {phases.map((phase, idx) => (
        <BracketRound
          key={idx}
          phase={phase}
          teams={teams}
          managers={managers}
        />
      ))}
    </div>
  );
};
