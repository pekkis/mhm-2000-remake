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
import type { GameContext, Manager } from "@/state";
import type { Team, WorldChampionshipEntry } from "@/state/game";
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
import { currency } from "@/services/format";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const pushNews = (draft: Draft<GameContext>, line: string): void => {
  draft.news.news.push(line);
};

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

const findManagerControlling = (
  draft: Draft<GameContext>,
  teamId: number
): Manager => {
  const manager = values(draft.managers).find((m) => m.team === teamId);

  if (!manager) {
    throw new Error("Manager not found");
  }

  return manager;
};

const teamCompetesIn = (
  draft: Draft<GameContext>,
  teamId: number,
  competitionId: CompetitionId
): boolean => {
  return draft.competitions[competitionId].teams.includes(teamId);
};

const teamPositionInRoundRobin = (
  draft: Draft<GameContext>,
  teamId: number,
  competitionId: CompetitionId,
  phaseIdx: number
): number | false => {
  const phase = draft.competitions[competitionId].phases[phaseIdx];
  if (!phase) {
    return false;
  }
  const group = phase.groups.find((g) => g.teams.includes(teamId));
  if (!group) {
    return false;
  }
  const idx = (group.stats as TeamStat[]).findIndex((s) => s.id === teamId);
  if (idx === -1) {
    return false;
  }
  return idx + 1;
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
  const phl = draft.competitions.phl;
  const avg = phl.teams
    .map((id) => draft.teams[id].strength)
    .reduce((acc, s) => acc + s, 0);
  const strength = Math.round(avg / phl.teams.length);

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
// 2. Awards
// ---------------------------------------------------------------------------

type AwardData = {
  id: number;
  name: string;
  amount: number;
  strength: number;
};

type Award = {
  news: (data: AwardData) => string;
  data: (team: Team) => AwardData;
};

const createAward = (
  amount: number,
  strength: number,
  news: (data: AwardData) => string
): Award => ({
  news,
  data: (team) => ({ id: team.id, name: team.name, amount, strength })
});

const playoffBonusAward = createAward(
  100000,
  2,
  (d) => `__${d.name}__ saa playoff-bonuksen, ${currency(d.amount)}!`
);

const medalAwards: Award[] = [
  createAward(
    1500000,
    29,
    (d) => `__${d.name}__ nettoaa mestaruudestaan ${currency(d.amount)}!`
  ),
  createAward(
    1000000,
    19,
    (d) => `__${d.name}__ nettoaa hopeastaan ${currency(d.amount)}!`
  ),
  createAward(
    700000,
    12,
    (d) => `__${d.name}__ nettoaa pronssistaan ${currency(d.amount)}!`
  ),
  createAward(
    500000,
    10,
    (d) => `__${d.name}__ nettoaa neljännestä sijastaan ${currency(d.amount)}!`
  )
];

const roundRobinAwards: Award[] = [
  createAward(
    500000,
    10,
    (d) => `__${d.name}__ saa runkosarjan voitosta ${currency(d.amount)}!`
  ),
  createAward(
    400000,
    7,
    (d) =>
      `__${d.name}__ saa runkosarjan toisesta sijasta ${currency(d.amount)}!`
  ),
  createAward(
    300000,
    6,
    (d) =>
      `__${d.name}__ saa runkosarjan kolmannesta sijasta ${currency(d.amount)}!`
  ),
  createAward(
    200000,
    4,
    (d) =>
      `__${d.name}__ saa runkosarjan neljännestä sijasta ${currency(d.amount)}!`
  ),
  playoffBonusAward,
  playoffBonusAward,
  playoffBonusAward,
  playoffBonusAward
];

const yieldAwards = (
  draft: Draft<GameContext>,
  awards: Award[],
  to: number[]
): void => {
  for (const [i, teamId] of to.entries()) {
    const award = awards[i];
    const team = draft.teams[teamId];
    const data = award.data(team);
    const manager = findManagerControlling(draft, teamId);

    if (manager.kind === "human") {
      manager.balance += data.amount;
    } else {
      draft.teams[data.id].strength += data.strength;
    }

    pushNews(draft, award.news(data));
  }
};

// Random end-of-season events. Each entry rolls once per Pekkalandian team;
// if eligible and the roll passes, the team's strength is bumped and a news
// line is pushed. 1-1 port of `randomEvents` in `src/sagas/awards.ts`.
type RandomEvent = (
  draft: Draft<GameContext>,
  random: RandomService,
  teamId: number
) => void;

const playsInPHLOrWasPromoted = (
  draft: Draft<GameContext>,
  teamId: number
): boolean => {
  const inPHL = teamCompetesIn(draft, teamId, "phl");
  if (!inPHL) {
    // Promoted = currently in division and is the division victor.
    if (!teamCompetesIn(draft, teamId, "division")) {
      return false;
    }
    const divisionVictor = victors(
      draft.competitions.division.phases[3].groups[0] as PlayoffGroup
    )[0]?.id;
    return divisionVictor === teamId;
  }
  // In PHL — eligible unless they were relegated.
  const phlStats = draft.competitions.phl.phases[0].groups[0]
    .stats as TeamStat[];
  const phlLoser = phlStats[phlStats.length - 1].id;
  if (phlLoser !== teamId) {
    return true;
  }
  const divisionVictor = victors(
    draft.competitions.division.phases[3].groups[0] as PlayoffGroup
  )[0]?.id;
  return divisionVictor === teamId;
};

const playsInDivisionOrWasRelegated = (
  draft: Draft<GameContext>,
  teamId: number
): boolean => {
  const inDivision = teamCompetesIn(draft, teamId, "division");
  if (!inDivision) {
    if (!teamCompetesIn(draft, teamId, "phl")) {
      return false;
    }
    const phlStats = draft.competitions.phl.phases[0].groups[0]
      .stats as TeamStat[];
    const phlLoser = phlStats[phlStats.length - 1].id;
    if (phlLoser !== teamId) {
      return false;
    }
    const divisionVictor = victors(
      draft.competitions.division.phases[3].groups[0] as PlayoffGroup
    )[0]?.id;
    return divisionVictor !== teamId;
  }
  // In division — eligible unless they were promoted.
  const divisionVictor = victors(
    draft.competitions.division.phases[3].groups[0] as PlayoffGroup
  )[0]?.id;
  return divisionVictor !== teamId;
};

const createRandomEvent =
  (
    dieSize: number,
    requiredThrow: number,
    amountOfStrengthIncremented: (team: Team, random: RandomService) => number,
    isEligible: (draft: Draft<GameContext>, teamId: number) => boolean,
    news: (team: Team) => string
  ): RandomEvent =>
  (draft, random, teamId) => {
    if (!isEligible(draft, teamId)) {
      return;
    }
    const rand = random.integer(1, dieSize);
    if (rand < requiredThrow) {
      return;
    }
    const team = draft.teams[teamId];
    const delta = amountOfStrengthIncremented(team, random);
    team.strength += delta;
    pushNews(draft, news(team));
  };

const randomEvents: RandomEvent[] = [
  createRandomEvent(
    12,
    2,
    () => -199,
    (d, t) => playsInPHLOrWasPromoted(d, t) && d.teams[t].strength > 400,
    (team) =>
      `__${team.name}__ kaatuu sisäisiin riitoihin! Pelaajat kävelevät ulos!`
  ),
  createRandomEvent(
    12,
    5,
    () => -70,
    (d, t) => playsInPHLOrWasPromoted(d, t) && d.teams[t].strength > 300,
    (team) => `__${team.name}__ hajoaa totaalisesti ulkomaiden rahaseuroihin!`
  ),
  createRandomEvent(
    12,
    6,
    () => -45,
    (d, t) => playsInPHLOrWasPromoted(d, t) && d.teams[t].strength > 250,
    (team) => `__${team.name}__ menettää useita pelaajiaan ulkomaille.`
  ),
  createRandomEvent(
    12,
    8,
    () => -15,
    (d, t) => playsInPHLOrWasPromoted(d, t) && d.teams[t].strength > 210,
    (team) => `__${team.name}__ menettää joitakin pelaajiaan ulkomaille.`
  ),
  createRandomEvent(
    1,
    1,
    () => -30,
    (d, t) => {
      if (!playsInPHLOrWasPromoted(d, t)) {
        return false;
      }
      if (d.teams[t].strength <= 200) {
        return false;
      }
      const rank = teamPositionInRoundRobin(d, t, "phl", 0);
      return rank !== false && rank > 8;
    },
    (team) =>
      `__${team.name}__ ei päässyt play-offeihin ja myy pelaajiaan konkurssin uhatessa!!`
  ),
  createRandomEvent(
    1,
    1,
    () => 20,
    (d, t) => {
      if (!playsInPHLOrWasPromoted(d, t)) {
        return false;
      }
      if (d.teams[t].strength >= 160) {
        return false;
      }
      const rank = teamPositionInRoundRobin(d, t, "phl", 0);
      return rank !== false && rank <= 8;
    },
    (team) =>
      `__${team.name}__:n  nuori joukkue saa rutkasti kokemusta play-offeista!`
  ),
  createRandomEvent(
    12,
    5,
    () => 12,
    (d, t) => playsInPHLOrWasPromoted(d, t) && d.teams[t].strength < 150,
    (team) =>
      `__${team.name}__ saa uuden sponsorin joka ostaa joukkueelle uusia pelaajia!`
  ),
  createRandomEvent(
    12,
    5,
    () => 23,
    (d, t) => playsInPHLOrWasPromoted(d, t) && d.teams[t].strength < 135,
    (team) =>
      `__${team.name}__ saa uuden, RIKKAAN sponsorin joka ostaa joukkueelle uusia pelaajia!`
  ),
  createRandomEvent(
    22,
    16,
    () => 60,
    (d, t) => playsInPHLOrWasPromoted(d, t) && d.teams[t].strength < 140,
    (team) =>
      `__${team.name}__ lähtee tosissaan mukaan mestaruustaistoon rahan voimalla!`
  ),
  createRandomEvent(
    12,
    7,
    () => -10,
    (d, t) => playsInPHLOrWasPromoted(d, t),
    (team) => `__${team.name}__:n veteraanipelaajia siirtyy eläkkeelle!`
  ),
  createRandomEvent(
    12,
    7,
    () => 7,
    (d, t) => playsInPHLOrWasPromoted(d, t),
    (team) => `__${team.name}__:n juniorityö tuottaa lupaavan nuoren tähden!`
  ),
  createRandomEvent(
    12,
    8,
    (_team, random) => -random.integer(5, 20),
    (d, t) => playsInPHLOrWasPromoted(d, t),
    (team) => `__${team.name}__:n pelaajia siirtyy rahan perässä muualle!`
  ),
  createRandomEvent(
    12,
    8,
    (_team, random) => -random.integer(5, 20),
    (d, t) => playsInPHLOrWasPromoted(d, t),
    (team) => `__${team.name}__ kokee menetyksen, pelaajia siirtyy pois!`
  ),
  createRandomEvent(
    32,
    27,
    () => 55,
    (d, t) => playsInPHLOrWasPromoted(d, t),
    (team) => `__${team.name}__ antaa rahan palaa kunnolla!`
  ),
  createRandomEvent(
    12,
    5,
    () => -40,
    (d, t) => {
      if (!teamCompetesIn(d, t, "phl")) {
        return false;
      }
      const phlStats = d.competitions.phl.phases[0].groups[0]
        .stats as TeamStat[];
      const phlLoser = phlStats[phlStats.length - 1].id;
      if (phlLoser !== t) {
        return false;
      }
      const divisionVictor = victors(
        d.competitions.division.phases[3].groups[0] as PlayoffGroup
      )[0]?.id;
      if (divisionVictor === t) {
        return false;
      } // not actually relegated
      return d.teams[t].strength > 160;
    },
    (team) =>
      `Divisioonaan tippunut __${team.name}__ menettää rutkasti pelaajiansa liigaan.`
  ),
  createRandomEvent(
    12,
    7,
    () => -20,
    (d, t) => {
      if (!teamCompetesIn(d, t, "phl")) {
        return false;
      }
      const phlStats = d.competitions.phl.phases[0].groups[0]
        .stats as TeamStat[];
      const phlLoser = phlStats[phlStats.length - 1].id;
      if (phlLoser !== t) {
        return false;
      }
      const divisionVictor = victors(
        d.competitions.division.phases[3].groups[0] as PlayoffGroup
      )[0]?.id;
      if (divisionVictor === t) {
        return false;
      }
      return d.teams[t].strength > 130;
    },
    (team) =>
      `Divisioonaan tippunut __${team.name}__ menettää pelaajiansa liigaan.`
  ),
  createRandomEvent(
    1,
    1,
    () => -20,
    (d, t) => {
      if (!teamCompetesIn(d, t, "division")) {
        return false;
      }
      const divisionVictor = victors(
        d.competitions.division.phases[3].groups[0] as PlayoffGroup
      )[0]?.id;
      if (divisionVictor === t) {
        return false;
      }
      return d.teams[t].strength > 120;
    },
    (team) =>
      `Nousua tavoitellut __${team.name}__ ei onnistunut - pelaajat lähtevät!.`
  ),
  createRandomEvent(
    1,
    1,
    () => -40,
    (d, t) => {
      if (!teamCompetesIn(d, t, "division")) {
        return false;
      }
      const divisionVictor = victors(
        d.competitions.division.phases[3].groups[0] as PlayoffGroup
      )[0]?.id;
      if (divisionVictor === t) {
        return false;
      }
      return d.teams[t].strength > 140;
    },
    (team) =>
      `Nousua tavoitellut __${team.name}__ ei onnistunut - pelaajat lähtevät joukoittain!.`
  ),
  createRandomEvent(
    12,
    8,
    () => 8,
    (d, t) => playsInDivisionOrWasRelegated(d, t) && d.teams[t].strength < 82,
    (team) => `__${team.name}__ saa uuden sponsorin!.`
  ),
  createRandomEvent(
    12,
    7,
    () => 13,
    (d, t) => playsInDivisionOrWasRelegated(d, t) && d.teams[t].strength < 72,
    (team) => `__${team.name}__ saa uuden, hyvän sponsorin!.`
  ),
  createRandomEvent(
    12,
    7,
    () => 16,
    (d, t) => playsInDivisionOrWasRelegated(d, t) && d.teams[t].strength < 62,
    (team) => `__${team.name}__ saa uuden, loistavan sponsorin!.`
  ),
  createRandomEvent(
    12,
    7,
    () => -15,
    (d, t) => playsInDivisionOrWasRelegated(d, t),
    (team) => `Liigajoukkueet värväävät __${team.name}__:n pelaajia!`
  ),
  createRandomEvent(
    22,
    20,
    () => 45,
    (d, t) => playsInDivisionOrWasRelegated(d, t),
    (team) =>
      `__${team.name}__ kuluttaa todella paljon rahaa! Uusia pelaajia ostetaan roimasti!`
  ),
  createRandomEvent(
    12,
    7,
    () => -8,
    (d, t) => playsInDivisionOrWasRelegated(d, t),
    (team) => `__${team.name}__:n veteraanipelaajia lopettaa uransa.`
  ),
  createRandomEvent(
    1,
    1,
    (team) => 45 - team.strength,
    (d, t) => d.teams[t].strength < 35,
    (team) =>
      `__${team.name}__ on jo luopumassa sarjapaikastaan, mutta uusi omistaja pelastaa joukkueen viime hetkellä!`
  )
];

export const runAwards = (
  draft: Draft<GameContext>,
  random: RandomService
): void => {
  const phl = draft.competitions.phl;
  const finalPhase = phl.phases[3].groups[0];
  if (finalPhase.type !== "playoffs") {
    throw new Error("End-of-season: PHL final group is not a playoff group");
  }

  const winners = victors(finalPhase);
  const losers = eliminated(finalPhase);

  const ranking = [
    winners[0],
    losers[0],
    winners[winners.length - 1],
    losers[losers.length - 1]
  ].map((r) => r.id);

  yieldAwards(draft, medalAwards, ranking);

  const tableEntries = (phl.phases[0].groups[0].stats as TeamStat[])
    .slice(0, 8)
    .map((t) => t.id);

  yieldAwards(draft, roundRobinAwards, tableEntries);

  // Pekkalandian teams = first 48 (PHL + Divisioona + Mutasarja).
  // Awards/random events still only fire for PHL- and Divisioona-eligible
  // teams via the per-event `isEligible` predicates; Mutasarja teams pass
  // through silently for now (MHM 2000-only tier, awards not yet wired).
  for (const team of draft.teams.slice(0, 48)) {
    for (const ev of randomEvents) {
      ev(draft, random, team.id);
    }
  }
};

// ---------------------------------------------------------------------------
// 3. Finalize season stats (presidents trophy, medalists, promoted/relegated,
//    per-manager stories)
// ---------------------------------------------------------------------------

const managersMainCompetition = (
  draft: Draft<GameContext>,
  managerId: string
): CompetitionId => {
  const team = draft.managers[managerId]?.team;
  if (team !== undefined && draft.competitions.phl.teams.includes(team)) {
    return "phl";
  }
  return "division";
};

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
    const mainCompetition = managersMainCompetition(draft, manager);
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
