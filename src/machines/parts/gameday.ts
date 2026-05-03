import { entries } from "remeda";
import type { Draft } from "immer";

import type { GameContext } from "@/state";
import type { GameResult } from "@/types/competitions";
import calendar from "@/data/calendar";
import competitionData from "@/data/competitions";
import competitionTypes from "@/services/competition-type";
import { computeStats } from "@/services/competition-type";
import { gameFacts, resultFacts } from "@/services/game";
import { simulate, toGameResult } from "@/services/mhm-2000/game";
import { amount as formatAmount } from "@/services/format";
import difficultyLevels from "@/data/difficulty-levels";
import random from "@/services/random";

const emptyStreak = { win: 0, draw: 0, loss: 0, noLoss: 0, noWin: 0 } as const;
const emptyGameRecord = { win: 0, draw: 0, loss: 0 } as const;

/**
 * Per-pairing stats bookkeeping. Updates team streaks (W/D/L plus the
 * derived noWin/noLoss counters) and per-manager game records for both
 * sides of a single match. 1-1 port of `gameResultHandler` +
 * `updateFromFacts` reducer in `src/sagas/stats.ts` / `src/ducks/stats.ts`.
 *
 * Mutates `draft.stats` in place — call it from inside `runGameday`'s
 * `produce()` pass.
 */
function updateStreaks(
  draft: Draft<GameContext>,
  params: {
    competition: string;
    phase: number;
    result: GameResult;
    home: { team: number; manager: string | undefined };
    away: { team: number; manager: string | undefined };
  }
) {
  const stats = draft.stats;
  const phaseKey = params.phase.toString();

  for (const which of ["home", "away"] as const) {
    const { team, manager } = params[which];
    const facts = resultFacts(params.result, which);
    const teamKey = team.toString();

    // Team streaks.
    if (!stats.streaks.team[teamKey]) {
      stats.streaks.team[teamKey] = {};
    }
    if (!stats.streaks.team[teamKey][params.competition]) {
      stats.streaks.team[teamKey][params.competition] = { ...emptyStreak };
    }
    const s = stats.streaks.team[teamKey][params.competition];
    s.win = facts.isWin ? s.win + 1 : 0;
    s.draw = facts.isDraw ? s.draw + 1 : 0;
    s.loss = facts.isLoss ? s.loss + 1 : 0;
    s.noLoss = facts.isWin || facts.isDraw ? s.noLoss + 1 : 0;
    s.noWin = facts.isLoss || facts.isDraw ? s.noWin + 1 : 0;

    // Manager game records (only for managed teams).
    if (manager) {
      if (!stats.managers[manager]) {
        stats.managers[manager] = { games: {} };
      }
      if (!stats.managers[manager].games[params.competition]) {
        stats.managers[manager].games[params.competition] = {};
      }
      if (!stats.managers[manager].games[params.competition][phaseKey]) {
        stats.managers[manager].games[params.competition][phaseKey] = {
          ...emptyGameRecord
        };
      }
      const r = stats.managers[manager].games[params.competition][phaseKey];
      if (facts.isWin) {
        r.win += 1;
      } else if (facts.isLoss) {
        r.loss += 1;
      } else {
        r.draw += 1;
      }
    }
  }
}

/**
 * Play one round of every gameday listed in `calendar[round].gamedays`.
 *
 * Pure draft mutator — call inside `produce()` from the machine's
 * `executeGameday` entry action. Mirrors the structure of `runGala` /
 * `runWorldChampionships`: state lives in `GameContext`, this just
 * transforms it.
 *
 * Folds the legacy `gameday()` saga + its `completeGameday` helper:
 * for each group, simulate every match where `playMatch` returns true,
 * recompute stats, then run the per-manager `afterGameday`
 * bookkeeping (microphone roll → fine + announcement, plus
 * gameBalance / moraleBoost / readinessBoost), then bump the group's
 * round counter, then delegate to the competition's `groupEnd` hook
 * once the schedule is exhausted.
 *
 * Bridges to `resolveParlayBets` via `draft.betting.lastLeagueCoupon`:
 * when the PHL phase-0 group-0 round runs, the per-pairing 1/x/2 array
 * is stashed onto context. The next entry action reads it, dispatches
 * `RESOLVE` to each parlay bet actor, and clears the field.
 */
