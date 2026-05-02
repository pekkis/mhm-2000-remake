/**
 * MHM 2000 calendar generator — RUN ON DEMAND ONLY.
 *
 * Reads the verbatim KIERO.M2K decode from `./calendar.ts` and emits
 * `src/data/calendar.ts` as a verbose, hand-editable `CalendarEntry[]`
 * literal. **The generated file is the source of truth.** Once
 * generated, hand-tweak it directly — do not re-run this script
 * blindly or you'll overwrite tweaks. Re-runs are for when the raw
 * decode itself changes.
 *
 * Usage:
 *   pnpm gen:calendar
 *   # or:
 *   pnpm exec tsx src/data/mhm2000/generate-calendar.ts
 *
 * Seed assignments below are *heuristics* derived from round type +
 * MHM 97's calendar structure. Anything uncertain is flagged with a
 * `todo:` tag on the row in `./calendar.ts` rather than guessed.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { CompetitionId } from "@/types/competitions";
import {
  rawCalendar,
  type RawCalendarEntry,
  type RoundType
} from "@/data/mhm2000/calendar";

// ─── Phase presets ──────────────────────────────────────────────────────

const DEFAULT_PHASES = [
  "action",
  "prank",
  "gameday",
  "calculations",
  "event_creation",
  "event",
  "news",
  "seed"
];

const EHL_PHASES = ["action", "gameday", "event", "news"];

const NO_GAMEDAY_PHASES = [
  "action",
  "prank",
  "event_creation",
  "event",
  "news"
];

const PHL_DIV_MUTA: CompetitionId[] = ["phl", "division", "mutasarja"];

const TYPE_TO_GAMEDAYS: Record<RoundType, CompetitionId[]> = {
  1: PHL_DIV_MUTA,
  2: ["ehl"],
  3: ["cup"],
  4: ["practice"],
  22: ["ehl"],
  42: PHL_DIV_MUTA,
  44: PHL_DIV_MUTA,
  46: PHL_DIV_MUTA,
  98: ["tournaments"],

  41: [],
  43: [],
  45: [],
  47: [],
  48: [],
  96: [],
  97: [],
  99: []
};

const TYPE_TO_PHASES: Record<RoundType, string[]> = {
  1: DEFAULT_PHASES,
  2: EHL_PHASES,
  3: DEFAULT_PHASES,
  4: DEFAULT_PHASES,
  22: EHL_PHASES,
  41: NO_GAMEDAY_PHASES,
  42: DEFAULT_PHASES,
  43: NO_GAMEDAY_PHASES,
  44: DEFAULT_PHASES,
  45: NO_GAMEDAY_PHASES,
  46: DEFAULT_PHASES,
  47: ["action", "event", "news", "gala"],
  48: ["action", "end_of_season"],
  96: NO_GAMEDAY_PHASES,
  97: NO_GAMEDAY_PHASES,
  98: DEFAULT_PHASES,
  99: NO_GAMEDAY_PHASES
};

const TYPES_WITH_RANDOM_EVENT: ReadonlySet<RoundType> = new Set<RoundType>([
  1, 2, 3, 4, 22, 42, 44, 46, 98
]);

// ─── Title heuristics ───────────────────────────────────────────────────

const titleFor = (raw: RawCalendarEntry): string | undefined => {
  switch (raw.type) {
    case 22:
      return "EHL:n lopputurnaus";
    case 41:
      return "Puolivälieräpläjäys";
    case 43:
      return "Välieräpläjäys";
    case 45:
      return "Finaalipläjäys";
    case 47:
      return "PHL:n juhlagaala";
    case 48:
      return "Uusi kausi";
    case 96:
      return "Vapaa viikonloppu";
    case 97:
      return "Maajoukkuetauko";
    case 98:
      return "Kutsuturnaukset";
    case 99:
      return "Esikausi";
    default:
      return undefined;
  }
};

// ─── Seed heuristics ────────────────────────────────────────────────────
//
// What needs to be seeded, when:
//
//   - Index 0 (first preseason day): phase 0 of every competition
//     that exists in the season — phl/division/mutasarja/ehl/practice.
//     Cup is left to its draw-driven flow (cuparpo / preRound:2).
//     Tournaments are seeded just before the kutsuturnaus window.
//   - Type 41 (QF draw):     phl/division/mutasarja phase 1
//   - Type 43 (SF draw):     phl/division/mutasarja phase 2
//   - Type 45 (Final draw):  phl/division/mutasarja phase 3
//   - Type 22 (EHL final):   ehl phase 1 (the seed runs in the same
//                            round before gameday)
//   - Index 46 (type 98 kutsuturnaus): tournaments phase 0
//
// All of this is best-guess. Hand-edit `src/data/calendar.ts` after
// generation to refine.

type SeedTuple = { competition: string; phase: number };

const seedsFor = (raw: RawCalendarEntry): SeedTuple[] => {
  if (raw.index === 0) {
    return [
      { competition: "phl", phase: 0 },
      { competition: "division", phase: 0 },
      { competition: "mutasarja", phase: 0 },
      { competition: "ehl", phase: 0 },
      { competition: "practice", phase: 0 }
    ];
  }
  if (raw.index === 46) {
    return [{ competition: "tournaments", phase: 0 }];
  }
  switch (raw.type) {
    case 41:
      return [
        { competition: "phl", phase: 1 },
        { competition: "division", phase: 1 },
        { competition: "mutasarja", phase: 1 }
      ];
    case 43:
      return [
        { competition: "phl", phase: 2 },
        { competition: "division", phase: 2 },
        { competition: "mutasarja", phase: 2 }
      ];
    case 45:
      return [
        { competition: "phl", phase: 3 },
        { competition: "division", phase: 3 },
        { competition: "mutasarja", phase: 3 }
      ];
    case 22:
      return [{ competition: "ehl", phase: 1 }];
    default:
      return [];
  }
};

// ─── Emission ──────────────────────────────────────────────────────────

const stringArray = (xs: string[]): string =>
  xs.length === 0 ? "[]" : `[${xs.map((s) => JSON.stringify(s)).join(", ")}]`;

const seedArray = (seeds: SeedTuple[]): string => {
  if (seeds.length === 0) {
    return "[]";
  }
  const items = seeds
    .map(
      (s) =>
        `{ competition: ${JSON.stringify(s.competition)}, phase: ${s.phase} }`
    )
    .join(", ");
  return `[${items}]`;
};

const renderEntry = (raw: RawCalendarEntry): string => {
  const title = titleFor(raw);
  const phases = TYPE_TO_PHASES[raw.type];
  const gamedays = TYPE_TO_GAMEDAYS[raw.type];
  const seed = seedsFor(raw);
  const tagsHasGameplay = TYPES_WITH_RANDOM_EVENT.has(raw.type);

  const lines: string[] = [];
  lines.push(
    `  // round ${raw.index} (KIERO.M2K row ${raw.fileIndex}, type ${raw.type}) — ${raw.note}`
  );
  lines.push(`  {`);
  if (title !== undefined) {
    lines.push(`    title: ${JSON.stringify(title)},`);
  }
  lines.push(`    phases: ${stringArray(phases)},`);
  lines.push(`    gamedays: ${stringArray(gamedays)},`);
  lines.push(`    seed: ${seedArray(seed)},`);
  lines.push(`    transferMarket: ${raw.transferMarket},`);
  lines.push(`    crisisMeeting: true,`);
  lines.push(`    createRandomEvent: ${tagsHasGameplay},`);
  lines.push(`    pranks: ${tagsHasGameplay},`);
  lines.push(`    tags: ${stringArray(raw.tags)}`);
  lines.push(`  },`);
  return lines.join("\n");
};

const HEADER = `// AUTO-GENERATED by src/data/mhm2000/generate-calendar.ts on first
// pass, then HAND-EDITED. After generation this file is the source of
// truth for the runtime calendar — tweak it directly. Re-run the
// generator only if the raw KIERO.M2K decode itself changes
// (\`src/data/mhm2000/calendar.ts\`), and expect to redo any manual
// tweaks afterwards.
//
// The runtime engine (gameMachine) reads \`calendar\` exclusively. The
// raw decode in \`./mhm2000/calendar.ts\` is kept around as
// cross-reference, not as a runtime dependency.

import type { CompetitionId } from "@/types/competitions";

export type Seed = {
  competition: CompetitionId;
  phase: number;
};

export type CalendarEntry = {
  round: number;
  title?: string;
  phases: string[];
  gamedays: CompetitionId[];
  seed: Seed[];
  transferMarket: boolean;
  crisisMeeting: boolean;
  createRandomEvent: boolean;
  pranks: boolean;
  tags: string[];
};

type RawCalendarEntry = Omit<CalendarEntry, "round">;

const entries: RawCalendarEntry[] = [
`;

const FOOTER = `];

const calendar: CalendarEntry[] = entries.map((entry, round) => ({
  ...entry,
  round
}));

export default calendar;
`;

// ─── Main ──────────────────────────────────────────────────────────────

const main = (): void => {
  const body = rawCalendar.map(renderEntry).join("\n");
  const out = HEADER + body + "\n" + FOOTER;
  const here = fileURLToPath(import.meta.url);
  const target = resolve(here, "../../calendar.ts");
  writeFileSync(target, out, "utf8");
  console.log(`wrote ${rawCalendar.length} rounds to ${target}`);
};

main();
