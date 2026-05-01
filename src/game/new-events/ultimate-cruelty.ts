import {
  managerHasService,
  managersArena,
  managersDifficulty,
  managersMainCompetition,
  managersTeam
} from "@/machines/selectors";
import { currency } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "ultimateCruelty";

export type UltimateCrueltyData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  hasInsurance: boolean;
  amount: number;
};

/**
 * Ultimate cruelty — pre-resolved. Skipped unless: difficulty ≥2,
 * PHL, team strength ≥300, arena level 9. Hall collapses;
 * −1 500 000 pekka, arena drops to level 2. Insurance does NOT
 * cover (saga doesn't refund).
 *
 * 1-1 port of `@/game/events/ultimate-cruelty.ts`.
 */
const ultimateCruelty: DeclarativeEvent<UltimateCrueltyData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    if (managersDifficulty(manager)(ctx) < 2) {
      return null;
    }
    if (managersMainCompetition(manager)(ctx) !== "phl") {
      return null;
    }
    const team = managersTeam(manager)(ctx);
    if (team.strength < 300) {
      return null;
    }
    const arena = managersArena(manager)(ctx);
    if (!arena || arena.level !== 9) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true,
      hasInsurance: managerHasService(manager, "insurance")(ctx),
      amount: 1500000
    };
  },

  render: (data) => {
    const t = [
      `Valtaisa hallisi sortui viime yönä! Huolimattomasta rakentamisesta johtunut onnettomuus hautasi alleen 5 ihmistä, ja syytteiltä välttyäksesi joudut maksamaan kipurahoja yhteensä ${currency(data.amount)}. Joukkue joutuu siirtymään harjoitus-"areenalle".`
    ];
    if (data.hasInsurance) {
      t.push(
        `Etelälän vakuutuskaan ei auta, sillä kyseessä on vakuutusyhtiön mielestä rakennusmääräysten törkeä rikkominen, josta vastuussa ovat heidän vakaan näkemyksensä mukaan yksinomaan rakennuttaja ja urakan tilaaja. Koko lasku päätyy joukkueelle.`
      );
    }
    return t;
  },

  process: (_ctx, data) => [
    { type: "decrementBalance", manager: data.manager, amount: data.amount },
    { type: "setArenaLevel", manager: data.manager, level: 2 }
  ]
};

export default ultimateCruelty;
