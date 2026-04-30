import { managersMainCompetition, managersTeamId } from "@/machines/selectors";
import r from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "fortuneTeller";

type Omen = "good" | "bad";
type Competition = "phl" | "division";

const prophecies: Record<
  Competition,
  Record<Omen, { prophecy: string; moraleChange: number }>
> = {
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

export type FortuneTellerData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  competition: Competition;
  omen: Omen;
};

/**
 * Fortune teller — pre-resolved. Random good/bad prophecy
 * tailored to your main competition. Morale ±5.
 *
 * 1-1 port of `@/game/events/fortune-teller.ts`.
 */
const fortuneTeller: DeclarativeEvent<FortuneTellerData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    competition: managersMainCompetition(manager)(ctx) as Competition,
    omen: r.pick(["good", "bad"]) as Omen
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

export default fortuneTeller;
