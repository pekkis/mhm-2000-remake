import { Player } from "../types/player";
import { Lineup, TeamStrength, DefenceLine, ForwardLine } from "../types/team";
import { MapOf } from "../types/base";
import {
  sortWith,
  ascend,
  descend,
  prop,
  nth,
  indexBy,
  assocPath,
  range,
  differenceWith,
  values,
  path,
  dissocPath,
  sum
} from "ramda";
import { getEffectiveSkillAs } from "./player";

const flattenLineup = (lineup: Lineup) => {
  return [lineup.g, ...lineup.d.map(dl => values(dl))].filter(p => p);
};

const playerIsInLineup = (lineup: Lineup, player: Player) => {
  const flattened = flattenLineup(lineup);
  return flattened.includes(player.id) && lineup.g !== player.id;
};

interface IsAssignableFunc {
  (lineup: Lineup, player: Player): boolean;
}

const createForwardLineAssignPossibility = (lineNumber: number) => ({
  lw: (lineup: Lineup, player: Player): boolean => {
    if (lineup.a[lineNumber].c === player.id) {
      return false;
    }

    if (lineup.a[lineNumber].rw === player.id) {
      return false;
    }

    return true;
  },

  c: (lineup: Lineup, player: Player): boolean => {
    if (lineup.a[lineNumber].lw === player.id) {
      return false;
    }

    if (lineup.a[lineNumber].rw === player.id) {
      return false;
    }

    return true;
  },

  rw: (lineup: Lineup, player: Player): boolean => {
    if (lineup.a[lineNumber].lw === player.id) {
      return false;
    }

    if (lineup.a[lineNumber].c === player.id) {
      return false;
    }

    return true;
  }
});

const createDefenceLineAssignPossibility = (lineNumber: number) => ({
  ld: (lineup: Lineup, player: Player): boolean => {
    if (lineup.d[lineNumber].rd === player.id) {
      return false;
    }

    return true;
  },

  rd: (lineup: Lineup, player: Player): boolean => {
    if (lineup.d[lineNumber].ld === player.id) {
      return false;
    }
    return true;
  }
});

const assignPossibilities = {
  g: (lineup: Lineup, player: Player) => {
    return !playerIsInLineup(lineup, player);
  },
  d: [
    createDefenceLineAssignPossibility(0),
    createDefenceLineAssignPossibility(1),
    createDefenceLineAssignPossibility(2)
  ],
  a: [
    createForwardLineAssignPossibility(0),
    createForwardLineAssignPossibility(1),
    createForwardLineAssignPossibility(2),
    createForwardLineAssignPossibility(3)
  ]
};

export const isPlayerAssignableToLineup = (
  pathToPosition: (string | number)[],
  lineup: Lineup,
  player: Player
): boolean => {
  const isAssignableFunc: IsAssignableFunc | undefined = path(
    pathToPosition,
    assignPossibilities
  );
  if (!isAssignableFunc) {
    throw new Error(`Invalid position path ${pathToPosition.join(";")}`);
  }

  const isAssignable = isAssignableFunc(lineup, player);
  return isAssignable;
};

export const assignPlayerToLineup = (
  pathToPosition: (string | number)[],
  lineup: Lineup,
  player?: Player
): Lineup => {
  const isAssignableFunc: IsAssignableFunc | undefined = path(
    pathToPosition,
    assignPossibilities
  );
  if (!isAssignableFunc) {
    throw new Error(`Invalid position path ${pathToPosition.join(";")}`);
  }
  if (!player) {
    return dissocPath(pathToPosition, lineup);
  }

  if (!isPlayerAssignableToLineup(pathToPosition, lineup, player)) {
    throw new Error("Player is not assignable to lineup");
  }

  return assocPath(pathToPosition, player.id, lineup);
};

export const createEffectiveSkillSorter = (position: string) => {
  const sorter = sortWith<Player>([
    descend(p => {
      return getEffectiveSkillAs(position, p);
    }),
    ascend(prop("age"))
  ]);

  return sorter;
};

export const sortPlayersForPosition = (
  position: string,
  allowPositions: string[],
  players: Player[]
) => {
  const sorter = createEffectiveSkillSorter(position);

  return sorter(players)
    .filter(p => allowPositions.includes(p.position))
    .map(prop("id"));
};

const sorterGenerator = function*(
  positions: string[],
  allowPositions: string[],
  initialPlayers: Player[]
) {
  const yieldedPlayers: Player[] = [];

  const players = initialPlayers.filter(p =>
    allowPositions.includes(p.position)
  );

  const sorters = positions.map(pos => createEffectiveSkillSorter(pos));

  do {
    for (const [i, position] of positions.entries()) {
      const useablePlayers = differenceWith(
        (a, b) => a.id === b.id,
        players,
        yieldedPlayers
      );

      const sortedPlayers = sorters[i](useablePlayers);

      const yieldPlayer = nth(0, sortedPlayers);
      if (!yieldPlayer) {
        return;
      }

      yieldedPlayers.push(yieldPlayer);

      yield {
        position,
        player: yieldPlayer
      };
    }
  } while (true);
};

