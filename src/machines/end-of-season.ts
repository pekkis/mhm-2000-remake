/**
 * End-of-season pure draft mutators.
 *
 * Replaces the legacy `endOfSeasonPhase` saga + `awards.ts` saga +
 * `createSeasonStories` from `sagas/stats.ts` + the `promote`/`relegate` /
 * `seasonEnd` reducer chain. All randomness rolls happen during these
 * `entry` actions and snapshots into context, so save/load survives mid-flow.
 *
 * Saga side is REFERENCE-ONLY post-pivot.
 */

import { cinteger, type RandomService } from "@/services/random";
import type { GameContext } from "@/state";
import type { WorldChampionshipEntry } from "@/state/game";
import type {
  CompetitionId,
  Phase,
  PlayoffGroup,
  RoundRobinGroup,
  TeamStat
} from "@/types/competitions";
import { type Draft } from "immer";

import competitionData from "@/data/competitions";
import { initialBudgetForRankings } from "@/data/mhm2000/budget";
import { managersMainCompetition } from "@/machines/selectors";
import { sortStats } from "@/services/league";
import { eliminated, victors } from "@/services/playoffs";
import { difference, takeLast, values } from "remeda";
import type { Random } from "random-js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ensureCurrentSeason = (draft: Draft<GameContext>): void => {
  if (!draft.stats.currentSeason) {
    draft.stats.currentSeason = {
      ehlChampion: undefined,
      presidentsTrophy: undefined,
      medalists: undefined,
      worldChampionships: undefined,
      promoted: {
        division: [],
        mutasarja: []
      },
      relegated: {
        phl: [],
        division: []
      },
      stories: {}
    };
  }
};

// ---------------------------------------------------------------------------
// 1. World championships
// ---------------------------------------------------------------------------

const luck = (random: Random): number => {
  const roll = cinteger(1, 10, random);
  if (roll === 1) {
    return -(cinteger(0, 20) + 20);
  }
  if (roll === 10) {
    return cinteger(0, 20) + 20;
  }
  return 0;
};

export const runWorldChampionships = (
  draft: Draft<GameContext>,
  random: Random
): void => {
  // Pekkalandian average → FI strength.
  // const phl = draft.competitions.phl;
  /*
  const avg = phl.teams
    .map((id) => draft.teams[id].strength)
    .reduce((acc, s) => acc + s, 0);
  */

  const strength = 200;

  if (draft.country.countries.FI) {
    draft.country.countries.FI.strength = strength;
  }

  // Build WC results.
  const entries: WorldChampionshipEntry[] = values(draft.country.countries)
    .map((c) => ({
      id: c.iso,
      name: c.name,
      strength: c.strength ?? 0,
      luck: luck(random),
      random: cinteger(0, 20) - cinteger(0, 10)
    }))
    .sort(
      (a, b) =>
        b.strength + b.luck + b.random - (a.strength + a.luck + a.random)
    );

  draft.worldChampionshipResults = entries;

  ensureCurrentSeason(draft);
  draft.stats.currentSeason!.worldChampionships = entries.map((e) => e.id);
};

// ---------------------------------------------------------------------------
// 3. Finalize season stats (presidents trophy, medalists, promoted/relegated,
//    per-manager stories)
// ---------------------------------------------------------------------------

