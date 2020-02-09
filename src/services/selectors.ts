import {
  pipe,
  nth,
  filter,
  sortWith,
  ascend,
  values,
  prop,
  toPairs
} from "ramda";
import r from "./random";
import { victors } from "./playoffs";
import {
  MHMTurnDefinition,
  CompetitionNames,
  CompetitionPhase,
  CompetitionGroup,
  Competition,
  Turn
} from "../types/base";
import { MHMState } from "../ducks";
import {
  Team,
  ComputerControlledTeam,
  HumanControlledTeam
} from "../types/team";
import {
  isHumanManager,
  HumanManager,
  Manager,
  ComputerManager
} from "../types/manager";
import { SeasonStatistic } from "../types/stats";
import { isComputerControlledTeam, isHumanControlledTeam } from "./team";
import { isComputerManager } from "./manager";
import { Player } from "../types/player";

export const teamsContractedPlayers = (teamId: string) => (
  state: MHMState
): Player[] => {
  const playerMap = state.player.players;
  return values(playerMap).filter(p => p.contract?.team === teamId);
};

export const statsForSeason = (seasonId: number) => (
  state: MHMState
): SeasonStatistic => {
  return state.stats.seasons[seasonId];
};

export const playerById = (id: string) => (state: MHMState): Player =>
  state.player.players[id];

export const currentTurn = (state: MHMState): Turn => state.game.turn;

export const allCompetitions = (state: MHMState) =>
  state.competition.competitions;

export const advanceEnabled = (state: MHMState) => state.ui.advanceEnabled;

export const allManagersMap = (state: MHMState) => state.manager.managers;

export const allTeams = (state: MHMState) => values(state.team.teams);

export const computerManagerByName = (name: string) => (
  state: MHMState
): ComputerManager => {
  const manager = computerManagers(state).find(m => m.name === name);
  if (!manager) {
    throw new Error(`Could not find manager by name ${name}`);
  }

  return manager;
};

export const teamByName = (name: string) => (state: MHMState): Team => {
  const team = allTeams(state).find(t => t.name === name);
  if (!team) {
    throw new Error(`Could not find team by name ${name}`);
  }

  return team;
};

export const allTeamsInCompetitions = (competitionIds: CompetitionNames[]) => (
  state: MHMState
): Team[] => {
  const teams = competitionIds
    .map(cid => state.competition.competitions[cid].teams)
    .flat()
    .map(tid => state.team.teams[tid]);

  return teams;
};

export const allComputerControlledTeams = (
  state: MHMState
): ComputerControlledTeam[] => {
  return values(state.team.teams).filter(isComputerControlledTeam);
};

export const allHumanControlledTeams = (
  state: MHMState
): HumanControlledTeam[] => {
  return values(state.team.teams).filter(isHumanControlledTeam);
};

export const allTeamsMap = (state: MHMState) => state.team.teams;

export const humanManagers = (state: MHMState): HumanManager[] => {
  return values(state.manager.managers).filter(isHumanManager);
};

export const computerManagers = (state: MHMState): ComputerManager[] => {
  return values(state.manager.managers).filter(isComputerManager);
};

export const activeManager = (state: MHMState): HumanManager => {
  if (!state.manager.active) {
    throw new Error("No active manager");
  }

  const manager = state.manager.managers[state.manager.active];

  if (!isHumanManager(manager)) {
    throw new Error("Computer manager has the turn?!?!");
  }

  return manager;
};

export const managersCurrentTeam = (manager: string) => (
  state: MHMState
): string | undefined => {
  return state.manager.managers[manager].team;
};

export const competitionPhase = (
  competition: CompetitionNames,
  phase: number
) => (state: MHMState): CompetitionPhase => {
  return state.competition.competitions[competition].phases[phase];
};

export const competitionGroup = (
  competition: CompetitionNames,
  phase: number,
  group: number
) => (state: MHMState): CompetitionGroup =>
  state.competition.competitions[competition].phases[phase].groups[group];

