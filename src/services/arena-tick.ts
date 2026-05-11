import type { Draft } from "immer";
import type { Random } from "random-js";
import type { Team } from "@/state/game";
import {
  tickConstruction,
  constructionRounds,
  qbCint,
  builderByRank
} from "@/services/arena";

/**
 * Result of a single arena construction tick for one team.
 *
 * The caller (executeCalculations) is responsible for delivering
 * these strings as `addAnnouncement` effects to the managing player.
 */
export type ArenaTickResult = {
  /** News/log strings to show the manager this round. */
  news: string[];
  /** True if the project completed this tick. */
  completed: boolean;
};

/**
 * Per-round arena construction state machine — 1-1 port of
 * `SUB rstages` (`ILEX5.BAS:5451-5525`).
 *
 * Called once per team per round (inside the calculations phase)
 * when `team.arenaProject` is defined. Mutates the team draft
 * directly (arenaFund, arenaProject, arena on completion).
 *
 * Three branches mirroring the QB `SELECT CASE uhatapa(pv)`:
 *
 * 1. **Permit phase** (build, `!permitGranted`):
 *    progress += architect rank, then probabilistic submission +
 *    denial/approval roll.
 *
 * 2. **Construction in progress** (build w/ permit, or renovate):
 *    deduct roundPayment from arenaFund, roll for slacking/progress.
 *
 * 3. **Completion** (roundsRemaining hits 0):
 *    copy target → team.arena, set name (build only), clear project.
 *
 * Random discipline: all rolls sourced from the injected `random`
 * instance. The caller provides the game's seeded Random so that
 * deterministic replay works.
 */
export const tickArenaProject = (
  team: Draft<Team>,
  random: Random
): ArenaTickResult => {
  const project = team.arenaProject;
  if (!project) {
    return { news: [], completed: false };
  }

  // ── Branch 1: Permit phase (new build, not yet granted) ──
  if (project.kind === "build" && !project.permitGranted) {
    return tickPermitPhase(team, project, random);
  }

  // ── Branch 3: Completion check (roundsRemaining already 0) ──
  // This can happen if the previous tick decremented to 0 but the
  // completion ran in that same tick. Guard defensively.
  if (project.roundsRemaining <= 0) {
    return completeProject(team, project);
  }

  // ── Branch 2: Construction in progress ──
  return tickConstructionPhase(team, project, random);
};

// ────────────────────────────────────────────────────────────────
// Branch 1 — permit phase (build only)
// ────────────────────────────────────────────────────────────────

function tickPermitPhase(
  _team: Draft<Team>,
  project: Draft<Extract<NonNullable<Team["arenaProject"]>, { kind: "build" }>>,
  random: Random
): ArenaTickResult {
  const news: string[] = [];

  // Advance permit progress: +architect rank per round, clamp to 100.
  // QB: uhatapa(pv) = uhatapa(pv) + arkkitehti(pv)
  project.roundsRemaining = Math.min(
    100,
    project.roundsRemaining + project.architect
  );

  // Submission roll: c = INT(151 * RND) → 0..150
  // Submit if c < progress - 10
  const submissionRoll = random.integer(0, 150);
  if (submissionRoll >= project.roundsRemaining - 10) {
    // Not submitted this round — paperwork still cooking.
    return { news, completed: false };
  }

  // Submitted! Now roll for denial.
  // d = INT(101 * RND) → 0..100
  // Denied if d < 60 - architect * 20
  //   architect 1: denied if d < 40 (40 %)
  //   architect 2: denied if d < 20 (20 %)
  //   architect 3: denied if d < 0  (never)
  const denialRoll = random.integer(0, 100);
  const denialThreshold = 60 - project.architect * 20;

  if (denialRoll < denialThreshold) {
    // Permit denied — restart from scratch.
    project.roundsRemaining = 10;
    news.push("Rakennuslupa evätään. Arkkitehti palaa piirustuspöydän ääreen.");
    return { news, completed: false };
  }

  // Permit granted! Switch to construction phase.
  project.permitGranted = true;
  const rounds = constructionRounds("build", project.builder);
  project.roundsRemaining = rounds;
  // roundPayment held total cost until now; split into per-round chunks.
  // QB: mpv = CLNG(mpv / (uhatapa - 1000))
  project.roundPayment = qbCint(project.roundPayment / rounds);

  const builderName = builderByRank(project.builder).name;
  news.push(`Rakennuslupa myönnetään! ${builderName} aloittaa työt.`);
  return { news, completed: false };
}

// ────────────────────────────────────────────────────────────────
// Branch 2 — construction in progress
// ────────────────────────────────────────────────────────────────

function tickConstructionPhase(
  team: Draft<Team>,
  project: Draft<NonNullable<Team["arenaProject"]>>,
  random: Random
): ArenaTickResult {
  const news: string[] = [];

  // Can the fund cover this round's payment?
  if (team.arenaFund < project.roundPayment) {
    // Project paused — can't pay. QB just skips the round silently.
    news.push(
      "Rakennusprojekti seisoo — areenakassassa ei ole tarpeeksi rahaa."
    );
    return { news, completed: false };
  }

  // Deduct payment.
  team.arenaFund -= project.roundPayment;

  // Roll for slacking / progress.
  // d = INT(100 * RND) + 1 → 1..100
  const roll = random.integer(1, 100);
  const tick = tickConstruction(project.builder, roll);

  if (tick.slacked) {
    news.push(
      "Lakisääteisten kahvituntien takia rakennusprojekti seisoo tänään."
    );
  }

  if (tick.progressed) {
    project.roundsRemaining -= 1;
  }

  // Check for completion after decrement.
  if (project.roundsRemaining <= 0) {
    return completeProject(team, project);
  }

  return { news, completed: false };
}

// ────────────────────────────────────────────────────────────────
// Branch 3 — completion
// ────────────────────────────────────────────────────────────────

function completeProject(
  team: Draft<Team>,
  project: Draft<NonNullable<Team["arenaProject"]>>
): ArenaTickResult {
  const news: string[] = [];

  // Copy target arena → team.arena.
  team.arena = { ...project.target };

  if (project.kind === "build") {
    // Name the arena from the project.
    team.arena.name = project.name;
    news.push(`Uusi areena "${project.name}" on valmis!`);
  } else {
    news.push("Areenan remontti on valmis!");
  }

  // Clear the project.
  team.arenaProject = undefined;

  return { news, completed: true };
}
