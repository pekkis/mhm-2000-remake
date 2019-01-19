import { pipe } from "ramda";
import r from "../services/random";
import { victors } from "../services/playoffs";
import { List } from "immutable";

export const foreignTeams = state =>
  state.game.get("teams").filter(t => !t.get("domestic"));

export const totalGamesPlayed = (manager, competition, phase) => state => {
  const stats = state.stats.getIn([
    "managers",
    manager,
    "games",
    competition,
    phase
  ]);

  if (!stats) {
    return 0;
  }

  // const phlGamesPlayed = stats.reduce((r, s) => r + s, 0);
};

export const teamsManagerId = team => state =>
  state.game.getIn(["teams", team, "manager"]);

export const teamsManager = team => state =>
  state.manager.getIn([
    "managers",
    state.game.getIn(["teams", team, "manager"])
  ]);

export const managerObject = manager => state =>
  state.manager.getIn(["managers", manager]);

export const managersMainCompetition = manager => state => {
  const competesInPHL = managerCompetesIn(manager, "phl")(state);
  return competesInPHL ? "phl" : "division";
};

export const teamsMainCompetition = team => state => {
  console.log("team", team);

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
    return c.get("teams", List()).includes(team);
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
  const competitions = managersCompetitions(manager)(state);
  return competitions.map(c => c.get("id")).includes(competition);
};

export const flag = flag => state => {
  return state.game.getIn(["flags", flag]);
};

export const managerFlag = (manager, flag) => state =>
  state.manager.getIn(["managers", manager, "flags", flag]);

export const managersTeam = manager => state =>
  state.game.getIn([
    "teams",
    state.manager.getIn(["managers", manager, "team"])
  ]);

export const managersBalance = manager => state =>
  state.manager.getIn(["managers", manager, "balance"]);

export const managersTeamId = manager => state => {
  return managersTeam(manager)(state).get("id");
};

export const managersDifficulty = manager => state =>
  state.manager.getIn(["managers", manager, "difficulty"]);

export const randomRankedTeam = (
  competitionId,
  phaseId,
  range,
  f = () => true
) => state => {
  const managers = state.manager.get("managers").map(m => m.get("id"));

  const ret = state.game
    .getIn(["competitions", competitionId, "phases", phaseId, "groups"])
    .flatMap(group => {
      console.log(group, "g");

      return group
        .get("stats")
        .map(s => s.get("id"))
        .filter((t, i) => range.includes(i))
        .map(t => state.game.getIn(["teams", t]))
        .filterNot(t => managers.includes(t.get("manager")))
        .filter(f);
    });

  console.log(ret.toJS(), "wut the fuk?");

  if (ret.count() === 0) {
    return false;
  }

  const randomized = r.pick(ret.toArray());
  return state.game.getIn(["teams", randomized.get("id")]);
};

export const randomTeamFrom = (
  competitions,
  canBeHumanControlled = false,
  excluded = [],
  f = () => true
) => state => {
  console.log(excluded, "excommunicado");

  const managersTeams = state.manager.get("managers").map(p => p.get("team"));

  const teams = state.game
    .get("competitions")
    .toList()
    .filter(c => competitions.includes(c.get("id")))
    .map(c => c.get("teams"))
    .flatten(true)
    .map(t => state.game.getIn(["teams", t]))
    .filter(t => {
      console.log("T", t);
      return canBeHumanControlled || !managersTeams.includes(t.get("id"));
    })
    .filterNot(t => excluded.includes(t.get("id")))
    .filter(f);

  if (teams.count() === 0) {
    return false;
  }

  const randomized = r.pick(teams.toArray());
  return state.game.getIn(["teams", randomized.get("id")]);
};

export const interestingCompetitions = manager => state => {
  const team = managersTeam(manager)(state);

  return state.game
    .get("competitions")
    .filter(competition => {
      return competition.get("phases").some(phase => {
        return phase
          .get("groups")
          .some(group => group.get("teams").includes(team.get("id")));
      });

      // return competition.get("teams").includes(team.get("id"));
    })
    .map(c => c.get("id"));
};

export const randomManager = (exclude = []) => state => {
  // Psycho event filter out.
  const psycho = flag("psycho")(state);
  const managers = state.game
    .get("managers")
    .filterNot(m => m.get("id") === psycho)
    .filterNot(m => exclude.includes(m.get("id")));

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
