import { describe, it, expect } from "vitest";
import type { Draft } from "immer";

import { rollPostMatchEffects } from "./post-match-effects";
import type { GameContext } from "@/state/game-context";
import {
  createPlayer,
  createHumanTeam,
  createHumanManager,
  scriptedRandom,
  fixedRandom,
  emptyLineup,
  rosterMap
} from "@/__tests__/factories";
import type { Lineup } from "@/state/lineup";
import { injuries } from "@/data/injuries";
import { banDefinitions } from "@/data/bans";
import { moodDefinitions } from "@/data/performance-modifier";

/**
 * Build the minimal `Draft<GameContext>` slice that `rollPostMatchEffects`
 * reads: `managers`, `teams`, and enough of a team + lineup to exercise
 * the picker.
 */
function makeContext(overrides?: {
  managerId?: string;
  difficulty?: number;
  players?: ReturnType<typeof createPlayer>[];
  lineup?: Lineup;
}): Draft<GameContext> {
  const managerId = overrides?.managerId ?? "mgr";
  const teamId = 1;
  const players = overrides?.players ?? [
    createPlayer({ id: "p1" }),
    createPlayer({ id: "p2" })
  ];

  const lineup: Lineup = overrides?.lineup ?? {
    ...emptyLineup,
    g: "p1",
    forwardLines: [
      { lw: null, c: "p2", rw: null },
      emptyLineup.forwardLines[1],
      emptyLineup.forwardLines[2],
      emptyLineup.forwardLines[3]
    ]
  };

  const team = createHumanTeam({
    id: teamId,
    manager: managerId,
    players: rosterMap(...players),
    lineup
  });

  const manager = createHumanManager({
    id: managerId,
    team: teamId,
    difficulty: overrides?.difficulty ?? 2 // Kahvivatsa, 10%
  });

  return {
    managers: { [managerId]: manager },
    teams: { [teamId]: team }
  } as unknown as Draft<GameContext>;
}

