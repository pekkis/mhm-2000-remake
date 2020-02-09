import { Player } from "../types/player";
import { Lineup, TeamStrength } from "../types/team";
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
  differenceWith
} from "ramda";
import { getEffectiveSkillAs } from "./player";

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

export const assignPlayerToGoalkeeper = (lineup: Lineup, player?: Player) => {
  return assocPath(["g"], player?.id, lineup);
};

export const assignPlayerToDefenceLine = (
  lineNumber: number,
  position: string,
  lineup: Lineup,
  player?: Player
) => {
  return assocPath(["d", lineNumber, position], player?.id, lineup);
};

export const assignPlayerToForwardLine = (
  lineNumber: number,
  position: string,
  lineup: Lineup,
  player?: Player
) => {
  return assocPath(["a", lineNumber, position], player?.id, lineup);
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

export const calculateStrengthFromLineup = (
  players: Player[],
  lineup: Lineup
): TeamStrength => {
  const playerMap = indexBy(prop("id"), players);

  return {
    g: getEffectiveSkill(playerMap, "g", lineup.g),
    d: 0,
    a: 0,
    pp: -1,
    pk: -1
  };
};

export const automateLineup = (players: Player[]): Lineup => {
  const initialLineup: Lineup = getEmptyLineup();

  const playerMap = indexBy(prop("id"), players);

  const goalkeepers = sortPlayersForPosition("g", ["g"], players);

  const [leftDefencemen, rightDefenceMen] = sortPlayersForPositions(
    ["ld", "rd"],
    ["d"],
    players
  );

  // const leftDefencemen = sortPlayersForPosition("ld", ["d"], players);
  // const rightDefencemen = sortPlayersForPosition("rd", ["d"], players);
  const leftWings = sortPlayersForPosition("lw", ["lw"], players);
  const centers = sortPlayersForPosition("c", ["c"], players);
  const rightWings = sortPlayersForPosition("rw", ["rw"], players);

  const getter = mapHandler(playerMap);

  const operations = [
    (lineup: Lineup) =>
      assignPlayerToGoalkeeper(lineup, getter(nth(0, goalkeepers))),
    ...range(0, 3).map(pairing => {
      return [
        (lineup: Lineup) =>
          assignPlayerToDefenceLine(
            pairing,
            "ld",
            lineup,
            getter(nth(pairing * 2, leftDefencemen))
          ),
        (lineup: Lineup) =>
          assignPlayerToDefenceLine(
            pairing,
            "rd",
            lineup,
            getter(nth(pairing * 2 + 1, rightDefenceMen))
          )
      ];
    }),
    ...range(0, 4).map(lineNo => {
      return [
        (lineup: Lineup) =>
          assignPlayerToForwardLine(
            lineNo,
            "lw",
            lineup,
            getter(nth(lineNo, leftWings))
          ),
        (lineup: Lineup) =>
          assignPlayerToForwardLine(
            lineNo,
            "c",
            lineup,
            getter(nth(lineNo, centers))
          ),
        (lineup: Lineup) =>
          assignPlayerToForwardLine(
            lineNo,
            "rw",
            lineup,
            getter(nth(lineNo, rightWings))
          )
      ];
    })
  ].flat();

  console.log(operations, "operatore");

  return operations.reduce(
    (lineup, operation) => operation(lineup),
    initialLineup
  );

  /*

  return {
    g: nth(0, goalkeepers),
    d: [
      {
        ld: nth(0, defencemen),
        rd: nth(1, defencemen)
      },
      {
        ld: nth(2, defencemen),
        rd: nth(3, defencemen)
      },
      {
        ld: nth(4, defencemen),
        rd: nth(5, defencemen)
      }
    ],
    a: [
      {
        lw: nth(0, leftWings),
        c: nth(0, centers),
        rw: nth(0, rightWings)
      },
      {
        lw: nth(1, leftWings),
        c: nth(1, centers),
        rw: nth(1, rightWings)
      },
      {
        lw: nth(2, leftWings),
        c: nth(2, centers),
        rw: nth(2, rightWings)
      },
      {
        lw: nth(3, leftWings),
        c: nth(3, centers),
        rw: nth(3, rightWings)
      }
    ]
  };
  */
};

const lineupService = {
  automateLineup
};

export default lineupService;
