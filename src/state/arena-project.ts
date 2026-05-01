import type { Arena } from "@/data/mhm2000/teams";
import type { BuildRank } from "@/services/arena";

/**
 * In-flight arena construction project for a manager — port of the QB
 * per-manager scratch state at `MHM2K.BAS:432-438`:
 *
 * - `uppiste(pv)`, `utaso(pv)`, `upaikka(1..3, pv)` — the planned arena
 *   that will replace the team's current arena once construction completes.
 *   Captured here as a single `target: Arena` snapshot.
 * - `arkkitehti(pv)`, `rakennuttaja(pv)` — chosen architect / builder rank.
 * - `uhatapa(pv)` — magic number encoding **both** the project kind and
 *   the rounds remaining. Decremented by 1 each gameday; project resolves
 *   when it hits the kind's base value:
 *     0          = no project active (modelled here as `project: undefined`)
 *     2001..2030 = renovate, base 2000 → rounds remaining = uhatapa - 2000
 *     1001..1090 = build (after permit granted), base 1000 → uhatapa - 1000
 *     10..100    = build, permit-pending stage; advanced by `arkkitehti`
 *                  per round in `rstages` (`ILEX5.BAS:5451-5454`) until ≥
 *                  100, then a permit roll either resets to 10 (denied) or
 *                  jumps to 1090/1080/1070 (granted, builder 1/2/3)
 *   Initial round counts:
 *     renovate: 30/25/20 (builder rank 1/2/3, `ILES5.BAS:539`)
 *     build:    90/80/70 (builder rank 1/2/3, `ILEX5.BAS:5478`)
 * - `mpv(pv)` — per-round payment in € (`LONG`). Deducted from `potti`
 *   each gameday at `ILEX5.BAS:5485`. Computed as `qbCint(total / rounds)`
 *   when the project starts (renovate) or when the permit is granted
 *   (build).
 *
 * `architect` is only meaningful for `kind: "build"` — renovation never
 * shows the architect picker (`ILES5.BAS:381`) and skips the architect
 * multiplier (`ILES5.BAS:467-469`). Modelled as a discriminated union to
 * make that impossible to misuse from TypeScript.
 *
 * The build-permit stage is folded into `kind: "build"` with a separate
 * `permitGranted` flag rather than a third variant; the variant explosion
 * isn't worth it for one boolean.
 */
export type ManagerArenaProject =
  | {
      kind: "renovate";
      builder: BuildRank;
      /** Gamedays remaining until completion. */
      roundsRemaining: number;
      /** Per-round payment in €. */
      roundPayment: number;
      /** Snapshot of the arena that will replace the current one. */
      target: Arena;
    }
  | {
      kind: "build";
      architect: BuildRank;
      builder: BuildRank;
      /** False during the building-permit stage; true once approved. */
      permitGranted: boolean;
      /**
       * Permit-pending: progress 10..100, advanced by `architect` rank
       * each round (faster architects clear paperwork sooner).
       * Construction-active: gamedays remaining (90/80/70 → 0).
       */
      roundsRemaining: number;
      /**
       * Permit-pending: total cost stashed here, divided into per-round
       * chunks once the permit is granted (`ILEX5.BAS:5479`).
       * Construction-active: per-round payment in €.
       */
      roundPayment: number;
      target: Arena;
    };
