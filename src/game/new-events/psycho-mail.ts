import { flag } from "@/machines/selectors";
import random, { cinteger } from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "psychoMail";

const letters = [
  (data: PsychoMailData) =>
    `__${data.otherManager}__ lähettää sinulle Tiukukoskelta kirjeen, jossa vannoo kostoa!`,
  (data: PsychoMailData) =>
    `__${data.otherManager}__ lähettää sinulle Tiukukoskelta kirjeen, jossa hän varoittaa sinua avaruusolentojen hyökkäyksestä.`,
  (data: PsychoMailData) =>
    `__${data.otherManager}__ lähettää sinulle Tiukukoskelta kirjeen, jossa hän kertoo olevansa koko sairaalan paras jääkiekkomanageri.`,
  (data: PsychoMailData) =>
    `__${data.otherManager}__ lähettää sinulle Tiukukoskelta kirjeen, josta et ota mitään tolkkua.`,
  (data: PsychoMailData) =>
    `__${data.otherManager}__ lähettää sinulle Tiukukoskelta kirjeen, jonka hänelle "ovat sanelleet Sami Sammakko, Toni Tiikeri ja Ossi Olifantti".`
];

export type PsychoMailData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  otherManager: string;
  letter: number;
};

/**
 * Psycho mail — pre-resolved, no-op process. Only fires while the
 * `psycho` flag is set. Reads the committed manager's name and
 * picks one of 5 random letter texts.
 *
 * 1-1 port of `@/game/events/psycho-mail.ts`.
 */
const psychoMail: DeclarativeEvent<PsychoMailData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const psycho = flag("psycho")(ctx);
    if (psycho === undefined) {
      return null;
    }
    const psychoManager = ctx.managers[psycho];
    if (!psychoManager) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true,
      otherManager: psychoManager.name,
      letter: cinteger(0, 4)
    };
  },

  render: (data) => [letters[data.letter](data)],

  process: () => []
};

export default psychoMail;