describe("rollPostMatchEffects", () => {
  it("returns empty when no rolls trigger", () => {
    // Random always returns 100 → fails all gates (injury < 10, mood < 20, suspension < 5)
    const ctx = makeContext();
    const effects = rollPostMatchEffects(ctx, "mgr", fixedRandom(100));
    expect(effects).toEqual([]);
  });

  it("returns injury effects when injury gate passes", () => {
    // Script: injury gate = 5 (< 10 → pass), player pick = 0 (p1 from [p1,p2]),
    // injury type = 7 (index 7 → injury #8), mood gate = 100 (fail), suspension gate = 100 (fail)
    const ctx = makeContext();
    const random = scriptedRandom({
      integer: [
        5, // injury gate: < 10 → triggers
        0, // pickLineupPlayer: index 0 of eligible
        7, // injury index (0..43)
        100, // mood gate: ≥ 20 → no mood
        100 // suspension gate: ≥ 5 → no suspension
      ]
    });

    const effects = rollPostMatchEffects(ctx, "mgr", random);

    // Should have exactly 2 effects: playerInjury + addAnnouncement
    expect(effects).toHaveLength(2);

    const injuryEffect = effects[0]!;
    expect(injuryEffect.type).toBe("playerInjury");
    if (injuryEffect.type === "playerInjury") {
      expect(injuryEffect.managerId).toBe("mgr");
      expect(injuryEffect.playerId).toBe("p1");
      const expectedDuration = injuries[7]!.duration(3); // health budget = 3
      expect(injuryEffect.rounds).toBe(expectedDuration);
    }

    expect(effects[1]!.type).toBe("addAnnouncement");
  });

  it("returns suspension effects when suspension gate passes", () => {
    const ctx = makeContext();
    // Script: injury gate = 100, mood gate = 100, suspension gate = 2 (< 5),
    // player pick = 1 (p2), ban index = 3
    const random = scriptedRandom({
      integer: [
        100, // injury gate fail
        100, // mood gate fail
        2, // suspension gate: < 5 → triggers
        1, // pickLineupPlayer: index 1 (p2)
        3 // ban index (0..15)
      ]
    });

    const effects = rollPostMatchEffects(ctx, "mgr", random);
    expect(effects).toHaveLength(2);

    const suspensionEffect = effects[0]!;
    expect(suspensionEffect.type).toBe("playerSuspension");
    if (suspensionEffect.type === "playerSuspension") {
      expect(suspensionEffect.playerId).toBe("p2");
      expect(suspensionEffect.rounds).toBe(banDefinitions[3]!.duration);
    }
  });

  it("returns mood effects when mood gate passes and skill guard allows", () => {
    const ctx = makeContext({
      players: [
        createPlayer({ id: "p1", skill: 10 }),
        createPlayer({ id: "p2", skill: 10 })
      ]
    });

    // Mood 0 = amount -1, skill 10 + (-1) = 9 > 0 → allowed
    const random = scriptedRandom({
      integer: [
        100, // injury gate fail
        5, // mood gate: < 20 → triggers
        0, // pickLineupPlayer: index 0
        0, // mood index (0..44) → mood[0].amount = -1
        100 // suspension gate fail
      ],
      real: [0.5] // duration: floor(durationRange * 0.5) + durationBase + 1
    });

    const effects = rollPostMatchEffects(ctx, "mgr", random);
    expect(effects).toHaveLength(2);

    const moodEffect = effects[0]!;
    expect(moodEffect.type).toBe("playerMood");
    if (moodEffect.type === "playerMood") {
      expect(moodEffect.playerId).toBe("p1");
      expect(moodEffect.amount).toBe(moodDefinitions[0]!.amount);
      const expectedDuration =
        Math.floor(moodDefinitions[0]!.durationRange * 0.5) +
        moodDefinitions[0]!.durationBase +
        1;
      expect(moodEffect.rounds).toBe(expectedDuration);
    }
  });

  it("skips mood if skill + amount would be ≤ 0", () => {
    // Player with skill 1, mood amount -1 → 1 + (-1) = 0, guard fails
    const ctx = makeContext({
      players: [
        createPlayer({ id: "p1", skill: 1 }),
        createPlayer({ id: "p2", skill: 1 })
      ]
    });

    const random = scriptedRandom({
      integer: [
        100, // injury gate fail
        5, // mood gate triggers
        0, // player pick
        0, // mood index 0: amount = -1
        100 // suspension gate fail
      ]
    });

    const effects = rollPostMatchEffects(ctx, "mgr", random);
    expect(effects).toEqual([]);
  });

  it("skips injured player for injury roll", () => {
    // p1 is injured, p2 is healthy → only p2 is eligible
    const ctx = makeContext({
      players: [
        createPlayer({
          id: "p1",
          effects: [{ type: "injury", duration: 3 }]
        }),
        createPlayer({ id: "p2" })
      ]
    });

    const random = scriptedRandom({
      integer: [
        3, // injury gate triggers (< 10)
        0, // pick from [p2] → p2 (only eligible)
        0, // injury index
        100, // mood gate fail
        100 // suspension gate fail
      ]
    });

    const effects = rollPostMatchEffects(ctx, "mgr", random);
    expect(effects).toHaveLength(2);
    if (effects[0]!.type === "playerInjury") {
      expect(effects[0]!.playerId).toBe("p2");
    }
  });

  it("skips player with existing skill modifier for mood roll", () => {
    // p1 has a skill effect → excluded from mood pick; p2 eligible
    const ctx = makeContext({
      players: [
        createPlayer({
          id: "p1",
          effects: [{ type: "skill", duration: 3, amount: 1 }]
        }),
        createPlayer({ id: "p2", skill: 10 })
      ]
    });

    const random = scriptedRandom({
      integer: [
        100, // injury gate fail
        5, // mood gate triggers
        0, // pick from [p2] → p2
        1, // mood index 1: amount = +1 (positive)
        100 // suspension gate fail
      ],
      real: [0.0] // duration = floor(0) + base + 1
    });

    const effects = rollPostMatchEffects(ctx, "mgr", random);
    expect(effects).toHaveLength(2);
    if (effects[0]!.type === "playerMood") {
      expect(effects[0]!.playerId).toBe("p2");
    }
  });

  it("includes PP/PK-only players in the eligible pool", () => {
    // p3 is only in the powerplay team, not in any base line
    const players = [
      createPlayer({ id: "p1" }),
      createPlayer({ id: "p3", skill: 10 })
    ];

    const lineup: Lineup = {
      ...emptyLineup,
      g: "p1",
      powerplayTeam: { lw: "p3", c: null, rw: null, ld: null, rd: null }
    };

    const ctx = makeContext({ players, lineup });

    // Trigger injury → pick index 1 → should be p3 (the PP-only player)
    const random = scriptedRandom({
      integer: [
        0, // injury gate triggers
        1, // pick index 1 of [p1, p3] → p3
        0, // injury index
        100, // mood gate fail
        100 // suspension gate fail
      ]
    });

    const effects = rollPostMatchEffects(ctx, "mgr", random);
    expect(effects).toHaveLength(2);
    if (effects[0]!.type === "playerInjury") {
      expect(effects[0]!.playerId).toBe("p3");
    }
  });

  it("returns nothing for non-human manager", () => {
    const ctx = makeContext();
    // Overwrite manager to AI kind
    (ctx.managers as Record<string, unknown>)["mgr"] = {
      id: "mgr",
      kind: "ai",
      team: 1,
      difficulty: 2
    };

    const effects = rollPostMatchEffects(ctx, "mgr", fixedRandom(0));
    expect(effects).toEqual([]);
  });

  it("all three rolls can trigger independently in one call", () => {
    const players = [
      createPlayer({ id: "p1", skill: 10 }),
      createPlayer({ id: "p2", skill: 10 }),
      createPlayer({ id: "p3", skill: 10 })
    ];

    const lineup: Lineup = {
      ...emptyLineup,
      g: "p1",
      forwardLines: [
        { lw: "p2", c: "p3", rw: null },
        emptyLineup.forwardLines[1],
        emptyLineup.forwardLines[2],
        emptyLineup.forwardLines[3]
      ]
    };

    const ctx = makeContext({ players, lineup });

    const random = scriptedRandom({
      integer: [
        0, // injury gate triggers (< 10)
        0, // pick player index 0 (p1)
        0, // injury index
        0, // mood gate triggers (< 20)
        0, // pick player index 0 for mood (p1 or p2 — whoever is eligible)
        1, // mood index 1: amount +1
        0, // suspension gate triggers (< 5)
        0, // pick player index 0 for suspension
        0 // ban index
      ],
      real: [0.0] // mood duration
    });

    const effects = rollPostMatchEffects(ctx, "mgr", random);

    // 3 × 2 = 6 effects (each roll produces effect + announcement)
    // But p1 got injured, so p1 won't be picked for suspension (isHealthy fails).
    // The actual count depends on which players are eligible after injury.
    // At minimum we should have injury (2 effects) + mood (2) + suspension (2) = 6
    // However the injury effect hasn't been *applied* to the draft, so p1 is still
    // "healthy" for the suspension roll (effects are returned, not applied in-place).
    expect(effects.length).toBeGreaterThanOrEqual(6);

    const types = effects.map((e) => e.type);
    expect(types).toContain("playerInjury");
    expect(types).toContain("playerMood");
    expect(types).toContain("playerSuspension");
    expect(types).toContain("addAnnouncement");
  });
});
