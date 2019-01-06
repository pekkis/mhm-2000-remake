import { pipe } from "ramda";
import r from "../services/random";
import { victors } from "../services/playoffs";

export const teamsManagerId = team => state =>
  state.game.getIn(["teams", team, "manager"]);

export const teamsManager = team => state =>
  state.manager.getIn([
    "managers",
    state.game.getIn(["teams", team, "manager"])
  ]);

export const managersMainCompetition = manager => state => {
  const competesInPHL = managerCompetesIn(manager, "phl")(state);
  return competesInPHL ? "phl" : "division";
};

export const teamsMainCompetition = team => state => {
  const competesInPHL = teamCompetesIn(team, "phl")(state);
  return competesInPHL ? "phl" : "division";
};

export const managerById = manager => state =>
  state.manager.getIn(["managers", manager]);

export const managersCompetitions = manager => state => {
  return state.game.get("competitions").filter(c => {
    return c
      .get("teams")
      .includes(state.manager.getIn(["managers", manager, "team"]));
  });
};

export const teamsStrength = team => state =>
  state.game.getIn(["teams", team, "strength"]);

export const teamWasRelegated = team => state => {
  const phlLoser = state.game
    .getIn(["competitions", "phl", "phases", 0, "groups", 0, "stats"])
    .last()
    .get("id");

  if (phlLoser !== team) {
    return false;
  }

  const divisionVictor = victors(
    state.game.getIn(["competitions", "division", "phases", 3, "groups", 0])
  )
    .first()
    .get("id");

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
  )
    .first()
    .get("id");

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

  const index = group.get("stats").findIndex(e => e.get("id") === team);

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

export const managerHasService = (manager, service) => state => {
  return state.manager.getIn(["managers", manager, "services", service]);
};

export const managerWhoControlsTeam = id => state => {
  return state.manager.get("managers").find(p => p.get("team") === id);
};

export const competition = id => state =>
  state.game.getIn(["competitions", id]);

export const managerCompetesIn = (manager, competition) => state => {
  return pipe(
    managersCompetitions(manager),
    competitions => competitions.map(c => c.get("id")).includes(competition)
  )(state);
};

export const flag = flag => state => {
  return state.game.getIn(["flags", flag]);
};

export const managersTeam = manager => state =>
  state.game.getIn([
    "teams",
    state.manager.getIn(["managers", manager, "team"])
  ]);

export const managersTeamId = manager => state => {
  return managersTeam(manager)(state).get("id");
};

export const managersDifficulty = manager => state =>
  state.manager.getIn(["managers", manager, "difficulty"]);

export const randomTeamFrom = (
  competitions,
  canBeHumanControlled = false
) => state => {
  const managersTeams = state.manager.get("managers").map(p => p.get("team"));

  const teams = state.game
    .get("competitions")
    .toList()
    .filter(c => competitions.includes(c.get("id")))
    .map(c => c.get("teams"))
    .flatten(true)
    .filter(t => {
      return canBeHumanControlled || !managersTeams.includes(t);
    });

  const randomized = r.pick(teams.toJS());

  return state.game.getIn(["teams", randomized]);
};

export const randomManager = (exclude = []) => state => {
  const managers = state.game.get("managers");
  const random = r.pick(managers.toArray());
  return random;
};

export const managersArena = manager => state => {
  return state.manager.getIn(["managers", manager, "arena"]);
};

export const managerHasEnoughMoney = (manager, neededAmount) => state => {
  const amount = state.manager.getIn(["managers", manager, "balance"]);
  return neededAmount <= amount;
};

export const managerWithId = id => state =>
  state.manager.getIn(["managers", id]);
