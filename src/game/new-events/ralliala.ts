import { managersTeam } from "@/machines/selectors";
import { amount as a } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "ralliala";

export type RallialaData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  team: number;
  teamName: string;
  amount: number;
};

/**
 * Ralliala — pre-resolved. Comedian Aape Ralliala donates 70 000 to
 * the manager's team after declaring his fandom.
 *
 * 1-1 port of `@/game/events/ralliala.ts`. **Bug fix:** the saga
 * version self-registered as `eventId = "cleandrug"` (typo), which
 * collided with the actual cleandrug event in any switch keying off
 * the stored `eventId`. Now correctly `"ralliala"`.
 */
const ralliala: DeclarativeEvent<RallialaData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = managersTeam(manager)(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      team: team.id,
      teamName: team.name,
      amount: 70000
    };
  },

  render: (data) => [
    `Lavakoomikko __Aape Ralliala__ julistaa kääntyneensä ${data.teamName}:n kannattajaksi ja lahjoittaa sen osoitukseksi joukkueelle ${a(data.amount)} pekkaa.`
  ],

  process: (_ctx, data) => [
    { type: "incrementBalance", manager: data.manager, amount: data.amount }
  ]
};

export default ralliala;
