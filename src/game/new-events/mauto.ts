import {
  flag,
  managerCompetesIn,
  managersDifficulty,
  managersTeam,
  randomTeamFrom
} from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "mauto";

export type MautoData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  newName: string;
  resolved: boolean;
  amount: number;
  changeOfMind?: boolean;
  agree?: boolean;
  team?: number;
  teamName?: string;
};

/**
 * Mauto — interactive sponsorship. PHL only, fires at most once
 * (`mauto` flag). Accepting on hard difficulty (≥3) flips the
 * sponsor to a random other team (`changeOfMind`); accepting on
 * easier renames your team and fills the coffers; declining sends
 * the sponsorship — and a strength bump — to a random team.
 *
 * 1-1 port of `@/game/events/mauto.ts`. The "random other team"
 * roll moves to `resolve` so process is deterministic.
 */
const mauto: DeclarativeEvent<MautoData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    if (!managerCompetesIn(manager, "phl")(ctx)) {
      return null;
    }
    if (flag("mauto")(ctx)) {
      return null;
    }
    return {
      eventId,
      manager,
      newName: "Mauto HT",
      resolved: false,
      amount: 4000000
    };
  },

  options: (data) => ({
    y: `Suostun. Kauan eläköön ${data.newName} `,
    n: "En suostu. Pitäköön mautonsa!"
  }),

  resolve: (ctx, data, value) => {
    const difficulty = managersDifficulty(data.manager)(ctx);
    const changeOfMind = value === "y" && difficulty >= 3;
    const agree = value === "y";
    const team =
      value === "n" || changeOfMind
        ? randomTeamFrom(["phl", "division"], false, [])(ctx)
        : managersTeam(data.manager)(ctx);
    return {
      ...data,
      resolved: true,
      changeOfMind,
      agree,
      team: team.id,
      teamName: team.name
    };
  },

  render: (data) => {
    const lines = [
      `Monikansallinen autotehdas __Mautomobiles__ haluaa sponsoroida joukkuettasi!
    Jos joukkueen nimeksi vaihdetaan _${data.newName}_, rahoittavat he toimintaanne ${data.amount} pekalla! Suostutko?`
    ];
    if (!data.resolved) {
      return lines;
    }
    if (data.changeOfMind) {
      lines.push(
        `Mauto muuttaa yhtäkkiä mielipidettään ja sponsoroikin toista joukkuetta (__${data.teamName}__).`
      );
      return lines;
    }
    if (!data.agree) {
      lines.push(`Mautomobiles sponsoroi joukkuetta __${data.teamName}__.`);
      return lines;
    }
    lines.push(
      `Mautomobilesin toimitusjohtaja hymyilee kuin Naantalin aurinko. "Olkoon alkava yhteistyömme pitkä ja menestyksekäs!"`
    );
    return lines;
  },

  process: (_ctx, data) => {
    const effects: EventEffect[] = [
      { type: "setGameFlag", flag: "mauto", value: true },
      { type: "renameTeam", team: data.team!, name: data.newName }
    ];
    if (!data.agree || data.changeOfMind) {
      effects.push({
        type: "incrementStrength",
        team: data.team!,
        amount: 40
      });
    } else {
      effects.push({
        type: "incrementBalance",
        manager: data.manager,
        amount: data.amount
      });
      effects.push({
        type: "renameArena",
        manager: data.manager,
        name: "Mauto Center"
      });
    }
    return effects;
  }
};

export default mauto;
