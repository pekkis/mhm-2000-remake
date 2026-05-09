/**
 * Tests for the QB `SUB tasomuut` (`ILEZ5.BAS:1832`) port and its
 * helpers: `tierOf`, `sameTierStrength`, and the full `runTasomuut`.
 *
 * The ladders are pinned hard — they're load-bearing balance numbers
 * we can't drift on.
 */

import { describe, it, expect } from "vitest";
import { produce } from "immer";

import {
  runTasomuut,
  sameTierStrength,
  tierOf
} from "@/machines/end-of-season";
import type { GameContext } from "@/state";
import { createDefaultGameContext } from "@/state";
import {
  emptyAchievements,
  emptyTeamBudget,
  emptyTeamServices
} from "@/services/empties";
import type { AITeam, AIManager, HumanManager } from "@/state/game";
import type { Random } from "random-js";
import { fixedRandom, scriptedRandom } from "@/__tests__/factories";

// ---------------------------------------------------------------------------
// Context builders — keep the surface tiny: a runTasomuut-only ctx.
// ---------------------------------------------------------------------------

type SeedTeam = {
  id: number;
  manager?: string;
  tier: number;
  previousRankings?: [number, number, number];
  /** league membership for tierOf — undefined = light team / unranked */
  league?: "phl" | "division" | "mutasarja";
  arena?: { standingCount: number; seatedCount: number };
  kind?: "ai" | "human";
};

type SeedManager = {
  id: string;
  negotiation: number;
  kind?: "ai" | "human";
};

type SeedSeason = {
  promotedDivision?: number[];
  promotedMutasarja?: number[];
  relegatedPhl?: number[];
  relegatedDivision?: number[];
};

const buildContext = (
  teams: SeedTeam[],
  managers: SeedManager[] = [],
  season: SeedSeason = {}
): GameContext => {
  const base = createDefaultGameContext();
  const ctx: GameContext = {
    ...base,
    teams: teams.map((t) => {
      const arena = {
        name: "Test Arena",
        level: 1 as const,
        standingCount: t.arena?.standingCount ?? 30,
        seatedCount: t.arena?.seatedCount ?? 30,
        hasBoxes: false,
        valuePoints: 0
      };
      const team: AITeam = {
        id: t.id,
        uid: `uid-${t.id}`,
        name: `Team ${t.id}`,
        city: "Hirvikoski",
        arena,
        domestic: true,
        morale: 0,
        strategy: 2,
        readiness: 0,
        effects: [],
        opponentEffects: [],
        manager: t.manager,
        tags: [],
        tier: t.tier,
        previousRankings: t.previousRankings,
        kind: "ai",
        strengthObj: { goalie: 50, defence: 50, attack: 50 },
        budget: emptyTeamBudget(),
        services: emptyTeamServices()
      };
      // The `kind: "human"` branch isn't covered by AITeam shape; the
      // function only checks `team.kind !== "ai"`, so we cast for the
      // skip-test case.
      if (t.kind === "human") {
        return { ...team, kind: "human", players: {} } as unknown as AITeam;
      }
      return team;
    }),
    managers: Object.fromEntries(
      managers.map((m) => {
        const attributes = {
          strategy: 0,
          specialTeams: 0,
          negotiation: m.negotiation,
          resourcefulness: 0,
          charisma: 0,
          luck: 0
        };
        if (m.kind === "human") {
          const human: HumanManager = {
            id: m.id,
            kind: "human",
            name: m.id,
            nationality: "FI",
            attributes,
            tags: [],
            difficulty: 1,
            stats: { games: {}, achievements: emptyAchievements() },
            balance: 0,
            arena: { name: "Stadio Olimpico", level: 0 },
            pranksExecuted: 0,
            flags: {}
          };
          return [m.id, human];
        }
        const ai: AIManager = {
          id: m.id,
          kind: "ai",
          name: m.id,
          nationality: "FI",
          attributes,
          tags: [],
          difficulty: 2,
          stats: { games: {}, achievements: emptyAchievements() }
        };
        return [m.id, ai];
      })
    )
  };

  // League membership for tierOf.
  ctx.competitions.phl.teams = teams
    .filter((t) => t.league === "phl")
    .map((t) => t.id);
  ctx.competitions.division.teams = teams
    .filter((t) => t.league === "division")
    .map((t) => t.id);
  ctx.competitions.mutasarja.teams = teams
    .filter((t) => t.league === "mutasarja")
    .map((t) => t.id);

  ctx.stats.currentSeason = {
    ehlChampion: undefined,
    presidentsTrophy: undefined,
    medalists: undefined,
    worldChampionships: undefined,
    promoted: {
      mutasarja: season.promotedMutasarja ?? [],
      division: season.promotedDivision ?? []
    },
    relegated: {
      phl: season.relegatedPhl ?? [],
      division: season.relegatedDivision ?? []
    },
    stories: {}
  };

  return ctx;
};

