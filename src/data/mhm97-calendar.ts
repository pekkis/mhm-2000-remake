import type { CompetitionId } from "@/types/competitions";

const CRISIS_DEADLINE = 52;
const TRANSFER_DEADLINE = 30;
const EVENT_DEADLINE = 53;
const PRANKS_DEADLINE = 53;

type Seed = {
  competition: string;
  phase: number;
};

export type CalendarEntry = {
  phases: string[];
  gamedays: CompetitionId[];
  seed: Seed[];
  title?: string;
  round: number;
  transferMarket: boolean;
  crisisMeeting: boolean;
  createRandomEvent: boolean;
  pranks: boolean;
};

type RawEntry = {
  phases: string[];
  gamedays?: CompetitionId[];
  seed?: Seed[];
  title?: string;
};

const defaultPhases = [
  "action",
  "prank",
  "gameday",
  "calculations",
  "event_creation",
  "event",
  "news",
  "seed"
];

const ehlPhases = ["action", "gameday", "event", "news"];

const phlDiv = (
  phases: string[] = defaultPhases,
  extra?: Partial<RawEntry>
): RawEntry => ({
  phases,
  gamedays: ["phl", "division", "mutasarja"],
  ...extra
});

const ehl: RawEntry = {
  phases: ehlPhases,
  gamedays: ["ehl"]
};

const repeat = (entry: RawEntry, n: number): RawEntry[] =>
  Array.from({ length: n }, () => entry);

const raw: RawEntry[] = [
  // Round 0: start of season
  {
    phases: ["start_of_season", "seed"],
    seed: [
      { competition: "phl", phase: 0 },
      { competition: "division", phase: 0 },
      { competition: "mutasarja", phase: 0 },
      { competition: "ehl", phase: 0 }
    ]
  },

  // Rounds 1-4
  phlDiv(),
  phlDiv(),
  phlDiv(),
  phlDiv(),

  // Round 5: EHL
  ehl,

  // Rounds 6-9
  phlDiv(),
  phlDiv(),
  phlDiv(),
  phlDiv(),

  // Round 10: EHL
  ehl,

  // Rounds 11-12
  phlDiv(),
  phlDiv(),

  // Round 13: invitations
  phlDiv([...defaultPhases, "invitations_create"]),

  // Round 14
  phlDiv(),

  // Round 15: EHL
  ehl,

  // Rounds 16-17
  phlDiv(),
  phlDiv(),

  // Round 18: tournament seed
  phlDiv(defaultPhases, {
    seed: [{ competition: "tournaments", phase: 0 }]
  }),

  // Round 19
  phlDiv(),

  // Round 20: EHL
  ehl,

  // Rounds 21-24
  phlDiv(),
  phlDiv(),
  phlDiv(),
  phlDiv(),

  // Round 25: EHL
  ehl,

  // Rounds 26-27
  phlDiv(),
  phlDiv(),

  // Round 28: Christmas break (22 games played)
  {
    title: "Joulutauko",
    phases: defaultPhases,
    gamedays: ["tournaments"]
  },

  // Rounds 29-30: Christmas break over
  phlDiv(),
  phlDiv(),

  // Round 31: EHL
  ehl,

  // Seed EHL finals
  {
    phases: ["seed"],
    seed: [{ competition: "ehl", phase: 1 }]
  },

  // 10 rounds of PHL/division
  ...repeat(phlDiv(), 10),

  // EHL final tournament
  ehl,

  // 10 more rounds of PHL/division
  ...repeat(phlDiv(), 10),

  // Playoff seed
  {
    title: "Playoff-pläjäys",
    phases: ["action", "event", "news", "seed"],
    seed: [
      { competition: "phl", phase: 1 },
      { competition: "division", phase: 1 },
      { competition: "mutasarja", phase: 1 }
    ]
  },

  // 5 rounds of playoffs
  ...repeat(
    phlDiv(["action", "gameday", "calculations", "event", "news", "seed"]),
    5
  ),

  // Semifinal seed
  {
    title: "Semifinaali-pläjäys",
    phases: ["action", "event", "news", "seed"],
    seed: [
      { competition: "phl", phase: 2 },
      { competition: "division", phase: 2 },
      { competition: "mutasarja", phase: 2 }
    ]
  },

  // 5 rounds of semifinals
  ...repeat(
    phlDiv(["action", "gameday", "calculations", "event", "news", "seed"]),
    5
  ),

  // Finals seed
  {
    title: "Finaali-pläjäys",
    phases: ["action", "event", "news", "seed", "gala"],
    seed: [
      { competition: "phl", phase: 3 },
      { competition: "division", phase: 3 },
      { competition: "mutasarja", phase: 3 }
    ]
  },

  // 7 rounds of finals
  ...repeat(
    phlDiv(["action", "gameday", "calculations", "event", "news", "seed"]),
    7
  ),

  // World championships
  {
    title: "Maailmanmestaruuskisat",
    phases: ["action", "end_of_season"]
  }
];

const calendar: CalendarEntry[] = raw.map((entry, index) => ({
  phases: entry.phases,
  gamedays: entry.gamedays ?? [],
  seed: entry.seed ?? [],
  title: entry.title,
  round: index,
  transferMarket: index <= TRANSFER_DEADLINE,
  crisisMeeting: index <= CRISIS_DEADLINE,
  createRandomEvent: index <= EVENT_DEADLINE,
  pranks: index <= PRANKS_DEADLINE
}));

export default calendar;
