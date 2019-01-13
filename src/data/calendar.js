import { List, Map, Repeat } from "immutable";

const defaultPhases = List.of(
  "action",
  "prank",
  "gameday",
  "calculations",
  "event",
  "news",
  "seed"
);

const ehlPhases = List.of("action", "gameday");

const calendar = List.of(
  Map({
    phases: List.of("startOfSeason")
  })
)
  .concat(
    Repeat(
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
        })
      ),
      6
    )
      .toList()
      .flatten(true)
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
      phases: List.of("endOfSeason")
    })
  );

// console.log(calendar.toJS());

export default calendar;