const runWith = (ctx: GameContext, random: Random): GameContext =>
  produce(ctx, (draft) => runTasomuut(draft, random));

// ---------------------------------------------------------------------------
// sameTierStrength — direct ladder coverage
// ---------------------------------------------------------------------------

describe("sameTierStrength", () => {
  describe("PHL (tier 1)", () => {
    // QB SELECT CASE sin1 (tasomuut, ILEZ5.BAS:1832 SR=1 branch):
    //   <=1 → 36, <=2 → 35, <=3 → 34, <=4 → 33, <=6 → 32,
    //   <=8 → 31, <=11 → 30, <=13 → 29, else → 28.
    const cases: Array<[number, number]> = [
      [1, 36],
      [1.5, 35],
      [2, 35],
      [2.5, 34],
      [3, 34],
      [3.5, 33],
      [4, 33],
      [5, 32],
      [6, 32],
      [7, 31],
      [8, 31],
      [9, 30],
      [11, 30],
      [12, 29],
      [13, 29],
      [13.5, 28],
      [14, 28],
      [50, 28]
    ];
    it.each(cases)("sin1=%s → %s", (sin1, expected) => {
      expect(sameTierStrength(sin1, 1)).toBe(expected);
    });
  });

  describe("Divisioona (tier 2)", () => {
    // QB SELECT CASE sin1 (SR=2 branch):
    //   <=13.5 → 28, <=15 → 27, <=17 → 26, <=19 → 25, <=21 → 24,
    //   <=23 → 23, <=25 → 22, else → 21.
    const cases: Array<[number, number]> = [
      [10, 28],
      [13.5, 28],
      [14, 27],
      [15, 27],
      [16, 26],
      [17, 26],
      [18, 25],
      [19, 25],
      [20, 24],
      [21, 24],
      [22, 23],
      [23, 23],
      [24, 22],
      [25, 22],
      [25.5, 21],
      [40, 21]
    ];
    it.each(cases)("sin1=%s → %s", (sin1, expected) => {
      expect(sameTierStrength(sin1, 2)).toBe(expected);
    });
  });

  describe("Mutasarja (tier 3)", () => {
    // QB SELECT CASE sin1 (SR=3 branch):
    //   <=26 → 22, <=28 → 21, <=31 → 20, <=34 → 19, <=37 → 18,
    //   <=40 → 17, <=43 → 16, <=46 → 15, else → 14.
    const cases: Array<[number, number]> = [
      [20, 22],
      [26, 22],
      [27, 21],
      [28, 21],
      [29, 20],
      [31, 20],
      [32, 19],
      [34, 19],
      [35, 18],
      [37, 18],
      [38, 17],
      [40, 17],
      [41, 16],
      [43, 16],
      [44, 15],
      [46, 15],
      [47, 14],
      [200, 14]
    ];
    it.each(cases)("sin1=%s → %s", (sin1, expected) => {
      expect(sameTierStrength(sin1, 3)).toBe(expected);
    });
  });
});

// ---------------------------------------------------------------------------
// tierOf
// ---------------------------------------------------------------------------

describe("tierOf", () => {
  it("returns 1 for PHL teams, 2 for Divisioona, 3 for Mutasarja", () => {
    const ctx = buildContext([
      { id: 0, tier: 30, league: "phl" },
      { id: 1, tier: 25, league: "division" },
      { id: 2, tier: 18, league: "mutasarja" }
    ]);
    const draft = produce(ctx, (d) => d);
    // immer freeze the input; we need a draft for the type. produce gives us
    // a deep clone we can pass through a fresh produce to expose a Draft.
    produce(ctx, (d) => {
      expect(tierOf(d, 0)).toBe(1);
      expect(tierOf(d, 1)).toBe(2);
      expect(tierOf(d, 2)).toBe(3);
    });
    // Reference draft — silence unused.
    expect(draft.teams).toBeDefined();
  });

  it("returns undefined for teams not in any Pekkalandia competition", () => {
    const ctx = buildContext([{ id: 99, tier: 12 }]); // no league
    produce(ctx, (d) => {
      expect(tierOf(d, 99)).toBeUndefined();
      expect(tierOf(d, 4242)).toBeUndefined();
    });
  });
});

