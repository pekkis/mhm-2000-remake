import { PlayerPosition, Player } from "../types/player";
import { Manager } from "../types/manager";
import { Team } from "../types/team";
import {
  repeat,
  sum,
  indexBy,
  range,
  over,
  lensProp,
  evolve,
  values
} from "ramda";
import random from "./random";
import {
  createRandomPlayer,
  getRandomCountry,
  getBaseSalary,
  isDefenceman,
  isForward,
  normalizeAbility
} from "./player";

export interface PlayerGenerationInfo {
  position: PlayerPosition;
  skill: number;
}

const doPointAllocations = (
  allocados: [number, string[], number][],
  players: Player[]
): Player[] => {
  return allocados.reduce((players, allocado) => {
    const [numberOfPoints, positions, increment] = allocado;
    return allocatePoints(numberOfPoints, positions, increment, players);
  }, players);
};

const allocatePoints = (
  numberOfPoints: number,
  positions: string[] = ["g", "d", "lw", "c", "rw"],
  increment: number,
  players: Player[]
) => {
  const allocatablePlayers = players
    .filter(p => positions.includes(p.position))
    .map(p => p.id);

  const playersMap = indexBy(p => p.id, players);

  const evolvedPlayerMap = range(0, numberOfPoints + 1)
    .map(() => random.pick(allocatablePlayers))
    .reduce(
      (pm, pid) =>
        over(
          lensProp(pid),
          evolve({ skill: s => normalizeAbility(s + increment) }),
          pm
        ),
      playersMap
    );

  return values(evolvedPlayerMap);
};

const getNumberOfRandomDefenderAllocations = (baseSkill: number) => {
  if (baseSkill <= 7) {
    return 3;
  }

  if (baseSkill <= 9) {
    return 5;
  }

  return 9;
};

const getNumberOfRandomForwardAllocations = (baseSkill: number) => {
  if (baseSkill <= 7) {
    return 7;
  }

  if (baseSkill <= 9) {
    return 9;
  }

  return 13;
};

const playersFromGenerationInfo = (
  info: PlayerGenerationInfo[],
  contractTeam: string,
  getContractYears: () => number
) => {
  const players = info
    .map(preset => {
      const country = random.integer(0, 100) < 70 ? "FI" : getRandomCountry();
      return createRandomPlayer({
        ...preset,
        country
      });
    })
    .map(
      (player: Player): Player => {
        return {
          ...player,
          contract: {
            team: contractTeam,
            years: 1,
            yearsLeft: getContractYears(),
            salary: getBaseSalary(player),
            freeKickOption: false,
            nhlOption: false
          }
        };
      }
    );

  return players;
};

export const generatePlayers = (manager: Manager, team: Team): Player[] => {
  const goalieSkill = team.strength.g;
  const defenderSkill = Math.floor(team.strength.d / 6);
  const forwardSkill = Math.floor(team.strength.a / 12);

  console.log(goalieSkill, defenderSkill, forwardSkill);

  const players = playersFromGenerationInfo(
    [
      { position: "g" as PlayerPosition, skill: goalieSkill },
      {
        position: "g" as PlayerPosition,
        skill: goalieSkill - 1 - random.integer(0, 2)
      },
      ...repeat({ position: "d" as PlayerPosition, skill: defenderSkill }, 6),
      ...repeat({ position: "lw" as PlayerPosition, skill: forwardSkill }, 4),
      ...repeat({ position: "c" as PlayerPosition, skill: forwardSkill }, 4),
      ...repeat({ position: "rw" as PlayerPosition, skill: forwardSkill }, 4)
    ],
    team.id,
    () => random.pick([0, 1])
  );

  const defendersTotalSkill = sum(
    players.filter(isDefenceman).map(p => p.skill)
  );
  const forwardsTotalSkill = sum(players.filter(isForward).map(p => p.skill));

  const defenderPointsToAllocate = team.strength.d - defendersTotalSkill;
  const forwardPointsToAllocate = team.strength.a - forwardsTotalSkill;

  const playersReAllocated = doPointAllocations(
    [
      [defenderPointsToAllocate, ["d"], 1],
      [forwardPointsToAllocate, ["lw", "c", "rw"], 1]
    ],
    players
  );

  const randomDefenderAllocations = getNumberOfRandomDefenderAllocations(
    defenderSkill
  );

  const randomForwardAllocations = getNumberOfRandomForwardAllocations(
    forwardSkill
  );

  const extraPlayers = playersFromGenerationInfo(
    [
      {
        position: "d" as PlayerPosition,
        skill: normalizeAbility(defenderSkill - 1 - random.integer(0, 3))
      },
      {
        position: "lw" as PlayerPosition,
        skill: normalizeAbility(defenderSkill - 1 - random.integer(0, 3))
      },
      {
        position: "c" as PlayerPosition,
        skill: normalizeAbility(defenderSkill - 1 - random.integer(0, 3))
      },
      {
        position: "rw" as PlayerPosition,
        skill: normalizeAbility(defenderSkill - 1 - random.integer(0, 3))
      }
    ],
    team.id,
    () => 1
  );

  const finalPlayers = [...playersReAllocated, ...extraPlayers];

  return doPointAllocations(
    [
      [randomDefenderAllocations, ["d"], -1],
      [randomDefenderAllocations, ["d"], +1],
      [randomForwardAllocations, ["lw", "c", "rw"], -1],
      [randomForwardAllocations, ["lw", "c", "rw"], +1]
    ],
    finalPlayers
  );
};
