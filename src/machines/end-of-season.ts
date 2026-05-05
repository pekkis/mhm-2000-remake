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

import { current, type Draft } from "immer";
import type { GameContext } from "@/state";
import type { WorldChampionshipEntry } from "@/state/game";
import type {
  PlayoffGroup,
  TeamStat,
  Phase,
  CompetitionId,
  RoundRobinGroup
} from "@/types/competitions";
import type { RandomService } from "@/services/random";

import { difference, intersection, takeLast, values } from "remeda";
import { victors, eliminated } from "@/services/playoffs";
import competitionData from "@/data/competitions";
import { managersMainCompetition } from "@/machines/selectors";
import { sortStats } from "@/services/league";
import { initialBudgetForRankings } from "@/data/mhm2000/budget";
import { emptySeasonStat } from "@/services/empties";

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
      promoted: undefined,
      relegated: undefined,
      stories: {}
    };
  }
};

const teamCompetesIn = (
  draft: Draft<GameContext>,
  teamId: number,
  competitionId: CompetitionId
): boolean => {
  return draft.competitions[competitionId].teams.includes(teamId);
};

// ---------------------------------------------------------------------------
// 1. World championships
// ---------------------------------------------------------------------------

const luck = (random: RandomService): number => {
  const roll = random.cinteger(1, 10);
  if (roll === 1) {
    return -(random.cinteger(0, 20) + 20);
  }
  if (roll === 10) {
    return random.cinteger(0, 20) + 20;
  }
  return 0;
};

export const runWorldChampionships = (
  draft: Draft<GameContext>,
  random: RandomService
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
      random: random.cinteger(0, 20) - random.cinteger(0, 10)
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
// 4. Season end (commit currentSeason, bump season, promote/relegate)
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

export const runSeasonEnd = (draft: Draft<GameContext>): void => {
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

  // TODO: AI manager swap. NOT YET.

  /*
  We SHOULD be able to do tasomaar() here now from the precalculated SeasonStats
  and the already updated previousRankings.
  */

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
