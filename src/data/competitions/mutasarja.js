import { Map, List, Range } from "immutable";
import rr from "../../services/round-robin";
import playoffScheduler, { victors } from "../../services/playoffs";
import { defaultMoraleBoost } from "../../services/morale";
import r from "../../services/random";

export default Map({
  relegateTo: false,
  promoteTo: "division",

  gameBalance: (phase, facts, manager) => {
    const arenaLevel = manager.getIn(["arena", "level"]) + 1;

    if (facts.isLoss) {
      return manager.get("extra");
    }

    if (facts.isDraw) {
      return 3000 + 2000 * arenaLevel + manager.get("extra");
    }

    return 10000 + 3000 * arenaLevel + manager.get("extra");
  },

  moraleBoost: (phase, facts, manager) => {
    return defaultMoraleBoost(facts);
  },

  readinessBoost: (phase, facts, manager) => {
    return 0;
  },

  parameters: Map({
    gameday: phase => ({
      advantage: Map({
        home: team => 5,
        away: team => -5
      }),
      base: () => 10,
      moraleEffect: team => {
        return team.get("morale");
      }
    })
  }),

  seed: List.of(
    competitions => {
      const competition = competitions.get("mutasarja");
      const teams = competition.get("teams").sortBy(() => r.real(1, 1000));
      const times = 2;

      const groups = Range(0, 2)
        .map(r => {
          const groupTeams = teams.slice(r * 12, r * 12 + 12);
          return Map({
            penalties: List(),
            type: "round-robin",
            round: 0,
            name: "runkosarja",
            teams: groupTeams,
            schedule: rr(groupTeams.count(), times),
            colors: List.of(
              "d",
              "d",
              "d",
              "d",
              "d",
              "d",
              "l",
              "l",
              "l",
              "l",
              "l",
              "l"
            )
          });
        })
        .toList();

      return Map({
        teams: teams,
        name: "runkosarja",
        type: "round-robin",
        times,
        groups
      });
    },
    competitions => {
      const teams = competitions
        .getIn(["division", "phases", 0, "groups", 0, "stats"])
        .map(e => e.get("id"))
        .take(6)
        .concat(
          competitions
            .getIn(["phl", "phases", 0, "groups", 0, "stats"])
            .map(e => e.get("id"))
            .last()
        );

      const matchups = List.of(List.of(0, 5), List.of(1, 4), List.of(2, 3));

      const winsToAdvance = 3;

      return Map({
        name: "neljännesfinaalit",
        type: "playoffs",
        teams,
        groups: List.of(
          Map({
            type: "playoffs",
            teams,
            round: 0,
            name: "quarterfinals",
            matchups,
            winsToAdvance,
            schedule: playoffScheduler(matchups, winsToAdvance)
          })
        )
      });
    },
    competitions => {
      const teams = List.of(
        competitions
          .getIn(["phl", "phases", 0, "groups", 0, "stats"])
          .map(e => e.get("id"))
          .last()
      ).concat(
        victors(
          competitions.getIn(["division", "phases", 1, "groups", 0])
        ).map(t => t.get("id"))
      );

      const matchups = List.of(List.of(0, 3), List.of(1, 2));

      const winsToAdvance = 3;

      return Map({
        name: "semifinaalit",
        type: "playoffs",
        teams,
        groups: List.of(
          Map({
            type: "playoffs",
            round: 0,
            name: "semifinals",
            teams,
            matchups,
            winsToAdvance,
            schedule: playoffScheduler(matchups, winsToAdvance)
          })
        )
      });
    },
    competitions => {
      const teams = victors(
        competitions.getIn(["division", "phases", 2, "groups", 0])
      ).map(t => t.get("id"));

      const matchups = List.of(List.of(0, 1));

      const winsToAdvance = 4;

      return Map({
        name: "finaalit",
        type: "playoffs",
        teams,
        groups: List.of(
          Map({
            type: "playoffs",
            round: 0,
            teams,
            matchups,
            winsToAdvance,
            schedule: playoffScheduler(matchups, winsToAdvance)
          })
        )
      });
    }
  )
});