export const sortPlayersForPositions = (
  positions: string[],
  allowPositions: string[],
  players: Player[]
) => {
  const generated: { position: string; player: Player }[] = [];
  for (const player of sorterGenerator(positions, allowPositions, players)) {
    generated.push(player);
  }

  return positions.map(p =>
    generated.filter(g => g.position === p).map(g => g.player.id)
  );
};

export const mapHandler = (players: MapOf<Player>) => {
  return (id?: string) => {
    if (!id) {
      return undefined;
    }
    return players[id];
  };
};

export const getEmptyLineup = (): Lineup => {
  return {
    g: undefined,
    d: [{}, {}, {}],
    a: [{}, {}, {}, {}]
  };
};

const getEffectiveSkill = (
  players: MapOf<Player>,
  position: string,
  playerId?: string
) => {
  if (!playerId) {
    return -1;
  }

  const player = players[playerId];
  if (!player) {
    return -1;
  }

  return getEffectiveSkillAs(position, player);
};

export const isDefenceLineComplete = (line: DefenceLine) => {
  if (!line.ld || !line.ld) {
    return false;
  }

  return true;
};

export const isForwardLineComplete = (line: ForwardLine) => {
  if (!line.lw || !line.c || !line.rw) {
    return false;
  }

  return true;
};

export const calculateDefenceStrengthFromLineup = (
  players: MapOf<Player>,
  lineup: Lineup
): number => {
  return sum(
    lineup.d.map(line => {
      if (!isDefenceLineComplete(line)) {
        return 0;
      }

      const completeLine = line as Required<DefenceLine>;

      return sum([
        getEffectiveSkillAs("ld", players[completeLine.ld]),
        getEffectiveSkillAs("rd", players[completeLine.rd])
      ]);
    })
  );
};

export const calculateAttackStrengthFromLineup = (
  players: MapOf<Player>,
  lineup: Lineup
): number => {
  return sum(
    lineup.a.map(line => {
      if (!isForwardLineComplete(line)) {
        return 0;
      }

      const completeLine = line as Required<ForwardLine>;

      return sum([
        getEffectiveSkillAs("lw", players[completeLine.lw]),
        getEffectiveSkillAs("c", players[completeLine.c]),
        getEffectiveSkillAs("rw", players[completeLine.c])
      ]);
    })
  );
};

export const calculatePowerPlayStrengthFromLineup = (
  players: MapOf<Player>,
  lineup: Lineup
): number => {
  return -1;
};

export const calculatePenaltyKillStrengthFromLineup = (
  players: MapOf<Player>,
  lineup: Lineup
): number => {
  return -1;
};

export const calculateStrengthFromLineup = (
  players: Player[],
  lineup: Lineup
): TeamStrength => {
  const playerMap = indexBy(prop("id"), players);

  return {
    g: lineup.g ? getEffectiveSkill(playerMap, "g", lineup.g) : 0,
    d: calculateDefenceStrengthFromLineup(playerMap, lineup),
    a: calculateAttackStrengthFromLineup(playerMap, lineup),
    pp: calculatePowerPlayStrengthFromLineup(playerMap, lineup),
    pk: calculatePenaltyKillStrengthFromLineup(playerMap, lineup)
  };
};

export const automateLineup = (players: Player[]): Lineup => {
  const initialLineup: Lineup = getEmptyLineup();
  const playerMap = indexBy(prop("id"), players);

  const goalkeepers = sortPlayersForPosition("g", ["g"], players);
  const [leftDefencemen, rightDefencemen] = sortPlayersForPositions(
    ["ld", "rd"],
    ["d"],
    players
  );
  const leftWings = sortPlayersForPosition("lw", ["lw"], players);
  const centers = sortPlayersForPosition("c", ["c"], players);
  const rightWings = sortPlayersForPosition("rw", ["rw"], players);

  const getter = mapHandler(playerMap);

  type Operazion = [(string | number)[], number, string[]];

  // This is like this just because TypeScript wants it to be or it doesn't fucking understand what I'm doing.
  const operations: Operazion[] = [
    [["g"], 0, goalkeepers],
    ...range(0, 3)
      .map(pairing => {
        const operations: Operazion[] = [
          [["d", pairing, "ld"], pairing, leftDefencemen],
          [["d", pairing, "rd"], pairing, rightDefencemen]
        ];
        return operations;
      })
      .flat(),

    ...range(0, 4)
      .map(pairing => {
        const operations: Operazion[] = [
          [["a", pairing, "lw"], pairing, leftWings],
          [["a", pairing, "c"], pairing, centers],
          [["a", pairing, "rw"], pairing, rightWings]
        ];
        return operations;
      })
      .flat()
  ];
  return operations.reduce(
    (lineup, [path, bestest, from]) =>
      assignPlayerToLineup(path, lineup, getter(nth(bestest, from))),
    initialLineup
  );
};

const lineupService = {
  automateLineup
};

export default lineupService;