// ---------------------------------------------------------------------------
// runTasomuut — same-tier path
// ---------------------------------------------------------------------------

describe("runTasomuut — same-tier path", () => {
  it("PHL stayer: rolling avg 1 → tier 36, no jitter when roll midband", () => {
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 30,
          previousRankings: [1, 1, 1],
          league: "phl"
        }
      ],
      [{ id: "m", negotiation: 0 }]
    );
    // skill = 0 (signed -3..+3, no shift) → lower=30, upper=60.
    // roll=50: 50 ≤ 30? no. 50 > 60? no. → no jitter.
    const next = runWith(ctx, scriptedRandom({ integer: [50] }));
    expect(next.teams[0]!.tier).toBe(36);
  });

  it("Divisioona stayer: rolling avg 22 → bracket 23, +1 jitter on low roll", () => {
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 25,
          previousRankings: [22, 22, 22],
          league: "division"
        }
      ],
      [{ id: "m", negotiation: 0 }]
    );
    // skill=0, lower=30. roll=1 → 1 ≤ 30 → +1 bump.
    const next = runWith(ctx, scriptedRandom({ integer: [1] }));
    expect(next.teams[0]!.tier).toBe(24);
  });

  it("Mutasarja stayer: rolling avg 30 → bracket 20, -1 jitter on high roll", () => {
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 18,
          previousRankings: [30, 30, 30],
          league: "mutasarja"
        }
      ],
      [{ id: "m", negotiation: 0 }]
    );
    // skill=0, upper=60. roll=70 → 70 > 60 → -1.
    const next = runWith(ctx, scriptedRandom({ integer: [70] }));
    expect(next.teams[0]!.tier).toBe(19);
  });

  it("uses the rolling 3-season average, not just the most recent finish", () => {
    // [1, 13, 13] → avg = 9 → bracket 30 (PHL).
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 28,
          previousRankings: [1, 13, 13],
          league: "phl"
        }
      ],
      [{ id: "m", negotiation: 0 }]
    );
    const next = runWith(ctx, scriptedRandom({ integer: [50] }));
    expect(next.teams[0]!.tier).toBe(30);
  });
});

// ---------------------------------------------------------------------------
// runTasomuut — relegated path
// ---------------------------------------------------------------------------

describe("runTasomuut — relegated path", () => {
  it("PHL→Div with strong avg (sin1<=15): +random.integer(1,2) bump", () => {
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 28,
          previousRankings: [15, 15, 15],
          league: "division"
        }
      ],
      [{ id: "m", negotiation: 0 }],
      { relegatedPhl: [0] }
    );
    // First integer call = bump (1..2), second = jitter (1..90).
    // bump=2, jitter=50 (midband, no change). Expect 28+2=30.
    const next = runWith(ctx, scriptedRandom({ integer: [2, 50] }));
    expect(next.teams[0]!.tier).toBe(30);
  });

  it("PHL→Div with weak avg (sin1>15): no bump", () => {
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 28,
          previousRankings: [16, 16, 16],
          league: "division"
        }
      ],
      [{ id: "m", negotiation: 0 }],
      { relegatedPhl: [0] }
    );
    // No bump call — only the jitter integer. roll=50 → no change.
    const next = runWith(ctx, scriptedRandom({ integer: [50] }));
    expect(next.teams[0]!.tier).toBe(28);
  });

  it("Div→Muta with strong avg (sin1<=27): +bump", () => {
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 20,
          previousRankings: [27, 27, 27],
          league: "mutasarja"
        }
      ],
      [{ id: "m", negotiation: 0 }],
      { relegatedDivision: [0] }
    );
    const next = runWith(ctx, scriptedRandom({ integer: [1, 50] }));
    expect(next.teams[0]!.tier).toBe(21);
  });

  it("Div→Muta with weak avg (sin1>27): no bump", () => {
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 20,
          previousRankings: [28, 28, 28],
          league: "mutasarja"
        }
      ],
      [{ id: "m", negotiation: 0 }],
      { relegatedDivision: [0] }
    );
    const next = runWith(ctx, scriptedRandom({ integer: [50] }));
    expect(next.teams[0]!.tier).toBe(20);
  });
});

