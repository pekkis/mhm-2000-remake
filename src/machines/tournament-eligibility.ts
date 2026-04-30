import type { TeamStat, CompetitionId } from "@/types/competitions";
import type { GameContext } from "@/state/game-context";
import { managersMainCompetition, managersTeamId } from "@/machines/selectors";

/**
 * Pure port of the legacy `isInvitedToTournament` saga.
 *
 * A manager is invited to a tournament if their *main* competition
 * (PHL or division) matches the tournament's eligibility competition
 * AND their team's ranking in that competition's first phase / first
 * group is at or below the tournament's `maxRanking`.
 *
 * Reads from `GameContext` directly — no Redux, no generators.
 */
export function isInvitedToTournament(
  ctx: GameContext,
  competitionId: CompetitionId,
  maxRanking: number,
  manager: string
): boolean {
  const mainCompetition = managersMainCompetition(manager)(ctx);
  if (mainCompetition !== competitionId) {
    return false;
  }

  const teamId = managersTeamId(manager)(ctx);
  const stats = ctx.competitions[mainCompetition].phases[0].groups[0]
    .stats as TeamStat[];
  const ranking = stats.findIndex((stat) => stat.id === teamId);
  return ranking <= maxRanking;
}
