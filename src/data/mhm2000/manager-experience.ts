/**
 * Manager experience archetypes — the "MANAGERINA OLET..." picker on the
 * second page of `valitsekansallisuus` (`MHM2K.BAS:2370-2382`).
 *
 * Three options: rookie / mid-career / legend. The choice prefills the
 * QB arrays `otte()`, `vsaldo()`, `saav()` (`MHM2K.BAS:2384-2438`),
 * which downstream feed the `sin1` strength score that gates which
 * teams the manager may pick (`MHM2K.BAS:1842-1868` / `ILEZ5.BAS:1133`).
 *
 * QB shape recap:
 *   otte(competition, 1=games | 2=playoffs, manager)
 *   vsaldo(competition, 1=wins | 2=ties | 3=losses, manager)
 *   saav(achievementType, manager)
 *
 * Competition index (1..4):
 *   1 = PHL          → `phl`
 *   2 = Divisioona   → `division`
 *   3 = Mutasarja    → `mutasarja`
 *   4 = EHL          → `ehl` (only the legend has any EHL history)
 *
 * Achievement index (1..7) — see `saav()` in VARIABLES.md:
 *   1 = SM gold      → `gold`
 *   2 = silver       → `silver`
 *   3 = bronze       → `bronze`
 *   4 = EHL title    → `ehl`
 *   5 = promotion    → `promoted`
 *   6 = relegation   → `relegated`
 *   7 = cup win      → `cup`
 *
 * The pre-fill is shaped directly as the modern `Manager.stats` blob, so
 * the `sin1` algorithm doesn't care whether it's reading a freshly-built
 * preset or a manager mid-career — same code path, same data shape.
 *
 * Phase convention (`GamesPlayedStats[competition][phase]`):
 *   phase 0  = regular season
 *   phase 1+ = playoff rounds (we collapse all playoff appearances into a
 *              single phase 1 here, since QB pre-fills don't separate
 *              quarters / semis / finals)
 *
 * Mapping QB pre-fill → phases:
 *   regular-season W/T/L = vsaldo(c, *) (with the playoff games' L deducted)
 *   playoff games        = otte(c, 2), distributed as all-losses (faithful
 *                          to QB which never tracks playoff W/T/L per
 *                          competition for sin1 purposes)
 *
 * The "playoffs are losses" fudge is harmless for `sin1` (which only sums
 * games and reads vsaldo as a total). It does mean that if we ever surface
 * a per-phase career table in the UI, the legend's preset PHL playoff line
 * will read 0/0/93 — which is exactly the level of fidelity QB itself ships.
 */

import type { CompetitionId } from "@/types/competitions";
import type { AchievementsStat, GamesPlayedStats } from "@/state/game";

export type ManagerExperienceId = "rookie" | "veteran" | "legend";

export type ManagerExperience = {
  id: ManagerExperienceId;
  /** Verbatim Finnish label from MHM2K.BAS:2373/2375/2377. */
  name: string;
  /** Non-canon English short description for the UI. */
  description: string;
  /**
   * Pre-filled `Manager.stats` for this archetype. Drop straight into a
   * fresh `HumanManager.stats` at game-build time.
   */
  stats: { games: GamesPlayedStats; achievements: AchievementsStat };
};

const SEASON_GAMES = 44;

const emptyAchievements = (): AchievementsStat => ({
  gold: 0,
  silver: 0,
  bronze: 0,
  ehl: 0,
  cup: 0,
  promoted: 0,
  relegated: 0
});

/**
 * Build a per-competition `Record<phase, GameRecord>` from QB pre-fill totals.
 *
 * `playoffs` games are stuffed into phase 1 as pure losses (see file header).
 * Phase 0 carries the rest, with W/T preserved verbatim from the QB pre-fill
 * and L reduced so that `phase0.win + phase0.draw + phase0.loss = totalGames - playoffs`.
 *
 * `_totalGames` is kept in the signature for documentation symmetry with the
 * QB pre-fill (`otte(c, 1) = wins + ties + losses` already, so the param is
 * redundant — passed in for readability against the source-call sites).
 */