// ---------------------------------------------------------------------------
// runTasomuut — promoted path
// ---------------------------------------------------------------------------

describe("runTasomuut — promoted path", () => {
  it("Div→PHL caps tier at 31 then rolls -2 with sin1*2 chance / 100", () => {
    // tier 35 → capped to 31. sin1=10 → real(0,100) < 20 → -2.
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 35,
          previousRankings: [10, 10, 10],
          league: "phl"
        }
      ],
      [{ id: "m", negotiation: 0 }],
      { promotedDivision: [0] }
    );
    const next = runWith(ctx, scriptedRandom({ real: [10], integer: [50] }));
    // 31 - 2 = 29.
    expect(next.teams[0]!.tier).toBe(29);
  });

  it("Div→PHL: roll fails the -2 chance ⇒ tier stays at cap", () => {
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 40,
          previousRankings: [5, 5, 5],
          league: "phl"
        }
      ],
      [{ id: "m", negotiation: 0 }],
      { promotedDivision: [0] }
    );
    // sin1=5 → threshold = real(0,100)<10. roll=50 → no -2.
    const next = runWith(ctx, scriptedRandom({ real: [50], integer: [50] }));
    expect(next.teams[0]!.tier).toBe(31);
  });

  it("Div→PHL: tier already <= 31 stays untouched by the cap", () => {
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 25,
          previousRankings: [10, 10, 10],
          league: "phl"
        }
      ],
      [{ id: "m", negotiation: 0 }],
      { promotedDivision: [0] }
    );
    const next = runWith(
      ctx,
      scriptedRandom({ real: [50], integer: [50] }) // no -2
    );
    expect(next.teams[0]!.tier).toBe(25);
  });

  it("Muta→Div caps tier at 24 then rolls -2 with sin1*2 chance / 200", () => {
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 30,
          previousRankings: [20, 20, 20],
          league: "division"
        }
      ],
      [{ id: "m", negotiation: 0 }],
      { promotedMutasarja: [0] }
    );
    // sin1=20 → threshold = real(0,200)<40. roll=10 → -2. 24-2 = 22.
    const next = runWith(ctx, scriptedRandom({ real: [10], integer: [50] }));
    expect(next.teams[0]!.tier).toBe(22);
  });
});

// ---------------------------------------------------------------------------
// runTasomuut — negotiation jitter (NEUVOKKUUS / mtaito(3))
// ---------------------------------------------------------------------------

describe("runTasomuut — negotiation jitter", () => {
  // skill = manager.attributes.negotiation (signed -3..+3, used
  // verbatim from QB — see runTasomuut docstring + ILES5.BAS:741 +
  // MHM2K.BAS:1535/1539 for proof).
  // bands: lower = 30 + 8*skill, upper = 60 + 8*skill, roll in 1..90.
  it.each([
    // [negotiation, roll, expectedDelta]
    // skill=-3 → lower=6, upper=36.
    [-3, 1, +1], // 1 ≤ 6 → +1
    [-3, 6, +1], // 6 ≤ 6 → +1
    [-3, 7, 0], // 6 < 7 ≤ 36 → 0
    [-3, 36, 0], // ≤ upper → 0
    [-3, 37, -1], // > 36 → -1
    [-3, 90, -1],
    // skill=0 → lower=30, upper=60.
    [0, 1, +1],
    [0, 30, +1],
    [0, 31, 0],
    [0, 60, 0],
    [0, 61, -1],
    [0, 90, -1],
    // skill=+3 → lower=54, upper=84. roll cap is 90.
    [3, 1, +1],
    [3, 54, +1],
    [3, 55, 0],
    [3, 84, 0],
    [3, 85, -1],
    [3, 90, -1]
  ] as const)(
    "negotiation=%i, roll=%i ⇒ Δ tier %i",
    (negotiation, roll, delta) => {
      // Same-tier PHL with rolling avg 1 → bracket 36. Final = 36 + delta.
      const ctx = buildContext(
        [
          {
            id: 0,
            manager: "m",
            tier: 30,
            previousRankings: [1, 1, 1],
            league: "phl"
          }
        ],
        [{ id: "m", negotiation }]
      );
      const next = runWith(ctx, scriptedRandom({ integer: [roll] }));
      expect(next.teams[0]!.tier).toBe(36 + delta);
    }
  );
});

