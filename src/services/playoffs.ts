import type {
  MatchupStat,
  MatchupTeamStat,
  Pairing,
  PlayoffGroup
} from "@/types/competitions";
import { gameFacts } from "./game";

export const victors = (phase: PlayoffGroup): MatchupTeamStat[] => {
  const winsToAdvance = phase.winsToAdvance;
  const all = phase.stats.flatMap((m) => [m.home, m.away]);
  return all
    .filter((m) => m.wins === winsToAdvance)
    .sort((a, b) => a.index - b.index);
};

export const eliminated = (phase: PlayoffGroup): MatchupTeamStat[] => {
  const winsToAdvance = phase.winsToAdvance;
  const all = phase.stats.flatMap((m) => [m.home, m.away]);
  return all
    .filter((m) => m.losses === winsToAdvance)
    .sort((a, b) => a.index - b.index);
};

export const matchups = (phase: PlayoffGroup): MatchupStat[] => {
  const teams = phase.teams;

  return phase.matchups.map((matchup) => {
    const [home, away] = ([0, 1] as const).map((index) => {
      const teamId = matchup[index];

      const games: Pairing[] = phase.schedule
        .map((pairings) =>
          pairings.find((p) => p.home === teamId || p.away === teamId)
        )
        .filter((g): g is Pairing => g !== undefined)
        .filter((g) => g.result !== undefined);

      const facts = games.map((g) => gameFacts(g, teamId));

      return {
        index: teams.indexOf(teamId),
        id: teamId,
        wins: facts.filter((f) => f.isWin).length,
        losses: facts.filter((f) => f.isLoss).length
      } satisfies MatchupTeamStat;
    });

    return { home, away } satisfies MatchupStat;
  });
};

const scheduler = (
  matchupList: [number, number][],
  winsToAdvance: number
): Pairing[][] => {
  const rounds: Pairing[][] = [];
  for (let r = 1; r < winsToAdvance * 2; r++) {
    const round = matchupList.map((matchup) => {
      if (r % 2 !== 0) {
        return { home: matchup[0], away: matchup[1] };
      }
      return { home: matchup[1], away: matchup[0] };
    });
    rounds.push(round);
  }
  return rounds;
};

export default scheduler;
