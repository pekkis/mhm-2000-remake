import {
  managersTeamId,
  randomManager,
  randomTeamFrom
} from "@/machines/selectors";
import random from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "jobofferDivision";

export type JobofferDivisionData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  oldTeam: number;
  offerer: number;
  offererName: string;
  resolved: boolean;
  agree?: boolean;
  otherManager?: string;
  /** Rolled at resolve: 2 + cinteger(0,2). */
  newArenaLevel?: number;
};

const SERVICES_RESET_ON_HIRE = [
  "coach",
  "cheer",
  "insurance",
  "microphone"
] as const;

/**
 * Job offer (Division) — interactive transfer. A non-EHL division
 * team offers you their bench, with sponsor money attached.
 * Accepting wipes services and resets balance/arena/insurance.
 *
 * 1-1 port of `@/game/events/joboffer-division.ts`. The
 * `cinteger(0,2)` arena roll moves to `resolve` so process is
 * deterministic.
 */
const jobofferDivision: DeclarativeEvent<JobofferDivisionData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const oldTeam = managersTeamId(manager)(ctx);
    const offerer = randomTeamFrom(["division"], false, [])(ctx);
    return {
      eventId,
      manager,
      oldTeam,
      offerer: offerer.id,
      offererName: offerer.name,
      resolved: false
    };
  },

  options: () => ({
    agree: `Kyllä otan!`,
    disagree: "En ota. Minun on hyvä täällä."
  }),

  resolve: (ctx, data, value) => {
    if (value === "agree") {
      return {
        ...data,
        resolved: true,
        agree: true,
        newArenaLevel: 2 + random.cinteger(0, 2)
      };
    }
    return {
      ...data,
      resolved: true,
      agree: false,
      otherManager: randomManager()(ctx).name
    };
  },

  render: (data) => {
    const lines = [
      `__${data.offererName}__ tarjoaa sinulle työpaikkaa!! Joukkue yrittää tosissaan nousua liigaan, ja sillä onkin uusi, todella mainio sponsorisopimus! Sponsori kuitenkin vaatii nimenomaisesti sinut manageriksi. Otatko tarjouksen vastaan?`
    ];
    if (!data.resolved) {
      return lines;
    }
    if (data.agree) {
      lines.push(
        `Katselet ympärillesi viimeistä kertaa. Tämä paikka on _niiiiin_ nähty.`
      );
    } else {
      lines.push(
        `OK, ei sitten. Tehtävään palkataan __${data.otherManager}__.`
      );
    }
    return lines;
  },

  process: (_ctx, data) => {
    if (!data.agree) {
      return [];
    }
    const effects: EventEffect[] = [
      { type: "hireManager", manager: data.manager, team: data.offerer },
      { type: "setBalance", manager: data.manager, amount: 2000000 },
      ...SERVICES_RESET_ON_HIRE.map(
        (s): EventEffect => ({
          type: "setService",
          manager: data.manager,
          service: s,
          value: false
        })
      ),
      {
        type: "setArenaLevel",
        manager: data.manager,
        level: data.newArenaLevel ?? 2
      },
      { type: "setInsuranceExtra", manager: data.manager, extra: 0 },
      { type: "setMorale", team: data.oldTeam, value: 0 },
      { type: "setMorale", team: data.offerer, value: 100 },
      { type: "setStrategy", team: data.oldTeam, value: 2 },
      { type: "setReadiness", team: data.oldTeam, value: 0 }
    ];
    return effects;
  }
};

export default jobofferDivision;