export const runFinalizeStats = (draft: Draft<GameContext>): void => {
  ensureCurrentSeason(draft);
  const phl = draft.competitions.phl;
  const division = draft.competitions.division;
  const mutasarja = draft.competitions.mutasarja;

  const phlFinals = phl.phases[3].groups[0] as PlayoffGroup;
  const divFinals = division.phases[3].groups[0] as PlayoffGroup;

  const phlVictors = victors(phlFinals);
  const phlLosers = eliminated(phlFinals);

  const presidentsTrophy = (phl.phases[0].groups[0].stats[0] as TeamStat).id;
  const phlStats = phl.phases[0].groups[0].stats as TeamStat[];
  const phlLoser = phlStats[phlStats.length - 1].id;

  const divisionVictors = victors(divFinals);

  const divisionLosers = eliminated(divFinals);

  const medalists = [
    phlVictors[0],
    phlLosers[0],
    phlVictors[phlVictors.length - 1]
  ].map((e) => e.id);

  // todo: wip
  draft.stats.currentSeason!.relegated = {
    phl: [],
    division: []
  };

  draft.stats.currentSeason!.promoted = {
    mutasarja: [],
    division: []
  };

  const cs = draft.stats.currentSeason!;
  cs.presidentsTrophy = presidentsTrophy;
  cs.medalists = medalists;
  if (divisionVictors[0].id !== phlLoser) {
    cs.relegated.phl = [phlLoser];
    cs.promoted.division = [divisionVictors[0].id];
  }

  const mutasarja1 = draft.competitions.mutasarja.phases[0]
    .groups[0] as RoundRobinGroup;
  const mutasarja2 = draft.competitions.mutasarja.phases[0]
    .groups[1] as RoundRobinGroup;

  const combinedMutasarja = [
    ...takeLast(mutasarja1.stats, 6),
    ...takeLast(mutasarja2.stats, 6)
  ];

  const worstOfTheWorst = sortStats(combinedMutasarja).map((w) => w.id);

  const mutasarjaVictors = victors(
    mutasarja.phases[3].groups[0] as PlayoffGroup
  ).map((t) => t.id);

  const divisionRegularSeason = division.phases[0].groups[0] as RoundRobinGroup;

  const divisionLastTwo = takeLast(divisionRegularSeason.stats, 2).map(
    (t) => t.id
  );

  const divisionRelegated = difference(divisionLastTwo, mutasarjaVictors);

  const mutasarjaPromoted = difference(mutasarjaVictors, divisionRelegated);

  cs.relegated.division = divisionRelegated;
  cs.promoted.mutasarja = mutasarjaPromoted;

  const ranking = [
    ...medalists,
    phlLosers[1].id,

    ...eliminated(phl.phases[1].groups[0] as PlayoffGroup).map((t) => t.id),

    ...(phl.phases[0].groups[0] as RoundRobinGroup).stats
      .slice(8, 11)
      .map((s) => s.id),

    divisionVictors[0].id,
    divisionLosers[0].id,

    ...eliminated(division.phases[2].groups[0] as PlayoffGroup).map(
      (t) => t.id
    ),

    ...eliminated(division.phases[1].groups[0] as PlayoffGroup).map(
      (t) => t.id
    ),

    ...(division.phases[0].groups[0] as RoundRobinGroup).stats
      .slice(6, 10)
      .map((t) => t.id),

    ...victors(mutasarja.phases[3].groups[0] as PlayoffGroup).map((t) => t.id),

    ...eliminated(mutasarja.phases[3].groups[0] as PlayoffGroup).map(
      (t) => t.id
    ),

    ...eliminated(mutasarja.phases[2].groups[0] as PlayoffGroup).map(
      (t) => t.id
    ),

    ...eliminated(mutasarja.phases[1].groups[0] as PlayoffGroup).map(
      (t) => t.id
    ),

    ...worstOfTheWorst
  ];

  // Roll forward `previousRankings` for every Pekkalandian team. Every
  // team that started the game with `previousRankings` keeps a rolling
  // window of the three most recent finishes; light teams (NHL/foreign/
  // amateur) never had them and are skipped. The AI budget recompute
  // that depends on this window happens later in `runSeasonEnd`, after
  // any end-of-season manager changes have been applied.
  for (let i = 0; i < ranking.length; i = i + 1) {
    const teamId = ranking[i];
    const team = draft.teams[teamId];
    const newRanking = i + 1;

    if (team.previousRankings === undefined) {
      continue;
    }
    const [latest, prev] = team.previousRankings;
    team.previousRankings = [newRanking, latest, prev];
  }

  // Per-manager stories.
  for (const manager of draft.human.order) {
    const teamId = draft.managers[manager].team;

    if (teamId === undefined) {
      continue;
    }
    const mainCompetition = managersMainCompetition(manager)(draft);
    const competition = draft.competitions[mainCompetition];
    const group = competition.phases[0].groups[0];
    const ranking = (group.stats as TeamStat[]).findIndex(
      (s) => s.id === teamId
    );
    const stat = (group.stats as TeamStat[])[ranking];

    cs.stories[manager] = {
      mainCompetition,
      mainCompetitionStat: stat,
      ranking,
      promoted:
        cs.promoted.division.includes(teamId) ||
        cs.promoted.mutasarja.includes(teamId),
      relegated:
        cs.relegated.division.includes(teamId) ||
        cs.promoted.mutasarja.includes(teamId),
      medal: medalists.findIndex((m) => m === teamId),
      ehlChampion: cs.ehlChampion === teamId,
      lastPhase: competition.phases.findLastIndex((phase: Phase) =>
        phase.teams.includes(teamId)
      )
    };

    //
  }
};

