import {
  managersTeamId,
  randomManager,
  randomTeamFrom
} from "@/machines/selectors";
import table from "@/services/league";
import random from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "jobofferPHL";

export type JobofferPHLData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  oldTeam: number;
  offerer: number;
  offererName: string;
  ranking: number;
  resolved: boolean;
  agree?: boolean;
  /** Set on resolve: the manager hired in your stead (when you decline). */
  otherManager?: string;
  /**
   * Rolled at resolve time when the player accepts: 3 + cinteger(0,3).
   * Baked into the payload so process() is fully deterministic.
   */
  newArenaLevel?: number;
};

const SERVICES_RESET_ON_HIRE = [
  "coach",
  "cheer",
  "insurance",
  "microphone"
] as const;

/**
 * Job offer (PHL) — interactive transfer event. A randomly-picked
 * non-EHL PHL team offers you their bench. Accepting wipes your
 * services / arena / insurance to defaults and detaches you from
 * your current team (which gets reset morale/readiness/strategy).
 *
 * 1-1 port of the saga version in `@/game/events/joboffer-phl.ts`.
 *
 * Behavior preserved exactly, with one shape change agreed in the
 * migration plan: the `cinteger(0, 3)` arena roll moves from
 * `process` to `resolve`. The rolled value lives on the stored
 * payload, which keeps `process` pure (and means the rolled level
 * survives save/load mid-resolution).
 */
const jobofferPHL: DeclarativeEvent<JobofferPHLData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const oldTeam = managersTeamId(manager)(ctx);
    const ehlTeams = ctx.competitions.ehl.teams;
    const offerer = randomTeamFrom(["phl"], false, ehlTeams)(ctx);
    const group = ctx.competitions.phl.phases[0].groups[0];
    const ranking = table(group).findIndex((t) => t.id === offerer.id) + 1;

    return {
      eventId,
      manager,
      oldTeam,
      offerer: offerer.id,
      offererName: offerer.name,
      ranking,
      resolved: false
    };
  },

  options: () => ({
    agree: `Kyllä, ilman muuta!`,
    disagree: "Ei, kiitos."
  }),

  resolve: (ctx, data, value) => {
    const agree = value === "agree";

    if (agree) {
      return {
        ...data,
        resolved: true,
        agree: true,
        newArenaLevel: 3 + random.cinteger(0, 3)
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
      `__${data.offererName}__ tarjoaa sinulle työpaikkaa. Joukkueen sijoitus liigassa: _${data.ranking}_. Otatko tarjouksen vastaan?`
    ];

    if (!data.resolved) {
      return lines;
    }

    if (data.agree) {
      lines.push(
        `Suloinen haikeus valtaa mielesi kun pakkaat kamojasi, mutta ei pitkäksi aikaa. Maisemanvaihto tekee sinulle hyvää.`
      );
    } else {
      lines.push(`Ei sitten. Tehtävään palkataan __${data.otherManager}__.`);
    }

    return lines;
  },

  process: (_ctx, data) => {
    if (!data.agree) {
      return [];
    }

    const { manager, offerer, oldTeam, newArenaLevel } = data;

    const effects: EventEffect[] = [
      { type: "hireManager", manager, team: offerer },
      { type: "setBalance", manager, amount: 700000 },
      ...SERVICES_RESET_ON_HIRE.map(
        (service): EventEffect => ({
          type: "setService",
          manager,
          service,
          value: false
        })
      ),
      { type: "setArenaLevel", manager, level: newArenaLevel ?? 3 },
      { type: "setInsuranceExtra", manager, extra: 0 },
      { type: "setMorale", team: oldTeam, value: 0 },
      { type: "setStrategy", team: oldTeam, value: 2 },
      { type: "setReadiness", team: oldTeam, value: 0 }
    ];

    return effects;
  }
};

export default jobofferPHL;
