import { pipe } from "ramda";
import r from "../services/random";
import table from "../services/league";
import { victors } from "../services/playoffs";

export const playersCompetitions = player => state => {
  return state.game.get("competitions").filter(c => {
    return c
      .get("teams")
      .includes(state.player.getIn(["players", player, "team"]));
  });
};

export const teamsStrength = team => state =>
  state.game.getIn(["teams", team, "strength"]);

export const teamWasRelegated = team => state => {
  const phlLoser = table(
    state.game.getIn(["competitions", "phl", "phases", 0, "groups", 0])
  ).last().id;

  if (phlLoser !== team) {
    return false;
  }

  const divisionVictor = victors(
    state.game.getIn(["competitions", "division", "phases", 3, "groups", 0])
  ).first().id;

  if (divisionVictor === team) {
    return false;
  }

  return true;
};

export const teamWasPromoted = team => state => {
  const competesInDivision = teamCompetesIn(team, "division")(state);
  if (!competesInDivision) {
    return false;
  }

  const divisionVictor = victors(
    state.game.getIn(["competitions", "division", "phases", 3, "groups", 0])
  ).first().id;

  if (divisionVictor === team) {
    return true;
  }

  return false;
};

export const teamsPositionInRoundRobin = (
  team,
  competition,
  phase
) => state => {
  const thePhase = state.game.getIn([
    "competitions",
    competition,
    "phases",
    phase
  ]);

  const group = thePhase
    .get("groups")
    .find(group => group.get("teams").includes(team));

  if (!group) {
    return false;
  }

  console.log("found group with id", group.toJS());

  const index = table(group).findIndex(e => e.id === team);

  if (index === -1) {
    return false;
  }

  return index + 1;
};

export const teamCompetesIn = (team, competition) => state => {
  return pipe(
    teamsCompetitions(team),
    competitions => competitions.map(c => c.get("id")).includes(competition)
  )(state);
};

export const teamsCompetitions = team => state => {
  return state.game.get("competitions").filter(c => {
    return c.get("teams").includes(team);
  });
};

export const teamHasActiveEffects = team => state => {
  const effects = state.game.getIn(["teams", team, "effects"]);
  return effects.count() > 0;
};

export const allTeams = state => state.game.get("teams");

export const pekkalandianTeams = state => state.game.get("teams").take(24);

export const playerHasService = (player, service) => state => {
  return state.player.getIn(["players", player, "services", service]);
};

export const playerWhoControlsTeam = id => state => {
  return state.player.get("players").find(p => p.get("team") === id);
};

export const competition = id => state =>
  state.game.getIn(["competitions", id]);

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

export const playersTeamId = player => state => {
  return playersTeam(player)(state).get("id");
};

export const playersDifficulty = player => state =>
  state.player.getIn(["players", player, "difficulty"]);

export const randomTeamFrom = (
  competitions,
  canBeHumanControlled = false
) => state => {
  const playersTeams = state.player.get("players").map(p => p.get("team"));

  const teams = state.game
    .get("competitions")
    .toList()
    .filter(c => competitions.includes(c.get("id")))
    .map(c => c.get("teams"))
    .flatten(true)
    .filter(t => {
      return canBeHumanControlled || !playersTeams.includes(t);
    });

  const randomized = r.pick(teams.toJS());

  return state.game.getIn(["teams", randomized]);
};

export const randomManager = (exclude = []) => state => {
  const managers = state.game.get("managers");
  const random = r.pick(managers.toArray());
  return random;
};

export const playersArena = player => state => {
  return state.player.getIn(["players", player, "arena"]);
};

export const playerHasEnoughMoney = (player, neededAmount) => state => {
  const amount = state.player.getIn(["players", player, "balance"]);
  return neededAmount <= amount;
};
