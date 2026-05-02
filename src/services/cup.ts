import type { CupGroup, CupMatchupStat, Pairing } from "@/types/competitions";

/**
 * Compute aggregate-goal stats for every matchup in a cup group.
 *
 * Each matchup is two legs (each team hosts once). The stat tracks
 * cumulative goals for matchup-team-A (`home` here, = `matchups[i][0]`)
 * and matchup-team-B (`away` here, = `matchups[i][1]`) across both
 * legs, accounting for the leg-2 swap.
 *
 * `decided` is `true` once both legs have been played (which is
 * guaranteed to break aggregate ties: leg 2 goes to sudden-death
 * overtime if the aggregate would otherwise be even \u2014 see
 * `competitionTypes.cup.overtime`).
 */
export const cupMatchups = (group: CupGroup): CupMatchupStat[] => {
  return group.matchups.map((matchup, i) => {
    const [teamAIdx, teamBIdx] = matchup;

    let goalsA = 0;
    let goalsB = 0;
    let played = 0;

    for (const round of group.schedule) {
      const game = round[i];
      if (!game || !game.result) continue;
      played += 1;
      // matchup-team-A is the home team in leg 1, away team in leg 2.
      if (game.home === teamAIdx) {
        goalsA += game.result.home;
        goalsB += game.result.away;
      } else {
        goalsA += game.result.away;
        goalsB += game.result.home;
      }
    }

    const decided = played === group.schedule.length && goalsA !== goalsB;

    return {
      home: { index: teamAIdx, id: group.teams[teamAIdx], goals: goalsA },
      away: { index: teamBIdx, id: group.teams[teamBIdx], goals: goalsB },
      decided,
      victor: !decided ? undefined : goalsA > goalsB ? "home" : "away"
    } satisfies CupMatchupStat;
  });
};

/** Team ids of the matchup victors. Order matches `group.matchups`. */
export const cupVictors = (group: CupGroup): number[] =>
  cupMatchups(group)
    .filter((m) => m.decided)
    .map((m) => (m.victor === "home" ? m.home.id : m.away.id));

/**
 * Build a 2-leg schedule: leg 1 each team in `matchups[i][0]` hosts;
 * leg 2 swaps. `matchups[i]` indexes into `group.teams`.
 */
export const cupScheduler = (matchups: [number, number][]): Pairing[][] => [
  matchups.map(([a, b]) => ({ home: a, away: b })),
  matchups.map(([a, b]) => ({ home: b, away: a }))
];

/**
 * Pair off `[0..n)` into adjacent matchups. Caller is expected to
 * have already shuffled the team list \u2014 cup pairings are random per
 * MHM 2000.
 */
export const cupPairs = (count: number): [number, number][] => {
  const out: [number, number][] = [];
  for (let i = 0; i + 1 < count; i += 2) {
    out.push([i, i + 1]);
  }
  return out;
};

export default cupScheduler;
