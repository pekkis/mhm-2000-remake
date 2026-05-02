/**
 * Default factory for a fresh `GameContext`.
 *
 * Mirrors the per-duck `defaultState` values currently scattered across
 * `src/ducks/*`. Used as the initial `context` of `gameMachine` and as
 * the reset target on quit-to-menu.
 *
 * Some defaults call into pure functions that read `RandomService` (team
 * strengths, country strengths). That keeps existing behavior; the
 * deterministic seed mechanism (`VITE_RANDOM_SEED`) still works.
 */

import { entries, values } from "remeda";

import { teams as managedTeamDefs } from "@/data/mhm2000/teams";
import {
  foreignTeams as foreignLightTeams,
  amateurTeams as amateurLightTeams
} from "@/data/mhm2000/light-teams";
import managerDefs from "@/data/managers";
import competitionList from "@/data/competitions";
import { countries as countryList } from "@/data/countries";

import type { GameContext } from "./game-context";
import type { Country } from "./country";
import type { Team } from "./game";
import type { Competition, CompetitionId } from "@/types/competitions";
import { managerFromDefinition } from "@/services/manager";
import { createUniqueId } from "@/services/id";

// Phase-2 wiring: MHM 2000's TEAMS.PLN holds 48 managed teams across the
// three Pekkalandian tiers, but they're NOT cleanly id-grouped in source
// order (id 12 is mutasarja, etc.). The runtime competitions hard-code
// team-id arrays (PHL = 0..11, Divisioona = 12..23, Mutasarja = 24..47),
// so we renumber on transplant so each tier occupies a contiguous id
// range.
//
// Foreign clubs land at slots 48..117 (all 70 European clubs from
// TEAMS.FOR). The season-start EHL seed still pulls `slice(48, 48 + 17)`
// which lines up with the first 17 cleanly. The wide pool means the three
// tournament filters in `src/data/tournaments.ts` always find enough
// candidates each season.
//
// Strength is still a placeholder (real per-roster attribute model lands
// later). Values are picked so:
//   * Tournament filters all resolve (`>200`, `150..225`, `<=175`).
//   * Turmio gets a 200 special so we can validate Mutasarja->Divisioona
//     promotion without waiting for the attribute model.
const phlSource = managedTeamDefs.filter((t) => t.league === "phl");
const divisioonaSource = managedTeamDefs.filter(
  (t) => t.league === "divisioona"
);
const mutasarjaSource = managedTeamDefs.filter((t) => t.league === "mutasarja");
const ehlForeign = foreignLightTeams;
const amateurs = amateurLightTeams;

// Cycled across the foreign list so each of the three tournament filter
// buckets has plenty of eligible candidates (>200, 150..225, <=175).
const FOREIGN_PLACEHOLDER_STRENGTHS = [230, 180, 150];

const seedTeams = (): Team[] => [
  ...phlSource.map((t, i) => ({
    id: i,
    uid: createUniqueId(),
    name: t.name,
    city: t.city,
    arena: t.arena,
    strength: 250,
    domestic: true,
    morale: 0,
    strategy: 2,
    readiness: 0,
    effects: [],
    opponentEffects: []
  })),
  ...divisioonaSource.map((t, i) => ({
    id: i,
    uid: createUniqueId(),
    name: t.name,
    city: t.city,
    arena: t.arena,
    strength: 175,
    domestic: true,
    morale: 0,
    strategy: 2,
    readiness: 0,
    effects: [],
    opponentEffects: []
  })),
  ...mutasarjaSource.map((t, i) => ({
    id: i,
    uid: createUniqueId(),
    name: t.name,
    city: t.city,
    arena: t.arena,
    strength: t.name === "Turmio" ? 200 : 100,
    domestic: true,
    morale: 0,
    strategy: 2,
    readiness: 0,
    effects: [],
    opponentEffects: []
  })),
  ...ehlForeign.map((t, i) => ({
    id: i,
    uid: createUniqueId(),
    name: t.name,
    city: t.city,
    arena: t.arena,
    strength:
      FOREIGN_PLACEHOLDER_STRENGTHS[i % FOREIGN_PLACEHOLDER_STRENGTHS.length],
    domestic: false,
    morale: 0,
    strategy: 2,
    readiness: 0,
    effects: [],
    opponentEffects: []
  })),
  // Finnish amateur clubs (TEAMS.ALA) at ids 118..133. They participate
  // only in the Pekkalan Cup first round (16 first-round bye-fodder teams).
  ...amateurs.map((t, i) => ({
    id: i,
    uid: createUniqueId(),
    name: t.name,
    city: t.city,
    arena: t.arena,
    strength: 50,
    domestic: true,
    morale: 0,
    strategy: 2,
    readiness: 0,
    effects: [],
    opponentEffects: []
  }))
];

export const createDefaultGameContext = (): GameContext => ({
  // game
  turn: { season: 0, round: 0, phase: undefined },
  flags: {
    jarko: false,
    usa: false,
    canada: false,
    haanperaMarried: false,
    mauto: false,
    psycho: undefined
  },
  serviceBasePrices: {
    insurance: 1000,
    coach: 3200,
    microphone: 500,
    cheer: 3000
  },

  // ⚠️ MUST be a fresh array reference (spread/slice), NOT the imported
  // singleton `managerDefs`. Stately Inspector dedupes shared object refs
  // across the snapshot — when it encounters the same array a second time
  // it stubs items as `"[...]"` and the UI breaks with "invalid state".
  // Empirically: any of `[...managerDefs]`, `managerDefs.slice()` works;
  // bare `managerDefs` does not. Position in the context object also
  // matters with the bare ref (last is least-bad), but a fresh ref makes
  // position irrelevant. See AGENTS.md for the bisect.
  managers: managerDefs.map((def, i) => managerFromDefinition(def, i)),

  competitions: Object.fromEntries(
    entries(competitionList).map(([key, def]) => [
      key,
      // structuredClone (vs `{ ...def.data }`) gives a deep copy so that
      // nested arrays like `teams: number[]` are fresh refs, not aliases
      // back to the imported singleton. Same Stately Inspector dedup
      // gotcha as `managers` above — kill it preemptively.
      structuredClone(def.data)
    ])
  ) as Record<CompetitionId, Competition>,

  teams: seedTeams(),

  worldChampionshipResults: undefined,

  manager: { active: undefined, managers: [] },

  // betting — parlay + championship bet actors plus the transient
  // last-round coupon used to bridge `executeGameday` and `resolveParlayBets`.
  betting: {
    parlayBets: [],
    championBets: [],
    lastLeagueCoupon: undefined
  },

  // event
  event: { events: {} },

  // news
  news: { news: [], announcements: {} },

  // notification
  notification: { notifications: [] },

  // prank
  prank: { pranks: [] },

  // stats
  stats: {
    managers: {},
    currentSeason: undefined,
    seasons: [],
    streaks: { team: {}, manager: {} }
  },

  // invitation
  invitation: { invitations: [] },

  // country
  country: {
    countries: values(countryList).reduce(
      (acc, country) => {
        acc[country.iso] = {
          iso: country.iso,
          name: country.name,
          series: country.series,
          level: country.level,
          strength: country.strength()
        };
        return acc;
      },
      {} as Record<string, Country>
    )
  }
});

//
