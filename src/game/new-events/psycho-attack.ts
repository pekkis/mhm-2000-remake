import { flag, randomManager, totalGamesPlayed } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "psychoAttack";

export type PsychoAttackData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  otherManagerId: number;
  otherManager: string;
};

/**
 * Psycho attack — pre-resolved. Skipped if PHL games <100 or the
 * psycho flag is already set. Picks a random manager and commits
 * him; sets the `psycho` flag to his id.
 *
 * 1-1 port of `@/game/events/psycho-attack.ts`.
 */
const psychoAttack: DeclarativeEvent<PsychoAttackData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const phlGamesPlayed = totalGamesPlayed(manager, "phl", 0)(ctx);
    if ((phlGamesPlayed ?? 0) < 100) {
      return null;
    }
    if (flag("psycho")(ctx) !== undefined) {
      return null;
    }
    const r = randomManager()(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      otherManagerId: r.id,
      otherManager: r.name
    };
  },

  render: (data) => [
    `Yht'äkkiä, kävellessäsi kadulla, kommandopipoinen heppu hyppää eteesi pistooli kourassaan! Nauraen hän riisuu valepukunsa, ja sen alta paljastuu manageri __${data.otherManager}__!

Hän kertoo _vihanneensa_ sinua siitä saakka kun ensimmäisen kerran näki sinut vastustajan aitiossa, ja tulleensa tappamaan sinut.

Juuri, kun hän tähtää kohti päätäsi, kaahaa paikalle miliisi, ja seonnut manageriraukka säntää kujalle. Myöhemmin hänet saadaan kui tenkin kiinni ja suljetaan Tiukukosken mielisairaalaan.`
  ],

  process: (_ctx, data) => [
    { type: "setGameFlag", flag: "psycho", value: data.otherManagerId }
  ]
};

export default psychoAttack;
