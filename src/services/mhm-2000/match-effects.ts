import type { EventEffect } from "@/game/event-effects";
import competitionTypes from "@/services/competition-type";
import type { MatchResult } from "@/services/mhm-2000/simulate-match";

/**
 * Translate a pure `MatchResult` into game-engine `EventEffect`s.
 *
 * Currently handles:
 *
 *   - **Morale deltas** — winner +1, loser −1, tie 0. Mirrors the
 *     `morttivertti:` block at [ILEX5.BAS:3929-3938]. Gated by
 *     `doesAffectMorale()` on the competition type: tournament matches
 *     (`turnauz <> 0` in QB) skip this — morale still *affects* match
 *     strength via etu, but tournament results don't *change* it.
 *     `SUB mor` clamps the final value to [−10, +10]; that clamping
 *     lives in the effect interpreter, not here.
 */
export const generateEffectsFromMatchResult = (
  result: MatchResult
): EventEffect[] => {
  const effects: EventEffect[] = [];

  // TODO: add effective intensity based player condition effect.

  if (competitionTypes[result.context.group.type].doesAffectMorale()) {
    let homeMoraleChange = 0;
    let awayMoraleChange = 0;
    if (result.homeGoals > result.awayGoals) {
      homeMoraleChange = 1;
      awayMoraleChange = -1;
    } else if (result.awayGoals > result.homeGoals) {
      homeMoraleChange = -1;
      awayMoraleChange = 1;
    }

    effects.push(
      {
        type: "incrementMorale",
        team: result.home.team.id,
        amount: homeMoraleChange
      },
      {
        type: "incrementMorale",
        team: result.away.team.id,
        amount: awayMoraleChange
      }
    );
  }

  return effects;
};
