import { pipe, append, curry, map, repeat, flatten } from "ramda";
import { mapIndexed } from "ramda-adjunct";
import {
  MHMTurnPhasesList,
  MHMCompetitionsList,
  MHMCompetitionSeedDefinition,
  MHMTurnExtraOptions,
  MHMTurnDefinition,
  MHMCompetition,
  MHMCalendar
} from "../types/base";

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
  gamedays: MHMCompetitionsList = [],
  seed: MHMCompetitionSeedDefinition[] = [],
  extra: Partial<MHMTurnExtraOptions> = {}
): MHMTurnDefinition => {
  return {
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
    competition: MHMCompetition
  ): MHMCompetitionSeedDefinition => ({
    competition,
    phase
  })
);

const cal = pipe(
  append(
    createTurnDefinition(
      ["startOfSeason", "seed"],
      [],
      map(createSeedDefinition(0), ["phl", "division", "mutasarja", "ehl"]),
      {}
    )
  ),
  append(
    repeat(
      createTurnDefinition(
        defaultPhases,
        ["phl", "division", "mutasarja"],
        [],
        {}
      ),
      4
    )
  ),
  flatten as any,
  mapIndexed(
    (calendar: MHMTurnDefinition, index: number): MHMTurnDefinition => {
      return {
        ...calendar,
        transferMarket: index <= TRANSFER_DEADLINE,
        crisisMeeting: index <= CRISIS_DEADLINE,
        createRandomEvent: index <= EVENT_DEADLINE,
        pranks: index <= PRANKS_DEADLINE
      };
    }
  )
)([]);

console.log(cal);

export default cal as MHMCalendar;

/*
const calendar = List.of(
  Map({
    phases: List.of("startOfSeason", "seed"),
    seed: List.of(
      Map({
        competition: "phl",
        phase: 0
      }),
      Map({
        competition: "division",
        phase: 0
      }),
      Map({
        competition: "ehl",
        phase: 0
      })
    )
  })
)
  .concat(
    List.of(
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: ehlPhases,
        gamedays: List.of("ehl")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: ehlPhases,
        gamedays: List.of("ehl")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        gamedays: List.of("phl", "division"),
        phases: defaultPhases.push("invitationsCreate")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: ehlPhases,
        gamedays: List.of("ehl")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division"),
        seed: List.of(
          Map({
            competition: "tournaments",
            phase: 0
          })
        )
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: ehlPhases,
        gamedays: List.of("ehl")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: ehlPhases,
        gamedays: List.of("ehl")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),

      // Christmas break (22 games played)

      Map({
        title: "Joulutauko",
        phases: defaultPhases,
        gamedays: List.of("tournaments")
      }),

      // Christmas break over

      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      Map({
        phases: ehlPhases,
        gamedays: List.of("ehl")
      })
    )
  )
  // seed EHL finals
  .push(
    Map({
      phases: List.of("seed"),
      seed: List.of(
        Map({
          competition: "ehl",
          phase: 1
        })
      )
    })
  )
  .concat(
    Repeat(
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      10
    )
  )
  // EHL final tournament
  .push(
    Map({
      phases: ehlPhases,
      gamedays: List.of("ehl")
    })
  )
  .concat(
    Repeat(
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      10
    )
  )
  .push(
    Map({
      title: "Playoff-pläjäys",
      phases: List.of("action", "event", "seed"),
      seed: List.of(
        Map({ competition: "phl", phase: 1 }),
        Map({ competition: "division", phase: 1 })
      )
    })
  )
  .concat(
    Repeat(
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      5
    )
  )
  .push(
    Map({
      title: "Semifinaali-pläjäys",
      phases: List.of("action", "event", "seed"),
      seed: List.of(
        Map({ competition: "phl", phase: 2 }),
        Map({ competition: "division", phase: 2 })
      )
    })
  )
  .concat(
    Repeat(
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      5
    )
  )
  .push(
    Map({
      title: "Finaali-pläjäys",
      phases: List.of("action", "event", "seed", "gala"),
      seed: List.of(
        Map({ competition: "phl", phase: 3 }),
        Map({ competition: "division", phase: 3 })
      )
    })
  )
  .concat(
    Repeat(
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division")
      }),
      7
    )
  )
  .push(
    Map({
      title: "Maailmanmestaruuskisat",
      phases: List.of("action", "endOfSeason")
    })
  );

const decoratedCalendar = calendar.map((entry, index) => {
  return entry.merge({
    round: index,
    transferMarket: index <= TRANSFER_DEADLINE,
    crisisMeeting: index <= CRISIS_DEADLINE,
    createRandomEvent: index <= EVENT_DEADLINE,
    pranks: index <= PRANKS_DEADLINE
  });
});
*/

// console.log(calendar.toJS());

// export default decoratedCalendar;
