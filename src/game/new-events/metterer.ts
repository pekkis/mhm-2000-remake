import { managersTeam } from "@/machines/selectors";
import r from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "metterer";

export type MettererData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: boolean;
  strength: number;
  duration: number;
  agree?: boolean;
  /** `r.bool()` — rolled in resolve so process is deterministic. */
  positive?: boolean;
};

/**
 * Metterer — interactive. Karkus offers his services as a goalie
 * for 3 rounds. Accept: ±30 opponent strength for 3 rounds, sign
 * decided by a coin flip at resolve time.
 *
 * 1-1 port of `@/game/events/metterer.ts`.
 */
const metterer: DeclarativeEvent<MettererData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    strength: 30,
    duration: 3,
    resolved: false
  }),

  options: () => ({
    agree: "Aina on tilaa yhdelle Karkukselle!",
    disagree: "Ei. Karkus pysyköön kotona."
  }),

  resolve: (_ctx, data, value) => ({
    ...data,
    resolved: true,
    agree: value === "agree",
    positive: r.bool()
  }),

  render: (data) => {
    const lines = [
      `Karkus Metterer, tunnettu maalivahti, haluaisi tulla joukkueeseesi pelaamaan 3 ottelun ajaksi kun Elitserienissä peliaikaa ei siunaannu. Otatko Karkuksen mukaan?`
    ];
    if (!data.resolved) {
      return lines;
    }
    if (!data.agree) {
      lines.push(`Ei sitten.`);
    } else {
      lines.push(
        `Karkus on iloinen ja kiittelee kovasti. Miehen todellinen pelikunto selvinnee lähipäivinä.`
      );
    }
    return lines;
  },

  process: (ctx, data) => {
    if (!data.agree) {
      return [];
    }
    const team = managersTeam(data.manager)(ctx);
    const effectSize = data.positive ? -data.strength : data.strength;
    return [
      {
        type: "addOpponentEffect",
        team: team.id,
        effect: {
          parameter: ["strength"],
          amount: effectSize,
          duration: data.duration
        }
      }
    ];
  }
};

export default metterer;
