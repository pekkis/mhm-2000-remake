/**
 * Default factory for a fresh `GameContext`.
 *
 * Mirrors the per-duck `defaultState` values currently scattered across
 * `src/ducks/*`. Used as the initial `context` of `gameMachine` and as
 * the reset target on quit-to-menu.
 *
 * Some defaults call into pure functions that read `Random` (team
 * strengths, country strengths). That keeps existing behavior; the
 * deterministic seed mechanism (`VITE_RANDOM_SEED`) still works.
 */

import { entries, fromEntries, values } from "remeda";

import { teams as managedTeamDefs } from "@/data/mhm2000/teams";
import {
  foreignTeams as foreignLightTeams,
  amateurTeams as amateurLightTeams,
  nhlTeams
} from "@/data/mhm2000/light-teams";
import managerDefs, { PIER_PAOLO_PROXY_PASOLINI_INDEX } from "@/data/managers";
import competitionList from "@/data/competitions";
import { countries as countryList } from "@/data/countries";

import type { GameContext } from "./game-context";
import type { Country } from "./country";
import type { GameTurn, Team } from "./game";
import type { Competition, CompetitionId } from "@/types/competitions";
import { managerFromDefinition } from "@/services/manager";
import { createUniqueId } from "@/services/id";
import { rollTeamStrength } from "@/services/levels";
import {
  initialBudgetForAmateurTeams,
  initialBudgetForEliteForeignTeams,
  initialBudgetForRankings,
  initialServicesForAmateurTeams,
  initialServicesForEliteForeignTeams,
  initialServicesForRankings
} from "@/data/mhm2000/budget";

import random from "@/services/random";
import { emptySeasonStat } from "@/services/empties";
import type { CompletedSeasonStats } from "@/state/stats";

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
const nhlers = nhlTeams;

const seedTeams = (): Team[] => {
  const seedables = [
    ...phlSource.map((t) => ({
      uid: createUniqueId(),
      name: t.name,
      city: t.city,
      arena: t.arena,
      domestic: true,
      morale: 0,
      strategy: 2,
      readiness: 0,
      effects: [],
      tags: t.tags,
      tier: t.tier,
      previousRankings: t.previousRankings,
      services: initialServicesForRankings(t.previousRankings),
      budget: initialBudgetForRankings(t.previousRankings),
      nationality: t.nationality
    })),
    ...divisioonaSource.map((t) => ({
      uid: createUniqueId(),
      name: t.name,
      city: t.city,
      arena: t.arena,
      domestic: true,
      morale: 0,
      strategy: 2,
      readiness: 0,
      effects: [],
      tags: t.tags,
      tier: t.tier,
      previousRankings: t.previousRankings,
      services: initialServicesForRankings(t.previousRankings),
      budget: initialBudgetForRankings(t.previousRankings),
      nationality: t.nationality
    })),
    ...mutasarjaSource.map((t) => ({
      uid: createUniqueId(),
      name: t.name,
      city: t.city,
      arena: t.arena,
      domestic: true,
      morale: 0,
      strategy: 2,
      readiness: 0,
      effects: [],
      tags: t.tags,
      tier: t.tier,
      previousRankings: t.previousRankings,
      services: initialServicesForRankings(t.previousRankings),
      budget: initialBudgetForRankings(t.previousRankings),
      nationality: t.nationality
    })),
    ...ehlForeign.map((t) => ({
      uid: createUniqueId(),
      name: t.name,
      city: t.city,
      arena: t.arena,
      domestic: false,
      morale: 0,
      strategy: 2,
      readiness: 0,
      effects: [],
      tags: t.tags,
      tier: t.tier,
      previousRankings: undefined,
      services: initialServicesForEliteForeignTeams(),
      budget: initialBudgetForEliteForeignTeams(),
      nationality: t.nationality
    })),
    // Finnish amateur clubs (TEAMS.ALA) at ids 118..133. They participate
    // only in the PA Cup first round (16 first-round bye-fodder teams).
    ...amateurs.map((t) => ({
      uid: createUniqueId(),
      name: t.name,
      city: t.city,
      arena: t.arena,
      domestic: true,
      morale: 0,
      strategy: 2,
      readiness: 0,
      effects: [],
      tags: t.tags,
      tier: t.tier,
      previousRankings: undefined,
      services: initialServicesForAmateurTeams(),
      budget: initialBudgetForAmateurTeams(),
      nationality: t.nationality
    })),
    // NHL clubs
    ...nhlers.map((t) => ({
      uid: createUniqueId(),
      name: t.name,
      city: t.city,
      arena: t.arena,
      domestic: true,
      morale: 0,
      strategy: 2,
      readiness: 0,
      effects: [],
      tags: t.tags,
      tier: t.tier,
      previousRankings: undefined,
      services: initialServicesForEliteForeignTeams(),
      budget: initialBudgetForEliteForeignTeams(),
      nationality: t.nationality
    }))
  ];

  return seedables.map((seedable, id) => {
    return {
      ...seedable,
      id,
      kind: "ai",
      strengthObj: rollTeamStrength(seedable.tier),
      intensity: 1,
      fixMatch: false,
      arenaFund: 0,
      seasonTickets: 0,
      arenaProject: undefined,
      mailbox: {}
    } satisfies Team;
  });
};

