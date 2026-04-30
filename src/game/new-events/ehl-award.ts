import { managersMainCompetition, managersTeamId } from "@/machines/selectors";
import r from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "ehlAward";

type Prophecy = { prophecy: string; moraleChange: number };

const prophecies: Record<string, Record<string, Prophecy>> = {
  phl: {
    good: {
      prophecy: `Ennustajaeukko lupaa __kolmea__ peräkkäistä mestaruutta!`,
      moraleChange: 5
    },
    bad: {
      prophecy: `Ennustajaeukko lupaa pudotusta __divisioonaan__.`,
      moraleChange: -5
    }
  },
  division: {
    good: {
      prophecy: `Ennustajaeukko lupaa __liiganousua__.`,
      moraleChange: 5
    },
    bad: {
      prophecy: `Ennustajaeukko lupaa __vaikeita aikoja__.`,
      moraleChange: -5
    }
  }
};

export type EhlAwardData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  competition: string;
  omen: string;
};

/**
 * EHL award — pre-resolved. _Note:_ the existing saga is a literal
 * duplicate of `fortuneTeller` (the BASIC source talks about EHL
 * money but the saga implements prophecy text + ±5 morale). Ported
 * 1-1 from the saga; correctness can be revisited in a separate
 * BASIC-parity audit.
 */
const ehlAward: DeclarativeEvent<EhlAwardData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    competition: managersMainCompetition(manager)(ctx),
    omen: r.pick(["good", "bad"])
  }),

  render: (data) => [prophecies[data.competition][data.omen].prophecy],

  process: (ctx, data) => [
    {
      type: "incrementMorale",
      team: managersTeamId(data.manager)(ctx),
      amount: prophecies[data.competition][data.omen].moraleChange
    }
  ]
};

export default ehlAward;
