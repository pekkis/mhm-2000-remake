import { List, Map, Repeat } from "immutable";

export const CRISIS_DEADLINE = 52;
export const TRANSFER_DEADLINE = 30;
export const EVENT_DEADLINE = 53;

const defaultPhases = List.of(
  "action",
  "prank",
  "gameday",
  "calculations",
  "eventCreation",
  "event",
  "news",
  "seed"
);

const ehlPhases = List.of("action", "gameday", "event", "news");

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
        phases: defaultPhases.push("invitations-create")
      }),
      Map({
        phases: defaultPhases,
        gamedays: List.of("phl", "division"),
        invitations: true
      }),
      Map({
        phases: ehlPhases,
        invitations: true,
        gamedays: List.of("ehl")
      }),
      Map({
        phases: defaultPhases.push("invitations-process"),
        gamedays: List.of("phl", "division"),
        seed: List.of(
          Map({
            competition: "tournaments",
            phase: 0
          })
        ),
        invitations: true
      }),
      Map({
        phases: defaultPhases,
        invitations: true,
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
      phases: List.of("action", "event", "seed"),
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
    createRandomEvent: index <= EVENT_DEADLINE
  });
});

// console.log(calendar.toJS());

export default decoratedCalendar;
