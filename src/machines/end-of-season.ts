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

import type { Draft } from "immer";
import type { GameContext } from "@/state";
import type { WorldChampionshipEntry } from "@/state/game";
import type {
  PlayoffGroup,
  TeamStat,
  Phase,
  CompetitionId
} from "@/types/competitions";
import type { RandomService } from "@/services/random";

import { values } from "remeda";
import { victors, eliminated } from "@/services/playoffs";
import competitionData from "@/data/competitions";
import { managersMainCompetition } from "@/machines/selectors";

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

  const phlFinals = phl.phases[3].groups[0] as PlayoffGroup;
  const divFinals = division.phases[3].groups[0] as PlayoffGroup;

  const phlVictors = victors(phlFinals);
  const phlLosers = eliminated(phlFinals);

  const presidentsTrophy = (phl.phases[0].groups[0].stats[0] as TeamStat).id;
  const phlStats = phl.phases[0].groups[0].stats as TeamStat[];
  const phlLoser = phlStats[phlStats.length - 1].id;
  const divisionVictor = victors(divFinals)[0].id;

  const medalists = [
    phlVictors[0],
    phlLosers[0],
    phlVictors[phlVictors.length - 1]
  ].map((e) => e.id);

  const cs = draft.stats.currentSeason!;
  cs.presidentsTrophy = presidentsTrophy;
  cs.medalists = medalists;
  if (divisionVictor !== phlLoser) {
    cs.relegated = phlLoser;
    cs.promoted = divisionVictor;
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
      promoted: teamId === cs.promoted,
      relegated: teamId === cs.relegated,
      medal: medalists.findIndex((m) => m === teamId),
      ehlChampion: cs.ehlChampion === teamId,
      lastPhase: competition.phases.findLastIndex((phase: Phase) =>
        phase.teams.includes(teamId)
      )
    };
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
    return;
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

/**
 * Apply the Mutasarja ↔ Divisioona swap.
 *
 * MHM 2000 third-tier rules: the two winners of Mutasarja's phase 3
 * round-of-4 playoffs are promoted to Divisioona for the next season.
 * The two slots they take are vacated by the two worst Divisioona teams
 * after the regular season — except those two had a chance to defend
 * their slot by entering Mutasarja's phase 2 as seeds 1 & 2. If a
 * Divisioona relegation candidate fights its way to a phase-3 win, it
 * stays in Divisioona; the other relegation candidate is the one who
 * actually drops.
 *
 * Implementation: each phase-3 winner that is currently in Mutasarja
 * gets promoted; for every slot we need to vacate in Divisioona we
 * relegate one of the two original Divisioona relegation candidates
 * that did NOT survive phase 3. Net effect: Divisioona size stays at
 * 12, Mutasarja size stays at 24.
 *
 * No-op if Mutasarja's phase-3 group hasn't been seeded (e.g. early
 * release, manual context, partial port).
 */
const runMutasarjaSwap = (draft: Draft<GameContext>): void => {
  const muta = draft.competitions.mutasarja;
  const finalGroup = muta.phases[3]?.groups[0];
  if (!finalGroup || finalGroup.type !== "playoffs") {
    return;
  }
  const winnersIds = victors(finalGroup as PlayoffGroup).map((t) => t.id);
  if (winnersIds.length === 0) {
    return;
  }

  const divStats = draft.competitions.division.phases[0]?.groups[0]?.stats as
    | TeamStat[]
    | undefined;
  if (!divStats || divStats.length < 2) {
    return;
  }
  const relegationCandidates = [
    divStats[divStats.length - 1].id,
    divStats[divStats.length - 2].id
  ];

  // Promote every phase-3 winner currently in Mutasarja.
  const promoted: number[] = [];
  for (const teamId of winnersIds) {
    if (teamCompetesIn(draft, teamId, "mutasarja")) {
      runPromote(draft, "mutasarja", teamId);
      promoted.push(teamId);
    }
  }

  // Relegate as many Divisioona relegation candidates as Mutasarja
  // teams we just promoted — but skip ones that already won phase 3
  // (they earned their stay).
  let toRelegate = promoted.length;
  for (const teamId of relegationCandidates) {
    if (toRelegate === 0) {
      break;
    }
    if (winnersIds.includes(teamId)) {
      continue;
    }
    runRelegate(draft, "division", teamId);
    toRelegate -= 1;
  }
};

export const runSeasonEnd = (draft: Draft<GameContext>): void => {
  const cs = draft.stats.currentSeason;
  if (cs) {
    draft.stats.seasons.push(cs);
  }

  // Promote/relegate (skipped when same team — see runFinalizeStats).
  if (cs?.promoted !== undefined && cs?.relegated !== undefined) {
    runPromote(draft, "division", cs.promoted);
    runRelegate(draft, "phl", cs.relegated);
  }

  // Mutasarja ↔ Divisioona swap (MHM 2000 third tier).
  runMutasarjaSwap(draft);

  // Bump season; advanceRound will then take round 0 → 1, but we want next
  // season to begin at round 0, so set to -1 and let advanceRound increment.
  draft.turn.season += 1;
  draft.turn.round = -1;
};