// ---------------------------------------------------------------------------
// 4. AI team-strength recalculation (port of QB SUB tasomuut, ILEZ5.BAS:1832)
// ---------------------------------------------------------------------------

/**
 * Resolve a team's *current* league tier (1=PHL, 2=Divisioona, 3=Mutasarja)
 * by membership in the post-promotion/relegation competition arrays.
 * Returns `undefined` for light teams or teams that aren't part of the
 * Pekkalandia ladder.
 */
export const tierOf = (
  draft: Draft<GameContext>,
  teamId: number
): 1 | 2 | 3 | undefined => {
  if (draft.competitions.phl.teams.includes(teamId)) {
    return 1;
  }
  if (draft.competitions.division.teams.includes(teamId)) {
    return 2;
  }
  if (draft.competitions.mutasarja.teams.includes(teamId)) {
    return 3;
  }
  return undefined;
};

/**
 * Same-tier strength bracket lookup. Verbatim port of the QB
 * `SELECT CASE sin1` ladders inside `SUB tasomuut`. `sin1` is the 3-season
 * rolling average of league-global rankings (lower = better).
 */
export const sameTierStrength = (sin1: number, tier: 1 | 2 | 3): number => {
  if (tier === 1) {
    if (sin1 <= 1) {
      return 36;
    }
    if (sin1 <= 2) {
      return 35;
    }
    if (sin1 <= 3) {
      return 34;
    }
    if (sin1 <= 4) {
      return 33;
    }
    if (sin1 <= 6) {
      return 32;
    }
    if (sin1 <= 8) {
      return 31;
    }
    if (sin1 <= 11) {
      return 30;
    }
    if (sin1 <= 13) {
      return 29;
    }
    return 28;
  }
  if (tier === 2) {
    if (sin1 <= 13.5) {
      return 28;
    }
    if (sin1 <= 15) {
      return 27;
    }
    if (sin1 <= 17) {
      return 26;
    }
    if (sin1 <= 19) {
      return 25;
    }
    if (sin1 <= 21) {
      return 24;
    }
    if (sin1 <= 23) {
      return 23;
    }
    if (sin1 <= 25) {
      return 22;
    }
    return 21;
  }
  if (sin1 <= 26) {
    return 22;
  }
  if (sin1 <= 28) {
    return 21;
  }
  if (sin1 <= 31) {
    return 20;
  }
  if (sin1 <= 34) {
    return 19;
  }
  if (sin1 <= 37) {
    return 18;
  }
  if (sin1 <= 40) {
    return 17;
  }
  if (sin1 <= 43) {
    return 16;
  }
  if (sin1 <= 46) {
    return 15;
  }
  return 14;
};

