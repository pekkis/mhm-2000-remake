import type { Draft } from "immer";
import { values } from "remeda";

import type { GameContext } from "@/state";
import { managersMainCompetition } from "@/machines/selectors";
import difficultyLevels from "@/data/difficulty-levels";
import {
  forcedStrategyForManager,
  initialReadinessFor,
  type StrategyId
} from "@/data/mhm2000/strategies";
import random from "@/services/random";

/**
 * Per-team and per-manager bookkeeping plus competition reset run on
 * entry to the start-of-season phase. Fully replaces the legacy
 * `seasonStart()` saga + the per-competition `start()` sagas + the
 * `seasonStart` reducer.
 *
 * The competition-specific bits (PHL/division do nothing; tournaments
 * clear teams; EHL picks medalists+foreign and shuffles) are inlined
 * here — this is MHM 97 game logic, not something competitions should
 * own.
 *
 * Mutates `draft` in place — call it from inside an `assign(produce(...))`
 * pass.
 */
export function runSeasonStart(draft: Draft<GameContext>): void {
  const season = draft.turn.season;

  // Re-strength foreign teams (slots 48+ after the MHM 2000 transplant).
  // Cycled across [230, 180, 150] so all three tournament filter buckets
  // (>200, 150..225, <=175) keep finding plenty of candidates each season.
  // Real per-roster attribute model lands later.
  const FOREIGN_PLACEHOLDER_STRENGTHS = [230, 180, 150];
  for (let i = 48; i < draft.teams.length; i++) {
    draft.teams[i].strength =
      FOREIGN_PLACEHOLDER_STRENGTHS[
        (i - 48) % FOREIGN_PLACEHOLDER_STRENGTHS.length
      ];
  }

  // Reset per-team season state.
  //
  // Strategy + readiness defaults: TASAINEN PUURTO (`valm = 3`) is the
  // safe baseline. The QB original picks AI strategies in a separate
  // pass right after this (ILEZ5.BAS:1990-2046, the proxy/mahd
  // distribution). We don't yet port that distribution — for now,
  // every AI team that isn't tagged with a forced `strategy:*` value
  // stays on Tasainen. Tagged managers (Simonov, Pier Paolo proxy)
  // get their hard-coded pick. Human managers later overwrite via
  // `selectStrategy` from the UI.
  //
  // QB cross-ref: `SUB tremaar` (ILEX5.BAS:7458-7464) writes the
  // initial `tre()` based on the chosen `valm`.
  for (const t of draft.teams) {
    t.effects = [];
    t.opponentEffects = [];
    t.morale = 0;

    const manager = t.manager ? draft.managers[t.manager] : undefined;
    const forced = manager
      ? forcedStrategyForManager(manager.tags)
      : undefined;
    const strategy: StrategyId = forced ?? 3;
    t.strategy = strategy;
    t.readiness = initialReadinessFor(
      strategy,
      manager?.attributes.strategy ?? 0
    );
  }

  draft.flags.jarko = false;

  // Reset every competition.
  for (const comp of values(draft.competitions)) {
    comp.phase = -1;
    comp.phases = [];
  }

  // Tournaments: start with no teams; the seed phase fills them in.
  draft.competitions.tournaments.teams = [];

  // EHL: previous season's medalists (or the seeded default first season)
  // plus 17 foreign teams, shuffled.
  const ehlSeeds = draft.stats.seasons[season - 1]?.medalists ?? [2, 3, 5];
  const foreignIds = draft.teams.slice(48, 48 + 17).map((t) => t.id);
  draft.competitions.ehl.teams = [...ehlSeeds, ...foreignIds].toSorted(
    () => random.real(1, 10000) - 5000
  );

  // Per-manager: salary, insurance extra (skipped season 0), reset extra.
  for (const manager of values(draft.managers)) {
    if (season > 0) {
      const team = draft.teams[manager.team!];
      const mainCompetition = managersMainCompetition(manager.id)(
        draft as GameContext
      );

      if (manager.kind === "human") {
        const salaryPerStrength =
          difficultyLevels[manager.difficulty].salary(mainCompetition);
        manager.balance -= salaryPerStrength * team.strength;

        if (manager.services.insurance) {
          manager.insuranceExtra -= 50 * manager.arena.level;
        }

        manager.extra = difficultyLevels[manager.difficulty].extra;
      }
    }
  }

  // Initialize currentSeason for stats accumulation. Saga side did
  // this via the SEASON_START reducer in stats.ts.
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
