/**
 * Manager experience archetypes — the "MANAGERINA OLET..." picker on the
 * second page of `valitsekansallisuus` (`MHM2K.BAS:2370-2382`).
 *
 * Three options: rookie / mid-career / legend. The choice prefills the
 * QB arrays `otte()`, `vsaldo()`, `saav()` (`MHM2K.BAS:2384-2438`),
 * which downstream feed the `sin1` strength score that gates which
 * teams the manager may pick (`MHM2K.BAS:1842-1868`).
 *
 * QB shape recap:
 *   otte(competition, 1=games | 2=playoffs, manager)
 *   vsaldo(competition, 1=wins | 2=ties | 3=losses, manager)
 *   saav(achievementType, manager)
 *
 * Competition index (1..4):
 *   1 = PHL
 *   2 = Divisioona
 *   3 = Mutasarja
 *   4 = EHL (only the legend has any EHL history)
 *
 * Achievement index (1..7) — see `saav()` in VARIABLES.md:
 *   1 = SM gold, 2 = silver, 3 = bronze, 4 = EHL title,
 *   5 = promotion, 6 = relegation, 7 = cup win
 *
 * We don't yet write these into `StatsState` because the modern stats
 * shape doesn't 1:1 map to QB's pre-game prefill arrays. The wizard
 * stores the chosen experience id on the manager (so future stats /
 * history reconstruction can replay it), and the verbatim QB numbers
 * stay here for that future replay.
 */

import type { CompetitionId } from "@/types/competitions";

export type ManagerExperienceId = "rookie" | "veteran" | "legend";

/**
 * Per-competition prefilled record. `playoffs` mirrors `otte(c, 2, pv)` —
 * how many of those games were playoff games.
 *
 * `GamesPlayedStats` phase convention (PHL / Divisioona / Mutasarja):
 *   phase 0  = regular season
 *   phase 1+ = playoffs
 *
 * When implementing `sin1` at runtime:
 *   otte(c, 1) = sum of all phases (0 + 1 + 2 + …)
 *   otte(c, 2) = sum of phases 1+ (playoff games only)
 *   vsaldo(c, *) = phase 0 only (regular-season W/T/L for the win-rate modifier)
 */
export type ExperienceCompetitionRecord = {
  games: number;
  playoffs: number;
  wins: number;
  ties: number;
  losses: number;
};

export type ManagerExperience = {
  id: ManagerExperienceId;
  /** Verbatim Finnish label from MHM2K.BAS:2373/2375/2377. */
  name: string;
  /** Non-canon English short description for the UI. */
  description: string;
  /** Per-competition prefilled history. Keys are `CompetitionId`. */
  history: Partial<Record<CompetitionId, ExperienceCompetitionRecord>>;
  /**
   * Pre-game medal cabinet, indexed 1..7 to match QB's `saav(*, pv)`.
   * Only nonzero entries are included.
   */
  achievements: Partial<Record<1 | 2 | 3 | 4 | 5 | 6 | 7, number>>;
};

// QB "season length" used to expand `44 * N` into a `games` count.
const SEASON_GAMES = 44;

export const managerExperiences: readonly ManagerExperience[] = [
  {
    id: "rookie",
    name: "UUSI KASVO",
    description: "Ei aikaisempaa managerikokemusta.",
    history: {},
    achievements: {}
  },
  {
    id: "veteran",
    name: "KOKENUT KONKARI",
    description: "Muutaman kauden takana, palkintokaapissa pari mitalia.",
    // MHM2K.BAS:2387-2407
    history: {
      phl: {
        games: SEASON_GAMES * 4,
        playoffs: 16,
        wins: 74,
        ties: 17,
        losses: 85
      },
      division: {
        games: SEASON_GAMES * 3,
        playoffs: 20,
        wins: 83,
        ties: 8,
        losses: 41
      },
      mutasarja: {
        games: SEASON_GAMES * 2,
        playoffs: 16,
        wins: 59,
        ties: 6,
        losses: 23
      }
    },
    achievements: {
      // saav(3) = 1 (one SM bronze), saav(5) = 2 (two promotions)
      3: 1,
      5: 2
    }
  },
  {
    id: "legend",
    name: "ELÄVÄ LEGENDA",
    description: "Pekkalandian managerien kummisetä, kaapissa kaikki.",
    // MHM2K.BAS:2409-2436
    history: {
      phl: {
        games: SEASON_GAMES * 15,
        playoffs: 93,
        wins: 343,
        ties: 84,
        losses: 233
      },
      division: {
        games: SEASON_GAMES * 3,
        playoffs: 20,
        wins: 83,
        ties: 8,
        losses: 41
      },
      mutasarja: {
        games: SEASON_GAMES * 2,
        playoffs: 16,
        wins: 59,
        ties: 6,
        losses: 23
      },
      ehl: {
        games: 48,
        playoffs: 3,
        // QB doesn't write `vsaldo(4, *, pv)` for the legend — EHL record
        // stays at 0/0/0 even though `otte(4, *, pv)` is set. Verbatim.
        wins: 0,
        ties: 0,
        losses: 0
      }
    },
    achievements: {
      // saav(1) = 3 (golds), saav(2) = 3 (silvers), saav(3) = 2 (bronzes),
      // saav(4) = 1 (EHL title), saav(5) = 2 (promotions)
      1: 3,
      2: 3,
      3: 2,
      4: 1,
      5: 2
    }
  }
] as const;

export const managerExperienceById = (
  id: ManagerExperienceId
): ManagerExperience => {
  const found = managerExperiences.find((e) => e.id === id);
  if (!found) {
    throw new Error(`Unknown manager experience id: ${id}`);
  }
  return found;
};
