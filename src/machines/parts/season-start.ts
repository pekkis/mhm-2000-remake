import type { Draft } from "immer";
import { values } from "remeda";

import type { GameContext } from "@/state";
import difficultyLevels from "@/data/difficulty-levels";
import {
  forcedStrategyForManager,
  initialReadinessFor
} from "@/data/mhm2000/strategies";
import {
  distributeAIStrategies,
  STRATEGY_COMPETITION_IDS
} from "@/services/strategy";
import random from "@/services/random";
import { emptySeasonStat } from "@/services/empties";
import { rollTeamStrength } from "@/services/levels";

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

  // Reset per-team season state.
  //
  // Strategy + readiness defaults: TASAINEN PUURTO (`valm = 3`) is the
  // safe baseline for non-Finnish-league teams. The QB original picks
  // AI strategies in a separate pass right after this for PHL /
  // Divisioona / Mutasarja AI teams (ILEZ5.BAS:1990-2046, the
  // proxy/`mahd` distribution — see `services/strategy.ts`). Tagged
  // managers (Simonov, Pier Paolo proxy) get their hard-coded pick.
  // Human managers later overwrite via `selectStrategy` from the UI.
  //
  // QB cross-ref: `SUB tremaar` (ILEX5.BAS:7458-7464) writes the
  // initial `tre()` based on the chosen `valm`.
  for (const t of draft.teams) {
    if (!t.manager) {
      throw new Error("Managerless team");
    }

    t.effects = [];
    t.opponentEffects = [];

    const manager = draft.managers[t.manager];

    t.morale = manager.attributes.resourcefulness;

    const strategy = forcedStrategyForManager(manager.tags) ?? 3;
    t.strategy = strategy;

    t.readiness = initialReadinessFor(strategy, manager.attributes.strategy);

    if (t.kind === "ai") {
      t.strengthObj = rollTeamStrength(t.tier);
    }
  }

  // AI strategy distribution — port of QB `SUB valitsestrattie`
  // (MHM2K.BAS:2470-2503 / ILEZ5.BAS:1990-2034). Loops PHL /
  // Divisioona / Mutasarja, computes per-competition strength
  // averages over AI teams only, then rolls each AI team's `valm`
  // from the `mahd()` weighted lottery. Forced-strategy managers
  // (Simonov, Pasolini-proxied light teams) keep their tag-driven
  // pick — `distributeAIStrategies` honours that internally.
  for (const competitionId of STRATEGY_COMPETITION_IDS) {
    const competition = draft.competitions[competitionId];

    // Only AI-managed teams participate in the QB roll
    // (`IF ohj(x(xx)) = 0 THEN ...` skips human-controlled teams).
    const aiTeams = competition.teams
      .map((idx) => draft.teams[idx])
      .filter((team) => team.kind === "ai");

    const picks = distributeAIStrategies(aiTeams, draft.managers, random);

    for (const [teamId, strategy] of picks) {
      const team = draft.teams[teamId];
      if (!team) {
        continue;
      }
      team.strategy = strategy;
      const manager = team.manager ? draft.managers[team.manager] : undefined;
      team.readiness = initialReadinessFor(
        strategy,
        manager!.attributes.strategy
      );
    }
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
      if (manager.kind === "human") {
        if (manager.services.insurance) {
          manager.insuranceExtra -= 50 * manager.arena.level;
        }

        manager.extra = difficultyLevels[manager.difficulty].extra;
      }
    }
  }

  // Initialize currentSeason for stats accumulation. Saga side did
  // this via the SEASON_START reducer in stats.ts.
  draft.stats.currentSeason = emptySeasonStat();
}
