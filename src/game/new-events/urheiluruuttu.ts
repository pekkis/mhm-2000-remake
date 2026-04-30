import { managersDifficulty, managersTeamId } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "urheiluruuttu";

export type UrheiluruuttuData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  showerCam: boolean;
  moraleGain: number;
};

/**
 * Urheilu-Ruuttu — pre-resolved. Big feature on your team. Morale
 * +4 in normal cases, −4 if difficulty ≥3 (the locker-room
 * shower-cam disaster cut).
 *
 * 1-1 port of `@/game/events/urheiluruuttu.ts`.
 */
const urheiluruuttu: DeclarativeEvent<UrheiluruuttuData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const difficulty = managersDifficulty(manager)(ctx);
    const showerCam = difficulty >= 3;
    return {
      eventId,
      manager,
      resolved: true,
      showerCam,
      moraleGain: showerCam ? -4 : 4
    };
  },

  render: (data) => {
    const t = [
      `Urheilu-Ruuttu tekee joukkueestanne suuren jutun! Moraali nousee kohisten...`
    ];
    if (data.showerCam) {
      t.push(
        `...ainakin siihen asti kunnes pukukoppikameran kuumat otokset suihkusta näytetään lapsille suorassa lähetyksessä.`
      );
    }
    return t;
  },

  process: (ctx, data) => [
    {
      type: "incrementMorale",
      team: managersTeamId(data.manager)(ctx),
      amount: data.moraleGain
    }
  ]
};

export default urheiluruuttu;
