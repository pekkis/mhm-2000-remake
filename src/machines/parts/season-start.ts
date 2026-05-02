import type { Draft } from "immer";
import { values } from "remeda";

import type { GameContext } from "@/state";
import { managersMainCompetition } from "@/machines/selectors";
import difficultyLevels from "@/data/difficulty-levels";
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

  // Re-strength European teams (indices 24+). Hardcoded to 100 during
  // the MHM 2000 transplant — proper per-team strength roll lands when
  // the new attribute model is wired in.
  for (let i = 24; i < draft.teams.length; i++) {
    draft.teams[i].strength = 100;
  }

  // Reset per-team season state.
  for (const t of draft.teams) {
    t.effects = [];
    t.opponentEffects = [];
    t.morale = 0;
    t.strategy = 2;
    t.readiness = 0;
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
  for (const manager of values(draft.manager.managers)) {
    if (season > 0) {
      const team = draft.teams[manager.team!];
      const mainCompetition = managersMainCompetition(manager.id)(
        draft as GameContext
      );
      const salaryPerStrength =
        difficultyLevels[manager.difficulty].salary(mainCompetition);
      manager.balance -= salaryPerStrength * team.strength;

      if (manager.services.insurance) {
        manager.insuranceExtra -= 50 * manager.arena.level;
      }
    }

    manager.extra = difficultyLevels[manager.difficulty].extra;
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