export function runGameday(draft: Draft<GameContext>): void {
  const round = draft.turn.round;
  const gamedays = calendar[round]?.gamedays ?? [];

  for (const competitionId of gamedays) {
    const comp = draft.competitions[competitionId];
    const phase = comp.phases[comp.phase];
    const ct = competitionTypes[phase.type];
    const competitionDef = competitionData[competitionId];

    for (const [groupIdx, group] of phase.groups.entries()) {
      /*
      const groupParams = competitionDef.parameters.gameday(
        comp.phase,
        groupIdx
      );
      */
      const groupRound = group.round;
      const pairings = group.schedule[groupRound];

      // 1. Play every scheduled match.
      for (let x = 0; x < pairings.length; x++) {
        if (!ct.playMatch(group, groupRound, x)) {
          continue;
        }
        const pairing = pairings[x];
        const home = draft.teams[group.teams[pairing.home]];
        const away = draft.teams[group.teams[pairing.away]];

        const homeManager = draft.managers[home.manager!];
        const awayManager = draft.managers[away.manager!];

        const result = simulate({
          home: {
            manager: homeManager,
            team: home
          },
          away: {
            manager: awayManager,
            team: away
          },

          context: {
            competition: comp,
            phase,
            group,
            round,
            matchup: x
          },

          round: {
            // TODO: use the competition types.
            type: 1
          }
        });

        /*
        const result = simulate({
          ...groupParams,
          overtime: (r) => ct.overtime(r, group, groupRound, x),
          home,
          away,
          homeManager: home.manager
            ? draft.managers[home.manager]
            : (undefined as unknown as Manager),
          awayManager: away.manager
            ? draft.managers[away.manager]
            : (undefined as unknown as Manager),
          phaseId: comp.phase,
          competitionId
        });
        */

        const legacyResult = toGameResult(result);

        pairing.result = legacyResult;

        updateStreaks(draft, {
          competition: competitionId,
          phase: comp.phase,
          result: legacyResult,
          home: { team: home.id, manager: home.manager },
          away: { team: away.id, manager: away.manager }
        });
      }

      // 2. Recompute the group's standings.
      group.stats = computeStats(group);

      // 3. Per-manager bookkeeping for the round we just played.
      //    1-1 port of `afterGameday()` in src/sagas/manager.ts.
      for (const [managerId, manager] of entries(draft.managers)) {
        if (manager.team === undefined) {
          continue;
        }

        const managersIndex = group.teams.findIndex((t) => t === manager.team);
        if (managersIndex === -1) {
          continue;
        }

        const game = group.schedule[groupRound].find(
          (p) => p.home === managersIndex || p.away === managersIndex
        );
        if (!game || !game.result) {
          continue;
        }

        if (manager.kind === "human") {
          // Microphone bust roll: PHL/division phase 0 only, 6%
          // chance → 50000 fine + 4-point penalty (in the league
          // group, hard-coded to phase 0 group 0).
          if (
            manager.services.microphone &&
            (competitionId === "phl" || competitionId === "division") &&
            comp.phase === 0
          ) {
            if (random.bool(0.06)) {
              const fine = 50000;
              const pointDeduction = -4;
              manager.balance -= fine;
              // Inline the penalty (port of `incurPenalty` saga +
              // `teamIncurPenalty` reducer): only applies to
              // round-robin groups, which the league always is.
              const leagueGroup =
                draft.competitions[competitionId].phases[0].groups[0];
              if (leagueGroup.type === "round-robin") {
                leagueGroup.penalties.push({
                  team: manager.team!,
                  penalty: pointDeduction
                });
                leagueGroup.stats = computeStats(leagueGroup);
              }
              if (!draft.news.announcements[managerId]) {
                draft.news.announcements[managerId] = [];
              }
              draft.news.announcements[managerId].push(
                `"Salainen" mikrofonisi vastustajan vaihtoaitiossa on paljastunut. Teidät tuomitaan __${formatAmount(
                  fine
                )}__ pekan sakkoihin ja __${pointDeduction}__ pisteen menetykseen.`
              );
            }
          }
        }

        const facts = gameFacts(game, managersIndex);
        const team = draft.teams[manager.team!];

        const moraleDelta = competitionDef.moraleBoost(
          comp.phase,
          facts,
          manager
        );
        const readinessDelta = competitionDef.readinessBoost(
          comp.phase,
          facts,
          manager
        );

        if (manager.kind === "human") {
          const balanceDelta = competitionDef.gameBalance(
            comp.phase,
            facts,
            manager
          );

          if (balanceDelta) {
            manager.balance += balanceDelta;
          }
        }
        if (readinessDelta) {
          team.readiness += readinessDelta;
        }

        if (moraleDelta) {
          // Morale clamp uses the team's manager's difficulty
          // (defaults to 2 / Pasolini-mode for unmanaged teams).
          const diffIdx = manager.difficulty;
          const min = difficultyLevels[diffIdx].moraleMin;
          const max = difficultyLevels[diffIdx].moraleMax;
          team.morale = Math.min(max, Math.max(min, team.morale + moraleDelta));
        }
      }

      // 4. Capture parlay correct coupon — PHL phase 0 group 0
      //    only. Stashed on context so the follow-up entry action
      //    (`resolveParlayBets`) can dispatch `RESOLVE { correctCoupon }`
      //    to each parlay bet actor; each computes its payout and emits
      //    `BET_RESOLVED { effects }` which the root handler interprets.
      if (competitionId === "phl" && comp.phase === 0 && groupIdx === 0) {
        draft.betting.lastLeagueCoupon = pairings.map((p) => {
          const f = resultFacts(p.result!, "home");
          if (f.isWin) {
            return "1";
          }
          if (f.isDraw) {
            return "x";
          }
          return "2";
        });
      }

      // 5. Advance the group's round counter.
      group.round += 1;

      // 6. groupEnd — when the schedule is exhausted, delegate to
      //    the competition's own end-of-group hook (no-op default).
      //    EHL hands out medalist awards (final phase only);
      //    tournaments disburse the per-tournament prize.
      //    PHL/division omit the hook.
      if (group.round === group.schedule.length) {
        competitionDef.groupEnd?.(draft, {
          phase: comp.phase,
          groupIdx,
          group
        });
      }
    }
  }
}
