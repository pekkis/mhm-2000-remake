import type { Draft } from "immer";
import type { Random } from "random-js";
import type { Team } from "@/state/game";
import {
  tickConstruction,
  constructionRounds,
  qbCint,
  builderByRank,
  architectByRank
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
    return completeProject(team, project, random);
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
    // X.MHM rec 161: architect "joutuu syömään suunnitelman ja raapustamaan uuden"
    project.roundsRemaining = 10;
    const arch = architectByRank(project.architect);
    news.push(
      `RAKENNUSLUPA EVÄTÄÄN. ${arch.name} joutuu syömään arkkitehtonisesti epäonnistuneen suunnitelman ja raapustamaan uuden.`
    );
    return { news, completed: false };
  }

  // Permit granted! Switch to construction phase.
  // X.MHM rec 162: architect "on tehnyt hommansa hyvin"
  project.permitGranted = true;
  const rounds = constructionRounds("build", project.builder);
  project.roundsRemaining = rounds;
  // roundPayment held total cost until now; split into per-round chunks.
  // QB: mpv = CLNG(mpv / (uhatapa - 1000))
  project.roundPayment = qbCint(project.roundPayment / rounds);

  const arch = architectByRank(project.architect);
  news.push(
    `RAKENNUSLUPA MYÖNNETÄÄN. ${arch.name} on tehnyt hommansa hyvin, ja varsinaiset rakennustyöt voivat nyt alkaa.`
  );
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
    // Project paused — can't pay.
    // X.MHM rec 164 (build) / 168 (renovate)
    if (project.kind === "build") {
      news.push(
        `Uuden hallisi rakennustyöt ovat keskeytyneet — rakennuspotista ei löydy tarvittavaa määrää rahaa! (${project.roundPayment} euroa/vuoro)`
      );
    } else {
      news.push(
        `Halliremonttisi on pysähtynyt rahanpuutteen vuoksi. Potti on tyhjä, eikä sieltä voi nyhtää tarvittavaa ${project.roundPayment} euroa/vuoro.`
      );
    }
    return { news, completed: false };
  }

  // Deduct payment.
  team.arenaFund -= project.roundPayment;

  // Roll for slacking / progress.
  // d = INT(100 * RND) + 1 → 1..100
  const roll = random.integer(1, 100);
  const tick = tickConstruction(project.builder, roll);

  if (tick.slacked) {
    // X.MHM rec 165 — builder slacking
    const builder = builderByRank(project.builder);
    news.push(
      `${builder.name} ilmoittaa lakisääteisten kahvituntien kasautuneen kokonaiseksi palkalliseksi vapaapäiväksi. Suomeksi: pojat vetävät lonkkaa kokonaisen vuoron ajan, sinä maksat, projekti seisoo.`
    );
  }

  if (tick.progressed) {
    project.roundsRemaining -= 1;
  }

  // Check for completion after decrement.
  if (project.roundsRemaining <= 0) {
    return completeProject(team, project, random);
  }

  return { news, completed: false };
}

// ────────────────────────────────────────────────────────────────
// Branch 3 — completion
// ────────────────────────────────────────────────────────────────

/**
 * X.MHM records 170..175 — six random congratulation blurbs sent by
 * a rival manager when a new arena is completed. QB picks one via
 * `lax 170 + INT(6 * RND)`. The `£2` token in the originals expands
 * to "{managerName} ({teamName})" — the caller substitutes the actual
 * rival manager at render time; we use `{rivalManager}` as a
 * placeholder here.
 */
const celebrationBlurbs = [
  `{rivalManager} faksaa sinulle seuraavanlaiset terveiset: "Onneksi olkoon uuden hallinne johdosta. Olkoon Rouva Fortuna kanssanne nyt ja tulevaisuudessa!"`,
  `{rivalManager} lähettää sinulle faksin: "Upea halli, täytyy tunnustaa vaikka vähän kadettaakin. Olkoon peliesityksenne tästedes uuden uljaan areenanne veroiset."`,
  `{rivalManager} faksaa uuden hallisi johdosta onnittelunsa. "Johdattakoon areena joukkueenne ennennäkemättömiin korkeuksiin!"`,
  `{rivalManager} lähettää sinulle tekstiviestin. "Juhlista halliasi kun vielä voit. Tulostaulu voi pudota koska tahansa..."`,
  `{rivalManager} faksaa sinulle kirkkovenesymbolein koristellun lappusen: "Kirottu olkoon sinä ja uusi rupinen hallisi - haa haa!"`,
  `{rivalManager} soittaa "onnittelunsa" puhelinvastaajaasi: "Huoh huoh lääh lääh. Mää räjäytän sun hallisi." Manageri yrittää parhaansa mukaan muuntaa ääntänsä, mutta olet melkomoisen varma soittajan henkilöllisyydestä.`
];

function completeProject(
  team: Draft<Team>,
  project: Draft<NonNullable<Team["arenaProject"]>>,
  random: Random
): ArenaTickResult {
  const news: string[] = [];

  // Copy target arena → team.arena.
  team.arena = { ...project.target };

  if (project.kind === "build") {
    // X.MHM rec 166 — new build complete
    team.arena.name = project.name;
    const builder = builderByRank(project.builder);
    news.push(
      `${builder.name} on saanut uuden areenasi rakennustyöt päätökseen, ja halli on käytettävissäsi tästä hetkestä alkaen.`
    );
    // X.MHM rec 170 + INT(6 * RND) — random rival congratulation
    news.push(celebrationBlurbs[random.integer(0, 5)]!);
  } else {
    // X.MHM rec 169 — renovation complete
    const builder = builderByRank(project.builder);
    news.push(
      `${builder.name} on saanut halliremontin onnellisesti päätökseen! Uudistettu areenasi on käytössä jo tänä iltana tarvittaessa!`
    );
  }

  // Clear the project.
  team.arenaProject = undefined;

  return { news, completed: true };
}