export const domesticTeams = (state: MHMState): Team[] =>
  values(state.team.teams).filter(t => t.country === "FI");

export const foreignTeams = (state: MHMState): Team[] =>
  values(state.team.teams).filter(t => t.country !== "FI");

export const teamsMainCompetition = (team: string) => (state: MHMState) => {
  const mainCompetition = values(state.competition.competitions).find(c =>
    c.teams.includes(team)
  );
  if (!mainCompetition) {
    throw new Error(`Main competition not found for team ${team}`);
  }

  return mainCompetition;
};

export const playableCompetitions = (state: MHMState) =>
  filter(
    c => ["phl", "division", "mutasarja"].includes(c.id),
    state.competition.competitions
  );

export const currentCalendarEntry = (state: MHMState): MHMTurnDefinition => {
  const round = state.game.turn.round;
  const calendar = state.game.calendar;
  const calendarEntry = nth(round, calendar);
  if (!calendarEntry) {
    throw new Error("Invalid calendar entry");
  }
  return calendarEntry;
};

export const sortedTeamList = (state: MHMState): Team[] => {
  const sorter = sortWith<Team>([ascend(prop("name")), ascend(prop("id"))]);
  return sorter(values(state.team.teams));
};

export const managersTeam = (manager: string) => (
  state: MHMState
): string | undefined => state.manager.managers[manager].team;

export const managersTeamId = managersTeam;

export const requireManagersTeam = (manager: string) => (
  state: MHMState
): string => {
  const team = state.manager.managers[manager].team;
  if (!team) {
    throw new Error(`Manager ${manager} has no team`);
  }

  return team;
};

export const requireHumanManagersTeamObj = (manager: string) => (
  state: MHMState
): HumanControlledTeam => {
  const teamId = requireManagersTeam(manager)(state);

  const team = state.team.teams[teamId];
  if (!team) {
    throw new Error("Invalid managers team");
  }

  if (!isHumanControlledTeam(team)) {
    throw new Error("Must be human controlled");
  }

  return team;
};

export const requireManagersTeamObj = (manager: string) => (
  state: MHMState
): Team => {
  const teamId = requireManagersTeam(manager)(state);

  const team = state.team.teams[teamId];
  if (!team) {
    throw new Error("Invalid managers team");
  }

  return team;
};

export const interestingCompetitions = (manager: string) => (
  state: MHMState
): CompetitionNames[] => {
  const team = managersTeam(manager)(state);
  if (!team) {
    return [];
  }
  const competitions = values(state.competition.competitions);
  const interdasting = competitions.filter(c =>
    c.phases.some(phase => phase.teams.includes(team))
  );
  return interdasting.map(prop("id"));
};

export const weightedCompetitions = (state: MHMState): Competition[] => {
  const sorter = sortWith<Competition>([ascend(prop("weight"))]);
  return sorter(values(state.competition.competitions));
};

export const managerById = (managerId: string) => (
  state: MHMState
): Manager => {
  const manager = state.manager.managers[managerId];
  if (!manager) {
    throw new Error(`No manager exists by id ${managerId}`);
  }

  return manager;
};

export const teamById = (teamId: string) => (state: MHMState): Team => {
  const team = state.team.teams[teamId];
  if (!team) {
    throw new Error(`No team exists by id ${teamId}`);
  }

  return team;
};

// UNREFACTORED BEGINS

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

export const managerObject = (id: string) => (state: MHMState): Manager => {
  const manager = state.manager.managers[id];
  if (!manager) {
    throw new Error(`No manager found with id ${id}`);
  }
  return manager;
};

export const managersMainCompetition = manager => state => {
  const competesInPHL = managerCompetesIn(manager, "phl")(state);
  return competesInPHL ? "phl" : "division";
};

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
  return pipe(teamsCompetitions(team), competitions =>
    competitions.map(c => c.get("id")).includes(competition)
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

export const managersBalance = manager => state =>
  state.manager.getIn(["managers", manager, "balance"]);

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
