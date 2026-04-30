import {
  flag,
  managerHasEnoughMoney,
  managersTeamId,
  randomTeamFrom,
  teamCompetesIn
} from "@/machines/selectors";
import { amount as a } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "jarko";

export type JarkoData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  team: number;
  otherTeam: number;
  otherTeamName: string;
  enoughMoney: boolean;
  amount: number;
  strength: number;
  resolved: boolean;
  agree?: boolean;
};

/**
 * Jarko — interactive transfer. Jarko Mantunen returns from the
 * NHL; you and a random PHL team are bidding. Auto-resolved as
 * declined when you can't afford. Sets `jarko` flag so it doesn't
 * recur.
 *
 * 1-1 port of `@/game/events/jarko.ts`.
 */
const jarko: DeclarativeEvent<JarkoData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    if (flag("jarko")(ctx)) {
      return null;
    }
    const team = managersTeamId(manager)(ctx);
    if (!teamCompetesIn(team, "phl")(ctx)) {
      return null;
    }
    const otherTeam = randomTeamFrom(["phl"], false, [])(ctx);
    const amount = 200000;
    const strength = 15;
    const enoughMoney = managerHasEnoughMoney(manager, amount)(ctx);
    return {
      eventId,
      manager,
      team,
      otherTeam: otherTeam.id,
      otherTeamName: otherTeam.name,
      enoughMoney,
      amount,
      strength,
      resolved: !enoughMoney,
      agree: !enoughMoney ? false : undefined
    };
  },

  options: () => ({
    agree: "Ostan Mantusen joukkueeseeni",
    disagree: "En osta Mantusta joukkueeseeni"
  }),

  resolve: (_ctx, data, value) => ({
    ...data,
    resolved: true,
    agree: value === "agree"
  }),

  render: (data) => {
    const lines = [
      `NHL on ollut liian kova pala Jarko Mantuselle. Hän haluaisi palata kotimaahan, ja sinun joukkueeseesi. Myös __${data.otherTeamName}__ on kiinnostunut pelaajasta. Siirtosumma on pienehkö ${a(data.amount)}, ja pelaajan voima on ${data.strength}.`
    ];
    if (!data.resolved) {
      return lines;
    }
    if (!data.enoughMoney) {
      lines.push(`Rahatilanne ei anna mahdollisuutta ostaa Mantusta.`);
    }
    if (data.agree) {
      lines.push(`Hienoa! Joukkueellasi on uusi maalintekijä!`);
    } else {
      lines.push(`Mantusen uusi joukkue on ${data.otherTeamName}.`);
    }
    return lines;
  },

  process: (_ctx, data) => {
    const effects: EventEffect[] = [];
    if (data.agree) {
      effects.push({
        type: "incrementStrength",
        team: data.team,
        amount: data.strength
      });
      effects.push({
        type: "incrementMorale",
        team: data.team,
        amount: data.amount
      });
      effects.push({
        type: "decrementBalance",
        manager: data.manager,
        amount: data.amount
      });
    } else {
      effects.push({
        type: "incrementStrength",
        team: data.otherTeam,
        amount: data.strength
      });
    }
    effects.push({ type: "setGameFlag", flag: "jarko", value: true });
    return effects;
  }
};

export default jarko;
