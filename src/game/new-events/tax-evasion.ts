import {
  managerHasService,
  managersArena,
  managersDifficulty,
  managersTeamId,
  randomManager,
  randomTeamFrom
} from "@/machines/selectors";
import { amount as a } from "@/services/format";
import r from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "taxEvasion";

export type TaxEvasionData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  amount: number;
  resolved: boolean;
  otherManager: string;
  otherManagerName: string;
  team: number;
  teamName: string;
  agree?: boolean;
  fine?: number;
  fine2?: number;
  caught?: boolean;
  hasInsurance?: boolean;
  /** Bonus +5 strength on easy difficulties (<3). */
  getPlayer?: number;
  /** Snapshotted at resolve so process is deterministic. */
  arenaLevel?: number;
};

/**
 * Tax evasion — interactive. Rat out a rival; risk your own
 * scams being uncovered. Random "caught" roll happens at resolve.
 *
 * 1-1 port of `@/game/events/tax-evasion.ts`. Arena level
 * snapshotted in resolve.
 */
const taxEvasion: DeclarativeEvent<TaxEvasionData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const otherManager = randomManager()(ctx);
    const team = randomTeamFrom(["phl"], false, [])(ctx);
    return {
      eventId,
      manager,
      amount: 50000,
      resolved: false,
      otherManager: otherManager.id,
      otherManagerName: otherManager.name,
      team: team.id,
      teamName: team.name
    };
  },

  options: () => ({
    agree: `Paljastan vilpin.`,
    disagree: `En paljasta vilppiä.`
  }),

  resolve: (ctx, data, value) => {
    const caught = r.bool();
    const hasInsurance = managerHasService(data.manager, "insurance")(ctx);
    const difficulty = managersDifficulty(data.manager)(ctx);
    const arena = managersArena(data.manager)(ctx);
    return {
      ...data,
      resolved: true,
      agree: value === "agree",
      fine: 1000000,
      fine2: 300000,
      caught,
      hasInsurance,
      getPlayer: difficulty < 3 ? 5 : undefined,
      arenaLevel: arena ? arena.level : 0
    };
  },

  render: (data) => {
    const lines = [
      `Olet saanut tietää, että __${data.teamName}__:n manageri __${data.otherManagerName}__ on kiertänyt veroja. Julkistatko tiedon, vaikka samalla on riski että omat vilppisi tulevat julkisuuteen? Tieto ajaisi todennäköisesti joukkueen konkurssiin.`
    ];
    if (!data.resolved) {
      return lines;
    }
    if (!data.agree) {
      lines.push(
        `OK. ${data.otherManagerName} saa siis jatkaa rikollista toimintaansa.`
      );
      return lines;
    }
    if (data.caught) {
      lines.push(
        `Oi voi! Omat veronkiertosi paljastuvat, ja saat ${a(data.fine!)} pekan sakot!`
      );
      if (data.hasInsurance) {
        lines.push(
          `Vakuutuspetoksesikin tulevat ilmi, ja Etelälä sakottaa sinua ${a(data.fine2!)} pekalla!!!`
        );
      }
    } else {
      lines.push(
        `Haa haa. ${data.otherManagerName} joutuu kohtaamaan talousrikosmiliisin ypöyksin!`
      );
    }
    lines.push(
      `${data.teamName} saa kauheat mätkyt, ja huippupelaajat evakuoituvat uppoavasta laivasta!`
    );
    if (data.getPlayer) {
      lines.push(
        `Yksi heistä haluaa pelipaikan, jonka ystävällisesti annat (vain palkka maksettava)`
      );
    }
    return lines;
  },

  process: (ctx, data) => {
    if (!data.agree) {
      return [];
    }
    const myTeam = managersTeamId(data.manager)(ctx);
    const effects: EventEffect[] = [
      { type: "decrementStrength", team: data.team, amount: 65 }
    ];
    if (data.getPlayer) {
      effects.push({
        type: "incrementStrength",
        team: myTeam,
        amount: data.getPlayer
      });
    }
    if (!data.caught) {
      return effects;
    }
    effects.push({ type: "decrementMorale", team: myTeam, amount: 6 });
    effects.push({
      type: "decrementBalance",
      manager: data.manager,
      amount: data.fine!
    });
    if (data.hasInsurance) {
      effects.push({
        type: "decrementBalance",
        manager: data.manager,
        amount: data.fine2!
      });
      effects.push({
        type: "incrementInsuranceExtra",
        manager: data.manager,
        amount: 200 * ((data.arenaLevel ?? 0) + 1)
      });
    }
    return effects;
  }
};

export default taxEvasion;