/**
 * Verbatim port of QB `SUB tasomuut` (`ILEZ5.BAS:1832`).
 *
 * Recomputes `team.tier` (QB `tazo()`) for every AI-managed team,
 * based on (1) the 3-season rolling rank average, (2) the
 * stayed/promoted/relegated direction, (3) the manager's negotiation
 * skill (jitter), and (4) the arena capacity (tiny-arena cap).
 *
 * **Skill is signed -3..+3, identical to QB.** `mtaito(3, man)` in QB is
 * the manager's NEUVOKKUUS attribute, bounded to `-3..+3` by the
 * character-creation wizard at `MHM2K.BAS:1535/1539` and rendered as a
 * signed value at `ILES5.BAS:741`. Our `manager.attributes.negotiation`
 * stores the same signed value verbatim — pass it through, no shift.
 *
 * Must run *after* promotions/relegations have been committed (so
 * `tierOf` reflects the new league assignment) and *after* any AI
 * manager swap (so `mtaito(3)` uses the incoming manager's
 * NEUVOKKUUS — see SUBS.md `tasomuut` row for the QB call-order
 * note).
 */
export const runTasomuut = (
  draft: Draft<GameContext>,
  random: RandomService
): void => {
  const cs = draft.stats.currentSeason!;

  for (const team of values(draft.teams)) {
    if (team.kind !== "ai") {
      continue;
    }
    if (team.previousRankings === undefined) {
      continue;
    }
    if (team.manager === undefined) {
      continue;
    }
    const newTier = tierOf(draft, team.id);
    if (newTier === undefined) {
      continue;
    }

    // sin1 — 3-season rolling rank average. previousRankings has just
    // been rolled forward in runFinalizeStats, so [0]=this season's
    // finish, [1]=last season, [2]=two seasons ago.
    const [r1, r2, r3] = team.previousRankings;
    const sin1 = (r1 + r2 + r3) / 3;

    const wasPromoted =
      cs.promoted.division.includes(team.id) ||
      cs.promoted.mutasarja.includes(team.id);
    const wasRelegated =
      cs.relegated.phl.includes(team.id) ||
      cs.relegated.division.includes(team.id);

    let temp: number;

    if (!wasPromoted && !wasRelegated) {
      // Same-tier path (tempsr === sr in QB).
      temp = sameTierStrength(sin1, newTier);
    } else if (wasRelegated) {
      // Relegated path (tempsr > sr in QB; QB SELECT CASE keys on
      // OLD tier — one league above the current). Strong rolling
      // average → small +1/+2 bump (legacy quality preserved); weak →
      // no change.
      const oldTier = newTier - 1; // PHL→Div ⇒ 1, Div→Muta ⇒ 2.
      const threshold = oldTier === 1 ? 15 : 27;
      temp = sin1 <= threshold ? team.tier + random.integer(1, 2) : team.tier;
    } else {
      // Promoted path (tempsr < sr in QB; QB SELECT CASE keys on
      // OLD tier — one league below the current). Cap to a ceiling,
      // then roll a sin1-weighted -2 (poor average ⇒ more likely).
      const oldTier = newTier + 1; // Div→PHL ⇒ 2, Muta→Div ⇒ 3.
      if (oldTier === 2) {
        temp = team.tier > 31 ? 31 : team.tier;
        if (random.real(0, 100) < sin1 * 2) {
          temp -= 2;
        }
      } else {
        temp = team.tier > 24 ? 24 : team.tier;
        if (random.real(0, 200) < sin1 * 2) {
          temp -= 2;
        }
      }
    }

    // Negotiation jitter — mtaito(3) is signed -3..+3, used directly.
    const manager = draft.managers[team.manager];
    const skill = manager.attributes.negotiation;
    const a = random.integer(1, 90);
    const lower = 30 + skill * 8;
    const upper = 60 + skill * 8;
    if (a <= lower) {
      temp += 1;
    } else if (a > upper) {
      temp -= 1;
    }

    // Tiny-arena cap (QB `paikka(1) + paikka(2) < 40`).
    if (team.arena.standingCount + team.arena.seatedCount < 40 && temp > 27) {
      temp = 27;
    }

    team.tier = temp;
  }
};

