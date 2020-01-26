import { pipe, append, curry, map, repeat, flatten, assoc } from "ramda";
import { mapIndexed } from "ramda-adjunct";
import {
  MHMTurnPhasesList,
  CompetitionNameList,
  MHMCompetitionSeedDefinition,
  MHMTurnExtraOptions,
  MHMTurnDefinition,
  CompetitionNames,
  MHMCalendar
} from "../../types/base";

export const CRISIS_DEADLINE = 52;
export const TRANSFER_DEADLINE = 30;
export const EVENT_DEADLINE = 53;
export const PRANKS_DEADLINE = 53;

const defaultPhases: MHMTurnPhasesList = [
  "action",
  "prank",
  "gameday",
  "calculations",
  "eventCreation",
  "event",
  "news",
  "seed"
];

const ehlPhases: MHMTurnPhasesList = ["action", "gameday", "event", "news"];

const createTurnDefinition = (
  phases: MHMTurnPhasesList,
  gamedays: CompetitionNameList = [],
  seed: MHMCompetitionSeedDefinition[] = [],
  extra: Partial<MHMTurnExtraOptions> = {}
): MHMTurnDefinition => {
  return {
    round: -1,
    phases,
    gamedays,
    seed,
    pranks: false,
    createRandomEvent: false,
    transferMarket: false,
    crisisMeeting: false,
    ...extra
  };
};

const createSeedDefinition = curry(
  (
    phase: number,
    competition: CompetitionNames
  ): MHMCompetitionSeedDefinition => ({
    competition,
    phase
  })
);

const regularGameday = createTurnDefinition(
  defaultPhases,
  ["phl", "division", "mutasarja"],
  [],
  {}
);

const ehlGameday = createTurnDefinition(ehlPhases, ["ehl"], [], {});

const preSeasonTurn = createTurnDefinition(["action"]);

const trainingGameday = createTurnDefinition(ehlPhases, ["training"]);

const cupGameday = createTurnDefinition(ehlPhases, ["cup"]);

const freeWeekend = createTurnDefinition(["action"], [], [], {
  title: "Vapaa"
});

const cal: MHMCalendar = [
  createTurnDefinition(
    ["startOfSeason", "seed"],
    [],
    map(createSeedDefinition(0), [
      "phl",
      "division",
      "mutasarja",
      "ehl",
      "training",
      "cup"
    ]),
    {}
  ),

  ...repeat(preSeasonTurn, 6),
  ...repeat(trainingGameday, 4),
  ...repeat(regularGameday, 2),
  cupGameday,
  regularGameday,
  cupGameday,
  createTurnDefinition(["seed"], [], [createSeedDefinition(1, "cup")]),
  ehlGameday,
  cupGameday,
  cupGameday,
  createTurnDefinition(["seed"], [], [createSeedDefinition(2, "cup")]),
  cupGameday,
  cupGameday,
  createTurnDefinition(["seed"], [], [createSeedDefinition(3, "cup")]),
  cupGameday,
  cupGameday,
  ...repeat(regularGameday, 2),
  assoc("phases", append("invitationsCreate", defaultPhases), regularGameday),
  regularGameday,
  ehlGameday,
  ...repeat(regularGameday, 2),
  assoc(
    "seed",
    [createSeedDefinition(0, "tournaments")] as MHMCompetitionSeedDefinition[],
    regularGameday
  ),
  regularGameday,
  ehlGameday,
  ...repeat(regularGameday, 4),
  ehlGameday,
  ...repeat(regularGameday, 2),
  // Christmas break (22 games played)
  createTurnDefinition(defaultPhases, ["tournaments"], [], {
    title: "Joulutauko"
  }),
  // Back to business
  ...repeat(regularGameday, 2),
  ehlGameday,
  createTurnDefinition(["seed"], [], [createSeedDefinition(1, "ehl")]),
  ...repeat(regularGameday, 10),
  ehlGameday, // EHL finals
  ...repeat(regularGameday, 10),
  createTurnDefinition(
    ["action", "event", "seed"],
    [],
    map(createSeedDefinition(1), ["phl", "division", "mutasarja"]),
    {
      title: "Playoff-pläjäys"
    }
  ),
  ...repeat(regularGameday, 5),
  createTurnDefinition(
    ["action", "event", "seed"],
    [],
    map(createSeedDefinition(2), ["phl", "division", "mutasarja"]),
    {
      title: "Semifinaalipläjäys"
    }
  ),
  ...repeat(regularGameday, 5),
  createTurnDefinition(
    ["action", "event", "seed", "gala"],
    [],
    map(createSeedDefinition(3), ["phl", "division", "mutasarja"]),
    {
      title: "Finaalipläjäys"
    }
  ),
  ...repeat(regularGameday, 7),
  createTurnDefinition(["action", "endOfSeason"], [], [], {
    title: "Maailmanmestaruuskisat"
  })
];

const cal2 = pipe(
  mapIndexed(
    (calendar: MHMTurnDefinition, index: number): MHMTurnDefinition => {
      return {
        ...calendar,
        round: index,
        transferMarket: index <= TRANSFER_DEADLINE,
        crisisMeeting: index <= CRISIS_DEADLINE,
        createRandomEvent: index <= EVENT_DEADLINE,
        pranks: index <= PRANKS_DEADLINE
      };
    }
  )
)(cal);

export default cal2 as MHMCalendar;
