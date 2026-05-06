import { flag, randomTeamFrom } from "@/machines/selectors";
import { cinteger } from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "psychoRelease";

export type PsychoReleaseData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  otherManager: string;
  otherTeam: string;
  letter: number;
};

/**
 * Psycho release — pre-resolved. Only fires while the `psycho`
 * flag is set (i.e. the psycho manager is committed). Releases
 * him to a random division team and clears the flag.
 *
 * 1-1 port of `@/game/events/psycho-release.ts`.
 */
const psychoRelease: DeclarativeEvent<PsychoReleaseData> = {
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
    const team = randomTeamFrom(["division"], false, [])(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      otherManager: psychoManager.name,
      otherTeam: team.name,
      letter: cinteger(0, 4)
    };
  },

  render: (data) => [
    `Eräänä iltana ovikello soi. Avaat oven, ja sen takana seisoo psykopaattimanageri __${data.otherManager}__!`,
    `Mies on viimein vapautettu Tiukukosken mielisairaalasta, ja hän on saanut myöskin töitä divisioonasta. __${data.otherTeam}__ on palkannut hänet, ja mainostaa nyt itseään iskulauseella "hullun hyvä meininki".`
  ],

  process: () => [{ type: "setGameFlag", flag: "psycho", value: undefined }]
};

export default psychoRelease;