export const createDefaultGameContext = (): GameContext => {
  const teams = seedTeams();

  const teamByName = (name: string, city?: string): number => {
    const team = teams.find(
      (t) => t.name === name && (!city || t.city === city)
    );
    if (!team) {
      throw new Error(`Unknown team: ${name}`);
    }
    return team.id;
  };

  // Synthetic history from QB `historia` SUB (MHM2K.BAS:1167-1201).
  // Three pre-seeded seasons visible in tilastokeskus at game start.
  // presidentsTrophy = real SM-liiga regular season winner (Harry Lindblad
  // memorial trophy), sourced from Wikipedia season standings.
  const seasons: CompletedSeasonStats[] = [
    {
      season: 1997,
      medalists: [teamByName("Jokerit"), teamByName("TPS"), teamByName("HPK")],
      ehlChampion: teamByName("Jokerit"),
      presidentsTrophy: teamByName("Jokerit"),
      promoted: { mutasarja: [], division: [] },
      relegated: { phl: [], division: [] },
      worldChampionships: [],
      stories: {}
    },
    {
      season: 1998,
      medalists: [
        teamByName("HIFK"),
        teamByName("Ilves"),
        teamByName("Jokerit")
      ],
      ehlChampion: teamByName("Feldkirch"),
      presidentsTrophy: teamByName("TPS"),
      promoted: { mutasarja: [], division: [] },
      relegated: { phl: [], division: [] },
      worldChampionships: [],
      stories: {}
    },
    {
      season: 1999,
      medalists: [teamByName("TPS"), teamByName("HIFK"), teamByName("HPK")],
      ehlChampion: teamByName("Dynamo", "Moskova"),
      presidentsTrophy: teamByName("TPS"),
      promoted: { mutasarja: [], division: [teamByName("Pelicans")] },
      relegated: { phl: [teamByName("KalPa")], division: [] },
      worldChampionships: [],
      stories: {}
    }
  ];

  const ctx = {
    // game
    turn: {
      season: 2000,
      round: 0,
      activeManagers: [],
      activeTeams: []
    } satisfies GameTurn,
    flags: {
      jarko: false,
      usa: false,
      canada: false,
      haanperaMarried: false,
      mauto: false,
      psycho: undefined
    },

    // ⚠️ MUST be a fresh array reference (spread/slice), NOT the imported
    // singleton `managerDefs`. Stately Inspector dedupes shared object refs
    // across the snapshot — when it encounters the same array a second time
    // it stubs items as `"[...]"` and the UI breaks with "invalid state".
    // Empirically: any of `[...managerDefs]`, `managerDefs.slice()` works;
    // bare `managerDefs` does not. Position in the context object also
    // matters with the bare ref (last is least-bad), but a fresh ref makes
    // position irrelevant. See AGENTS.md for the bisect.
    managers: fromEntries(
      managerDefs.map((def) => {
        const manager = managerFromDefinition(def);
        return [manager.id, manager];
      })
    ),

    competitions: Object.fromEntries(
      entries(competitionList).map(([key, def]) => [
        key,
        // structuredClone (vs `{ ...def.data }`) gives a deep copy so that
        // nested arrays like `teams: number[]` are fresh refs, not aliases
        // back to the imported singleton. Same Stately Inspector dedup
        // gotcha as `managers` above — kill it preemptively.
        { ...structuredClone(def.data), meta: {} }
      ])
    ) as Record<CompetitionId, Competition>,

    teams,

    worldChampionshipResults: undefined,

    transferMarket: { players: {} },

    mail: { mailbox: {} },

    human: { active: undefined, order: [] },

    // betting — parlay bet actor plus the transient
    // last-round coupon used to bridge `executeGameday` and `resolveParlayBets`.
    betting: {
      parlayBets: [],
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
      currentSeason: emptySeasonStat(),
      seasons,
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
  };

  const managers = values(ctx.managers);

  // Pier Paolo Proxy Pasolini stands in for the absent manager of every
  // light team (NHL / European / amateur). Faithful port of QB's shared
  // zero-row `mtaito(*, 0)` behavior \u2014 same singleton, many teams.
  // See `src/data/managers.ts` for the longer rationale.
  const pasolini = managers.find((m) => m.tags.includes("proxy"));
  if (!pasolini) {
    throw new Error(
      `Pier Paolo Proxy Pasolini missing from managers (expected at raw index ${PIER_PAOLO_PROXY_PASOLINI_INDEX}).`
    );
  }

  const simonov = managers.find((m) => m.tags.includes("match_with_karpat"));
  if (!simonov) {
    throw new Error("Simonov not found in managers");
  }

  const shuffleableManagers = managers.filter(
    (m) => m.id !== simonov.id && m.id !== pasolini.id
  );

  random.shuffle(shuffleableManagers);

  for (let x = 0; x < ctx.teams.length; x = x + 1) {
    if (ctx.teams[x].tags.includes("light")) {
      ctx.teams[x].manager = pasolini.id;
      // Intentionally do NOT write `pasolini.team` — he proxies dozens of
      // light teams; a single back-pointer would be a lie. Consumers that
      // need "which teams does this manager run" should reverse-lookup
      // through `team.manager`.
    } else {
      const manager = shuffleableManagers.shift();

      if (!manager) {
        throw new Error("Ran out of managers!");
      }

      if (ctx.teams[x].name === "Kärpät") {
        ctx.teams[x].manager = simonov.id;
        continue;
      }

      ctx.teams[x].manager = manager.id;
      manager.team = x;
    }
  }

  return ctx;
};

//
