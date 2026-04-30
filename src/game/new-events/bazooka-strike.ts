import type { DeclarativeEvent } from "@/types/event";
import type { PrankInstance } from "@/game/pranks";
import { randomManager } from "@/machines/selectors";

const eventId = "bazookaStrike";

export type BazookaStrikeData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  victim: number;
  victimTeamName: string;
  victimManager: string;
};

/**
 * Bazooka strike — prank-spawned event. The "PVA" rocket-launchers
 * the victim team's bus on the way to a road game. Fully resolved at
 * creation; `process` reads the victim team's current strength and
 * shaves 75% off (no random involved).
 *
 * 1-1 port of `@/game/events/bazooka-strike.ts`. Spawned by the
 * `bazookaStrike` prank.
 */
const bazookaStrike: DeclarativeEvent<BazookaStrikeData, PrankInstance> = {
  type: "manager",

  create: (ctx, { manager, victim }) => {
    const vm = randomManager()(ctx);
    const victimTeam = ctx.teams[victim];
    return {
      eventId,
      manager,
      resolved: true,
      victim,
      victimTeamName: victimTeam.name,
      victimManager: vm.name
    };
  },

  render: (data) => [
    `Pum! Matkalla vieraspeliin __${data.victimTeamName}__ kohtaa yllättäviä hankaluuksia. Silminnäkijäkuvauksen mukaan metsänrajasta sinkoutuu liikkeelle toisen ison kötinän aikainen panssarinyrkki, ja yks kaks tilausajon värjää punaiseksi liekkien kajo.

Iskun tekijäksi ilmoittautuu PVA. Miliisi ei kommentoi. Joukkue joutuu joka tapauksessa turvautumaan junioreihinsa, ja manageri __${data.victimManager}__ vannoo löytävänsä syylliset!`
  ],

  // No `options`, no `resolve` — pre-resolved at creation. The
  // event-phase walker handles `resolved && !processed` events the
  // same way it handles auto-resolve ones, so `process` still fires.

  process: (ctx, data) => {
    const team = ctx.teams[data.victim];
    const skillLost = Math.round(0.75 * team.strength);
    return [
      { type: "decrementStrength", team: data.victim, amount: skillLost }
    ];
  }
};

export default bazookaStrike;
