import {
  randomManager,
  randomRankedTeam,
  randomTeamOrNullFrom
} from "@/machines/selectors";
import random from "@/services/random";
import type { Team } from "@/state/game";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "moneyTroubles";

export type MoneyTroublesData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  otherManager: string;
  phlTeam: number;
  phlTeamName: string;
  divTeam: number;
  divTeamName: string;
  strengthTransfer: number;
};

/**
 * Money troubles — pre-resolved. Bottom-ranked PHL team sells
 * stars to a strong (>95) division team; strength transfer
 * `cinteger(0,15) + 12`.
 *
 * 1-1 port of `@/game/events/money-troubles.ts`.
 */
const moneyTroubles: DeclarativeEvent<MoneyTroublesData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const phlTeam = randomRankedTeam("phl", 0, [9, 10, 11])(ctx);
    const divTeam = randomTeamOrNullFrom(
      ["division"],
      false,
      [],
      (t: Team) => t.strength > 95
    )(ctx);
    if (!phlTeam || !divTeam) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true,
      otherManager: randomManager()(ctx).name,
      phlTeam: phlTeam.id,
      phlTeamName: phlTeam.name,
      divTeam: divTeam.id,
      divTeamName: divTeam.name,
      strengthTransfer: random.cinteger(0, 15) + 12
    };
  },

  render: (data) => [
    `Divisioonasta:

Manageri ${data.otherManager} ja joukkueensa __${data.divTeamName}__ pistävät tuulemaan! He ostavat rahavaikeuksiin joutuneelta liigajoukkueelta (__${data.phlTeamName})__ heidän parhaat pelaajansa.`
  ],

  process: (_ctx, data) => [
    {
      type: "incrementStrength",
      team: data.phlTeam,
      amount: -data.strengthTransfer
    },
    {
      type: "incrementStrength",
      team: data.divTeam,
      amount: data.strengthTransfer
    }
  ]
};

export default moneyTroubles;