// ---------------------------------------------------------------------------
// 5. Season end (commit currentSeason, bump season, promote/relegate)
// ---------------------------------------------------------------------------

const removeTeamFromCompetition = (
  draft: Draft<GameContext>,
  competitionId: string,
  teamId: number
): void => {
  const comp = draft.competitions[competitionId as CompetitionId];
  const idx = comp.teams.indexOf(teamId);
  if (idx >= 0) {
    comp.teams.splice(idx, 1);
  }
};

const addTeamToCompetition = (
  draft: Draft<GameContext>,
  competitionId: string,
  teamId: number
): void => {
  const comp = draft.competitions[competitionId as CompetitionId];
  if (!comp.teams.includes(teamId)) {
    comp.teams.push(teamId);
  }
};

const runPromote = (
  draft: Draft<GameContext>,
  competitionId: string,
  teamId: number
): void => {
  const promoteTo = competitionData[competitionId as CompetitionId].promoteTo;
  if (promoteTo === false) {
    throw new Error("Promotion not possible");
  }
  removeTeamFromCompetition(draft, competitionId, teamId);
  addTeamToCompetition(draft, promoteTo, teamId);
};

const runRelegate = (
  draft: Draft<GameContext>,
  competitionId: string,
  teamId: number
): void => {
  const relegateTo = competitionData[competitionId as CompetitionId].relegateTo;
  if (relegateTo === false) {
    return;
  }
  removeTeamFromCompetition(draft, competitionId, teamId);
  addTeamToCompetition(draft, relegateTo, teamId);
};

export const runSeasonEnd = (
  draft: Draft<GameContext>,
  random: RandomService
): void => {
  const cs = draft.stats.currentSeason!;
  if (cs) {
    draft.stats.seasons.push(cs);
  }

  // Run promotions and relegations from precalculated season stats
  cs.promoted.division.forEach((promoted) => {
    runPromote(draft, "division", promoted);
  });

  cs.promoted.mutasarja.forEach((promoted) => {
    runPromote(draft, "mutasarja", promoted);
  });

  cs.relegated.phl.forEach((relegated) => {
    runRelegate(draft, "phl", relegated);
  });

  cs.relegated.division.forEach((relegated) => {
    runRelegate(draft, "division", relegated);
  });

  // TODO: AI manager swap. NOT YET. When it lands, it must run before
  // runTasomuut so the negotiation-jitter roll uses the incoming
  // manager's NEUVOKKUUS — see SUBS.md `tasomuut` row.

  // AI team-strength recalculation. Mutates `team.tier` in place for
  // every AI team based on the freshly rolled `previousRankings` and
  // the just-applied promotion/relegation moves.
  runTasomuut(draft, random);

  // Bump season; advanceRound will then take round 0 → 1, but we want next
  // season to begin at round 0, so set to -1 and let advanceRound increment.
  draft.turn.season += 1;
  draft.turn.round = -1;

  // New-season AI budget recompute. Mirrors QB ILEZ5.BAS:530-535
  // (`orgamaar` inside `IF ohj(xx) = 0`). Runs at the boundary between
  // seasons so that any end-of-season manager changes (player or AI;
  // MHM 2000 future work) are already reflected in `human.order` by
  // the time we decide who's AI and who's not.
  //
  // AI teams re-derive their spend from the freshly shifted
  // `previousRankings`. Human-managed teams keep their hand-tuned
  // sliders — we don't second-guess them.
  const humanTeamIds = new Set(
    draft.human.order
      .map((managerId) => draft.managers[managerId].team)
      .filter((teamId): teamId is number => teamId !== undefined)
  );

  for (const team of values(draft.teams)) {
    if (team.previousRankings === undefined) {
      continue;
    }
    if (humanTeamIds.has(team.id)) {
      continue;
    }
    team.budget = initialBudgetForRankings(team.previousRankings);
  }
};
