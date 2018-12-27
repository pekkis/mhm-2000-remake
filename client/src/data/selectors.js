import { pipe } from "ramda";
import r from "../services/random";

export const playersCompetitions = player => state => {
  return state.game.get("competitions").filter(c => {
    return c
      .get("teams")
      .includes(state.player.getIn(["players", player, "team"]));
  });
};

export const playerCompetesIn = (player, competition) => state => {
  return pipe(
    playersCompetitions(player),
    competitions => competitions.map(c => c.get("id")).includes(competition)
  )(state);
};

export const flag = flag => state => {
  return state.game.getIn(["flags", flag]);
};

export const playersTeam = player => state =>
  state.game.getIn(["teams", state.player.getIn(["players", player, "team"])]);

export const playersDifficulty = player => state =>
  state.player.getIn(["players", player, "difficulty"]);

export const randomTeamFrom = (competitions, canBeHumanControlled) => state => {
  const playersTeams = state.player.get("players").map(p => p.get("team"));

  const teams = state.game
    .get("competitions")
    .toList()
    .filter(c => competitions.includes(c.get("id")))
    .map(c => c.get("teams"))
    .flatten(true)
    .filter(t => {
      console.log("t", t);
      return canBeHumanControlled || !playersTeams.includes(t);
    });

  const randomized = r.pick(teams.toJS());

  return state.game.getIn(["teams", randomized]);
};