const buildCompetitionRecord = (
  _totalGames: number,
  playoffGames: number,
  totalWins: number,
  totalTies: number,
  totalLosses: number
): Record<number, { win: number; draw: number; loss: number }> => {
  const regularLosses = totalLosses - playoffGames;
  const out: Record<number, { win: number; draw: number; loss: number }> = {
    0: {
      win: totalWins,
      draw: totalTies,
      loss: regularLosses < 0 ? 0 : regularLosses
    }
  };
  if (playoffGames > 0) {
    out[1] = { win: 0, draw: 0, loss: playoffGames };
  }
  return out;
};

/**
 * EHL pre-fill is special: QB sets `otte(4, *)` but never `vsaldo(4, *)`.
 * To preserve the game-count contribution to `sin1` we have to bottle the
 * games somewhere in our W/T/L-strict shape — we use all-losses, same fudge
 * as the regular playoff side.
 */
const buildEhlRecord = (
  totalGames: number,
  playoffGames: number
): Record<number, { win: number; draw: number; loss: number }> => ({
  0: { win: 0, draw: 0, loss: totalGames - playoffGames },
  1: { win: 0, draw: 0, loss: playoffGames }
});

const veteranStats: {
  games: GamesPlayedStats;
  achievements: AchievementsStat;
} = {
  games: {
    // MHM2K.BAS:2387-2407
    phl: buildCompetitionRecord(SEASON_GAMES * 4, 16, 74, 17, 85),
    division: buildCompetitionRecord(SEASON_GAMES * 3, 20, 83, 8, 41),
    mutasarja: buildCompetitionRecord(SEASON_GAMES * 2, 16, 59, 6, 23)
  },
  achievements: {
    ...emptyAchievements(),
    // saav(3) = 1 (one SM bronze), saav(5) = 2 (two promotions)
    bronze: 1,
    promoted: 2
  }
};

const legendStats: { games: GamesPlayedStats; achievements: AchievementsStat } =
  {
    games: {
      // MHM2K.BAS:2409-2436
      phl: buildCompetitionRecord(SEASON_GAMES * 15, 93, 343, 84, 233),
      division: buildCompetitionRecord(SEASON_GAMES * 3, 20, 83, 8, 41),
      mutasarja: buildCompetitionRecord(SEASON_GAMES * 2, 16, 59, 6, 23),
      ehl: buildEhlRecord(48, 3)
    },
    achievements: {
      ...emptyAchievements(),
      // saav(1) = 3 (golds), saav(2) = 3 (silvers), saav(3) = 2 (bronzes),
      // saav(4) = 1 (EHL title), saav(5) = 2 (promotions)
      gold: 3,
      silver: 3,
      bronze: 2,
      ehl: 1,
      promoted: 2
    }
  };

export const managerExperiences: readonly ManagerExperience[] = [
  {
    id: "rookie",
    name: "UUSI KASVO",
    description: "Ei aikaisempaa managerikokemusta.",
    stats: { games: {}, achievements: emptyAchievements() }
  },
  {
    id: "veteran",
    name: "KOKENUT KONKARI",
    description: "Muutaman kauden takana, palkintokaapissa pari mitalia.",
    stats: veteranStats
  },
  {
    id: "legend",
    name: "ELÄVÄ LEGENDA",
    description: "Pekkalandian managerien kummisetä, kaapissa kaikki.",
    stats: legendStats
  }
];

export const managerExperienceById = (
  id: ManagerExperienceId
): ManagerExperience => {
  const found = managerExperiences.find((e) => e.id === id);
  if (!found) {
    throw new Error(`Unknown manager experience id: ${id}`);
  }
  return found;
};

// Re-export so callers don't need to dig into `@/types/competitions` just to
// destructure the keys we use here.
export type { CompetitionId };