// ---------------------------------------------------------------------------
// runTasomuut — tiny-arena cap and skip rules
// ---------------------------------------------------------------------------

describe("runTasomuut — tiny-arena cap", () => {
  it("caps tier at 27 when standing+seated < 40 even after a high bracket", () => {
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 30,
          previousRankings: [1, 1, 1], // → bracket 36
          league: "phl",
          arena: { standingCount: 10, seatedCount: 20 } // 30 < 40
        }
      ],
      [{ id: "m", negotiation: 0 }]
    );
    const next = runWith(ctx, scriptedRandom({ integer: [50] }));
    expect(next.teams[0]!.tier).toBe(27);
  });

  it("does NOT cap when capacity is exactly 40 (strict <)", () => {
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 30,
          previousRankings: [1, 1, 1],
          league: "phl",
          arena: { standingCount: 20, seatedCount: 20 }
        }
      ],
      [{ id: "m", negotiation: 0 }]
    );
    const next = runWith(ctx, scriptedRandom({ integer: [50] }));
    expect(next.teams[0]!.tier).toBe(36);
  });

  it("leaves a small-arena team alone when its bracket already <= 27", () => {
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 22,
          previousRankings: [25, 25, 25], // mutasarja → bracket 22
          league: "mutasarja",
          arena: { standingCount: 5, seatedCount: 5 }
        }
      ],
      [{ id: "m", negotiation: 0 }]
    );
    const next = runWith(ctx, scriptedRandom({ integer: [50] }));
    expect(next.teams[0]!.tier).toBe(22);
  });
});

describe("runTasomuut — skip rules and guards", () => {
  it("skips human-managed teams entirely", () => {
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "m",
          tier: 30,
          previousRankings: [1, 1, 1],
          league: "phl",
          kind: "human"
        }
      ],
      [{ id: "m", negotiation: 0, kind: "human" }]
    );
    // No random calls expected. Empty queue would throw if touched.
    const next = runWith(ctx, scriptedRandom({}));
    expect(next.teams[0]!.tier).toBe(30);
  });

  it("throws when an AI team is missing previousRankings", () => {
    const ctx = buildContext(
      [{ id: 0, manager: "m", tier: 12, league: "phl" }],
      [{ id: "m", negotiation: 0 }]
    );
    expect(() => runWith(ctx, scriptedRandom({}))).toThrow(
      /previous rankings/i
    );
  });

  it("throws when an AI team has no manager", () => {
    const ctx = buildContext([
      { id: 0, tier: 30, previousRankings: [1, 1, 1], league: "phl" }
    ]);
    expect(() => runWith(ctx, scriptedRandom({}))).toThrow(/manager/i);
  });

  it("throws when an AI team isn't in any Pekkalandia league", () => {
    const ctx = buildContext(
      [{ id: 0, manager: "m", tier: 12, previousRankings: [10, 10, 10] }],
      [{ id: "m", negotiation: 0 }]
    );
    expect(() => runWith(ctx, scriptedRandom({}))).toThrow(/tier/i);
  });
});

// ---------------------------------------------------------------------------
// runTasomuut — multi-team integration
// ---------------------------------------------------------------------------

describe("runTasomuut — multi-team", () => {
  it("walks every AI team independently with one fixed random source", () => {
    const ctx = buildContext(
      [
        {
          id: 0,
          manager: "a",
          tier: 28,
          previousRankings: [1, 1, 1],
          league: "phl"
        },
        {
          id: 1,
          manager: "b",
          tier: 28,
          previousRankings: [12, 12, 12],
          league: "phl"
        }
      ],
      [
        { id: "a", negotiation: 0 },
        { id: "b", negotiation: 0 }
      ]
    );
    // fixedRandom(50): every roll = 50. PHL stayers, midband jitter
    // (skill=0 → lower=30, upper=60, 30 < 50 ≤ 60 → no change).
    const next = runWith(ctx, fixedRandom(50));
    // sin1=1 → 36; sin1=12 → 29.
    expect(next.teams[0]!.tier).toBe(36);
    expect(next.teams[1]!.tier).toBe(29);
  });
});
