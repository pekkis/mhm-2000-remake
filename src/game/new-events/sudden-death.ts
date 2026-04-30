import type { DeclarativeEvent } from "@/types/event";

const eventId = "suddenDeath";

export type SuddenDeathData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: boolean;
  amount: number;
};

/**
 * Sudden death — interactive prank event. Pretends the whole team
 * died, then admits the joke. Pure flavor: no effects.
 *
 * 1-1 port of `@/game/events/sudden-death.ts`.
 */
const suddenDeath: DeclarativeEvent<SuddenDeathData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    amount: 15000000,
    resolved: false
  }),

  options: () => ({
    ok: `Aaaaasia selvä. `,
    wtf: `Hiiiieno homma. Kiitos infosta.`
  }),

  resolve: (_ctx, data) => ({ ...data, resolved: true }),

  render: (data) => {
    const lines = [
      `Kaikki pelaajasi ovat saaneet surmansa lento-onnettomuudessa! Johtokunta kehottaa sinua etsimään uusia kiekkoilijoita.`
    ];
    if (!data.resolved) {
      return lines;
    }
    lines.push(`Uskoitko? Ainakin ensimmäisellä kerralla... :)`);
    return lines;
  },

  process: () => []
};

export default suddenDeath;
