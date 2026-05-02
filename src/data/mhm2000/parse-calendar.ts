import type { CompetitionId } from "@/types/competitions";
import type {
  RawCalendarEntry,
  RoundType
} from "@/data/mhm2000/calendar";

/**
 * One day on the MHM 2000 calendar, as consumed by `gameMachine`. Built
 * from a `RawCalendarEntry` (the verbatim KIERO.M2K decode) by
 * `parseCalendar`. The runtime engine treats `gamedays`, `seed`,
 * `transferMarket`, `crisisMeeting`, `createRandomEvent` and `pranks`
 * as authoritative; `phases` defines the ordered step list for the
 * round; `tags` is a free-form bag for greppable annotations
 * ("playoffs", "todo:wire-budget", "unknown:preRound=3", …).
 */
export type Seed = {
  competition: string;
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
  // Round-types that play league/playoff games:
  1: PHL_DIV_MUTA,
  2: ["ehl"],
  3: ["cup"],
  4: ["practice"],
  22: ["ehl"],
  42: PHL_DIV_MUTA, // QF gameday
  44: PHL_DIV_MUTA, // SF gameday
  46: PHL_DIV_MUTA, // Final gameday
  98: ["tournaments"], // invitation tournaments

  // Round-types that play no games:
  41: [], // QF draw
  43: [], // SF draw
  45: [], // Final draw
  47: [], // Season-end gala
  48: [], // Season rollover
  96: [], // Free weekend
  97: [], // National team break
  99: [] // Preseason filler
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

/**
 * Round-types where a non-deterministic random event should be created
 * (i.e. there's actual gameplay around which a "shit happened" beat
 * makes sense). Pranks share the same gating for now.
 */
const TYPES_WITH_RANDOM_EVENT: ReadonlySet<RoundType> = new Set<RoundType>([
  1, 2, 3, 4, 22, 42, 44, 46, 98
]);

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

export const parseCalendar = (
  rawEntries: RawCalendarEntry[]
): CalendarEntry[] =>
  rawEntries.map((raw) => ({
    round: raw.index,
    title: titleFor(raw),
    phases: TYPE_TO_PHASES[raw.type],
    gamedays: TYPE_TO_GAMEDAYS[raw.type],
    seed: [],
    transferMarket: raw.transferMarket,
    crisisMeeting: true,
    createRandomEvent: TYPES_WITH_RANDOM_EVENT.has(raw.type),
    pranks: TYPES_WITH_RANDOM_EVENT.has(raw.type),
    tags: raw.tags
  }));
