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

import teamDefs from "@/data/teams";
import managerDefs from "@/data/managers";
import competitionList from "@/data/competitions";
import { countries as countryList } from "@/data/countries";

import type { GameContext } from "./game-context";
import type { Country } from "./country";
import type { Competition, CompetitionId } from "@/types/competitions";

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
  managers: [...managerDefs],

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
  teams: teamDefs.map((t) => ({
    id: t.id,
    name: t.name,
    strength: t.strength(),
    domestic: t.domestic,
    morale: 0,
    strategy: 2,
    readiness: 0,
    effects: [],
    opponentEffects: []
  })),

  worldChampionshipResults: undefined,

  manager: { active: undefined, managers: {} },

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
          strength: country.strength()
        };
        return acc;
      },
      {} as Record<string, Country>
    )
  }
});

//
