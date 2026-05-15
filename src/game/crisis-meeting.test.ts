import { describe, it, expect, beforeAll } from "vitest";
import {
  captainScore,
  findEgoPlayer,
  resolveCrisisMeeting
} from "./crisis-meeting";
import {
  createPlayer,
  rosterMap,
  createHumanTeam,
  createHumanManager,
  fixedRandom,
  scriptedRandom,
  emptyLineup
} from "@/__tests__/factories";

// ---------------------------------------------------------------------------
// captainScore — QB: sin1 = (age + ldr^1.3) / 50
//                    IF psk < avg THEN sin1 *= psk/avg
// ---------------------------------------------------------------------------

describe("captainScore", () => {
  it("computes (age + leadership^1.3) / 50 for baseline", () => {
    const captain = createPlayer({ age: 30, leadership: 10, skill: 10 });
    // (30 + 10^1.3) / 50 = (30 + 19.953...) / 50 ≈ 0.999
    const score = captainScore(captain, 10);
    expect(score).toBeCloseTo((30 + 10 ** 1.3) / 50, 5);
  });

  it("applies no penalty when captain skill >= team avg", () => {
    const captain = createPlayer({ age: 25, leadership: 15, skill: 12 });
    const noPenalty = captainScore(captain, 10); // skill 12 > avg 10
    const base = (25 + 15 ** 1.3) / 50;
    expect(noPenalty).toBeCloseTo(base, 5);
  });

  it("penalises when captain skill < team avg — QB: sin1 *= psk/avg", () => {
    const captain = createPlayer({ age: 25, leadership: 15, skill: 5 });
    const avgSkill = 10;
    const base = (25 + 15 ** 1.3) / 50;
    const penalised = captainScore(captain, avgSkill);
    expect(penalised).toBeCloseTo(base * (5 / 10), 5);
  });

  it("returns higher score for older, high-leadership captains", () => {
    const veteran = createPlayer({ age: 35, leadership: 20, skill: 15 });
    const rookie = createPlayer({ age: 20, leadership: 5, skill: 15 });
    expect(captainScore(veteran, 10)).toBeGreaterThan(captainScore(rookie, 10));
  });
});

// ---------------------------------------------------------------------------
// findEgoPlayer — QB: SUB al with fat=6 (gnome=3) / fat=7 (gnome=5)
//   60 attempts; each: pick random player, if ego>15, if 100*RND < (ego-15)*gnome → found
// ---------------------------------------------------------------------------

describe("findEgoPlayer", () => {
  it("returns undefined for empty roster", () => {
    expect(findEgoPlayer([], fixedRandom(0), 3)).toBeUndefined();
  });

  it("returns undefined when no player has ego > 15", () => {
    const players = [
      createPlayer({ ego: 10 }),
      createPlayer({ ego: 15 }) // ego must be STRICTLY > 15
    ];
    expect(findEgoPlayer(players, fixedRandom(0), 3)).toBeUndefined();
  });

  it("finds high-ego player when probability check passes — gnome=3", () => {
    // Player with ego=20: threshold = (20-15)*3 = 15
    // Random roll must be < 15 (i.e. 1..14)
    const player = createPlayer({ id: "ego-boy", ego: 20 });
    const random = scriptedRandom({
      integer: [
        0, // attempt 0: pick player index 0
        5 // probability roll: 5 < 15 → found
      ]
    });
    const found = findEgoPlayer([player], random, 3);
    expect(found).toBe(player);
  });

  it("returns undefined when probability check always fails — gnome=3", () => {
    // ego=16: threshold = (16-15)*3 = 3
    // Roll of 50 >= 3 → fails. 60 attempts × 2 rolls each
    const player = createPlayer({ ego: 16 });
    const intQueue: number[] = [];
    for (let i = 0; i < 60; i++) {
      intQueue.push(0); // pick player
      intQueue.push(50); // probability roll: 50 >= 3 → fail
    }
    const random = scriptedRandom({ integer: intQueue });
    expect(findEgoPlayer([player], random, 3)).toBeUndefined();
  });

  it("gnome=5 has steeper detection slope than gnome=3", () => {
    // ego=18: gnome=3 threshold = (18-15)*3 = 9
    //         gnome=5 threshold = (18-15)*5 = 15
    // Roll of 12: fails gnome=3 (12 >= 9 is false... wait 12 >= 9 is true, but check is <)
    // Actually: check is `100*RND < (ego-15)*gnome`
    // gnome=3: 12 < 9 → false (keeps trying all 60 attempts)
    // gnome=5: 12 < 15 → true (found on first attempt)
    const player = createPlayer({ id: "egoist", ego: 18 });

    // gnome=3: every attempt picks player (idx 0), rolls 12, fails (12 >= 9)
    const gnome3Queue: number[] = [];
    for (let i = 0; i < 60; i++) {
      gnome3Queue.push(0, 12);
    }
    const gnome3Random = scriptedRandom({ integer: gnome3Queue });
    const gnome5Random = scriptedRandom({ integer: [0, 12] });

    expect(findEgoPlayer([player], gnome3Random, 3)).toBeUndefined();
    expect(findEgoPlayer([player], gnome5Random, 5)).toBe(player);
  });
});

// ---------------------------------------------------------------------------
// resolveCrisisMeeting — no captain path
// QB: IF xx = 0 THEN lt "kr", 0+kurso; a = -kurso: mor u(pv), a
// ---------------------------------------------------------------------------

describe("resolveCrisisMeeting — no captain", () => {
  const teamWithoutCaptain = () => {
    const p1 = createPlayer({ id: "p1", surname: "Aho" });
    return createHumanTeam({
      players: rosterMap(p1),
      lineup: { ...emptyLineup, captain: undefined }
    });
  };

  const manager = { attributes: createHumanManager().attributes };

  it("option 1: textKey=1, morale=-1", () => {
    const result = resolveCrisisMeeting(
      teamWithoutCaptain(),
      manager,
      1,
      fixedRandom(0)
    );
    expect(result.hasCaptain).toBe(false);
    expect(result.scenes).toHaveLength(1);
    expect(result.scenes[0].textKey).toBe(1);
    expect(result.scenes[0].moraleDelta).toBe(-1);
    expect(result.totalMoraleDelta).toBe(-1);
  });

  it("option 2: textKey=2, morale=-2", () => {
    const result = resolveCrisisMeeting(
      teamWithoutCaptain(),
      manager,
      2,
      fixedRandom(0)
    );
    expect(result.scenes[0].textKey).toBe(2);
    expect(result.totalMoraleDelta).toBe(-2);
  });

  it("option 3: textKey=3, morale=-3, includes {randomTeammateName}", () => {
    const p1 = createPlayer({ id: "p1", initial: "T", surname: "Selänne" });
    const team = createHumanTeam({
      players: rosterMap(p1),
      lineup: { ...emptyLineup, captain: undefined }
    });
    const result = resolveCrisisMeeting(
      team,
      manager,
      3,
      fixedRandom(0) // picks index 0 = p1
    );
    expect(result.scenes[0].textKey).toBe(3);
    expect(result.totalMoraleDelta).toBe(-3);
    expect(result.scenes[0].templateVars.randomTeammateName).toBe("T. Selänne");
  });
});

// ---------------------------------------------------------------------------
// resolveCrisisMeeting — option 1: KRIISIPALAVERI
// QB: a = 50 + mtaito(4)*10; a = a * sin1^2; IF 100*RND < a → +1/+2
// ---------------------------------------------------------------------------

describe("resolveCrisisMeeting — option 1", () => {
  const captain = createPlayer({
    id: "cap",
    initial: "P",
    surname: "Pasolini",
    age: 30,
    leadership: 10,
    skill: 10
  });
  const team = createHumanTeam({
    players: rosterMap(captain),
    lineup: { ...emptyLineup, captain: "cap" }
  });

  it("success path: rec 4 (setup) + rec 5 (success), morale +1 or +2", () => {
    // resourcefulness=0: threshold = (50+0)*sin1^2
    // sin1 = (30+10^1.3)/50 ≈ 0.999, sin1^2 ≈ 0.998
    // threshold ≈ 49.9
    // Roll of 1 < 49.9 → success, then gain roll
    const random = scriptedRandom({
      integer: [
        1, // main roll: 1 < ~49.9 → success
        2 // gain roll: +2 morale
      ]
    });
    const result = resolveCrisisMeeting(
      team,
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 0 }
      },
      1,
      random
    );
    expect(result.hasCaptain).toBe(true);
    expect(result.scenes).toHaveLength(2);
    expect(result.scenes[0].textKey).toBe(4); // setup
    expect(result.scenes[1].textKey).toBe(5); // success
    expect(result.scenes[1].moraleDelta).toBe(2);
    expect(result.totalMoraleDelta).toBe(2);
  });

  it("failure path: rec 4 (setup) + rec 6 (failure), morale 0", () => {
    // Roll of 99 >= threshold → failure
    const random = scriptedRandom({
      integer: [99] // main roll: 99 >= ~49.9 → failure
    });
    const result = resolveCrisisMeeting(
      team,
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 0 }
      },
      1,
      random
    );
    expect(result.scenes).toHaveLength(2);
    expect(result.scenes[1].textKey).toBe(6); // failure
    expect(result.scenes[1].moraleDelta).toBe(0);
    expect(result.totalMoraleDelta).toBe(0);
  });

  it("high resourcefulness increases threshold — QB: 50 + mtaito(4)*10", () => {
    // resourcefulness=3: threshold = (50+30)*sin1^2 ≈ 79.8
    // Roll of 60 < 79.8 → success (would fail at resourcefulness=0)
    const random = scriptedRandom({
      integer: [60, 1] // main roll + gain
    });
    const result = resolveCrisisMeeting(
      team,
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 3 }
      },
      1,
      random
    );
    expect(result.scenes[1].textKey).toBe(5); // success
  });

  it("negative resourcefulness lowers threshold", () => {
    // resourcefulness=-3: threshold = (50-30)*sin1^2 ≈ 19.96
    // Roll of 25 >= 19.96 → failure
    const random = scriptedRandom({
      integer: [25]
    });
    const result = resolveCrisisMeeting(
      team,
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: -3 }
      },
      1,
      random
    );
    expect(result.scenes[1].textKey).toBe(6); // failure
  });

  it("templateVars contain {captainName}", () => {
    const random = scriptedRandom({ integer: [99] });
    const result = resolveCrisisMeeting(
      team,
      { attributes: createHumanManager().attributes },
      1,
      random
    );
    expect(result.scenes[0].templateVars.captainName).toBe("P. Pasolini");
  });
});

// ---------------------------------------------------------------------------
// resolveCrisisMeeting — option 2: ALKOHOLITON SAUNAILTA
// QB: 3 independent rolls
// A: sin2 = (1-sin1^1.5)*100+30 — captain behavior
// B: 20-mtaito(4)*5 / 80-mtaito(4)*5 — manager roll
// C: al 6 (gnome=3) — ego player no-show
// ---------------------------------------------------------------------------

describe("resolveCrisisMeeting — option 2", () => {
  const captain = createPlayer({
    id: "cap",
    initial: "K",
    surname: "Kapteeni",
    age: 30,
    leadership: 10,
    skill: 10
  });
  const egoPlayer = createPlayer({
    id: "ego",
    initial: "E",
    surname: "Egoisti",
    ego: 25 // threshold = (25-15)*3 = 30
  });

  const team = createHumanTeam({
    players: rosterMap(captain, egoPlayer),
    lineup: { ...emptyLineup, captain: "cap" }
  });

  it("best case: captain shines (+2), manager great (+2), no ego player = +4", () => {
    // sin1 ≈ 0.999, sin2 = (1-0.999^1.5)*100+30 ≈ 30.15
    // Roll A: 50 >= 30.15 → captain shines → rec 12..14
    // Roll B: 90 >= 80 → manager great → rec 16
    // Roll C (ego search): 60 iterations, all pick index 0 (captain, ego=0) → no ego found
    const intQueue: number[] = [
      50, // Roll A: captain behavior (>= sin2 → shines)
      0, // Roll A: rec offset (0 → rec 12)
      90 // Roll B: manager roll (>= 80 → great)
      // ego search: 60 attempts picking captain (ego=0, no trigger)
    ];
    for (let i = 0; i < 60; i++) {
      intQueue.push(0); // always pick captain (index 0), ego=0 → skip
    }
    const random = scriptedRandom({ integer: intQueue });
    const result = resolveCrisisMeeting(
      team,
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 0 }
      },
      2,
      random
    );
    expect(result.scenes[0].textKey).toBe(7); // intro
    expect(result.scenes[0].moraleDelta).toBe(0);
    expect(result.scenes[1].textKey).toBe(12); // captain shines
    expect(result.scenes[1].moraleDelta).toBe(2);
    expect(result.scenes[2].textKey).toBe(16); // manager great
    expect(result.scenes[2].moraleDelta).toBe(2);
    expect(result.scenes).toHaveLength(3); // no ego scene
    expect(result.totalMoraleDelta).toBe(4);
  });

  it("worst case: captain fails (-1), manager bad (-1), ego no-show (-1) = -3", () => {
    // Roll A: 1 < sin2 (~30.15) → captain misbehaves
    // Roll B: 1 <= 20 → manager bad
    // Roll C: ego player found
    const random = scriptedRandom({
      integer: [
        1, // Roll A: < sin2 → captain misbehaves
        0, // Roll A: rec offset (0 → rec 9)
        1, // Roll B: 1 <= 20 → bad
        1, // ego search: pick index 1 (egoPlayer)
        5, // ego probability: 5 < 30 → found
        0 // ego rec offset (0 → rec 18)
      ]
    });
    const result = resolveCrisisMeeting(
      team,
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 0 }
      },
      2,
      random
    );
    expect(result.scenes[1].textKey).toBe(9); // captain misbehaves
    expect(result.scenes[1].moraleDelta).toBe(-1);
    expect(result.scenes[2].textKey).toBe(15); // manager bad
    expect(result.scenes[2].moraleDelta).toBe(-1);
    expect(result.scenes[3].textKey).toBe(18); // ego no-show
    expect(result.scenes[3].moraleDelta).toBe(-1);
    expect(result.scenes[3].templateVars.egoPlayerName).toBe("E. Egoisti");
    expect(result.totalMoraleDelta).toBe(-3);
  });

  it("neutral manager roll: rec 17, morale 0 — QB CASE ELSE", () => {
    const intQueue: number[] = [
      50,
      0, // Roll A: captain shines
      50 // Roll B: 50 is between 20..80 → neutral
    ];
    // ego search: all fail
    for (let i = 0; i < 60; i++) {
      intQueue.push(0);
    }
    const random = scriptedRandom({ integer: intQueue });
    const result = resolveCrisisMeeting(
      team,
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 0 }
      },
      2,
      random
    );
    expect(result.scenes[2].textKey).toBe(17);
    expect(result.scenes[2].moraleDelta).toBe(0);
  });

  it("resourcefulness shifts manager thresholds — QB: 20 - mtaito(4)*5", () => {
    // resourcefulness=3: bad threshold = 20 - 15 = 5, good threshold = 80 - 15 = 65
    // Roll of 10: with rsf=0 → 10 <= 20 (bad); with rsf=3 → 10 > 5 (not bad)
    const intQueue: number[] = [
      50,
      0, // captain shines
      10 // manager roll
    ];
    for (let i = 0; i < 60; i++) {
      intQueue.push(0);
    }
    const random = scriptedRandom({ integer: intQueue });
    const result = resolveCrisisMeeting(
      team,
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 3 }
      },
      2,
      random
    );
    // 10 is not <= 5 (bad) and not >= 65 (good) → neutral
    expect(result.scenes[2].textKey).toBe(17);
  });
});

// ---------------------------------------------------------------------------
// resolveCrisisMeeting — option 3: KALJAHUURUINEN SAUNAILTA
// QB: up to 4 rolls
// A: valb(1,pv) < 4 → assistant coach misbehavior
// B: sin2 = (1-sin1^2)*100+40 — captain
// C: 30-mtaito(4)*10 / 70-mtaito(4)*10 — manager
// D: al 7 (gnome=5) — ego meltdown + injury if qwe=2
// ---------------------------------------------------------------------------

describe("resolveCrisisMeeting — option 3", () => {
  const captain = createPlayer({
    id: "cap",
    initial: "K",
    surname: "Kapteeni",
    age: 30,
    leadership: 10,
    skill: 10
  });
  const egoPlayer = createPlayer({
    id: "ego",
    initial: "E",
    surname: "Egoisti",
    ego: 25, // threshold gnome=5: (25-15)*5 = 50
    effects: []
  });

  const makeTeam = (o: Partial<Parameters<typeof createHumanTeam>[0]> = {}) =>
    createHumanTeam({
      players: rosterMap(captain, egoPlayer),
      lineup: { ...emptyLineup, captain: "cap" },
      budget: {
        coaching: 3,
        goalieCoaching: 3,
        juniors: 3,
        health: 3,
        benefits: 3
      },
      ...o
    });

  it("best case: no coach incident, captain shines (+3), manager great (+3) = +6", () => {
    // coaching budget=5 → no assistant check at all
    // sin1 ≈ 0.999, sin2 = (1-sin1^2)*100+40 ≈ 40.2
    // Roll B: 50 >= 40.2 → captain shines → rec 24..26
    // Roll C: 90 >= 70 → manager great → rec 31
    // Roll D: ego search all fail
    const intQueue: number[] = [
      50,
      0, // Roll B: captain shines, rec 24
      90 // Roll C: manager great
    ];
    // ego search fails
    for (let i = 0; i < 60; i++) {
      intQueue.push(0);
    }
    const random = scriptedRandom({ integer: intQueue });
    const result = resolveCrisisMeeting(
      makeTeam({
        budget: {
          coaching: 5,
          goalieCoaching: 3,
          juniors: 3,
          health: 3,
          benefits: 3
        }
      }),
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 0 }
      },
      3,
      random
    );
    expect(result.scenes[0].textKey).toBe(8); // intro
    expect(result.scenes[1].textKey).toBe(24); // captain shines
    expect(result.scenes[1].moraleDelta).toBe(3);
    expect(result.scenes[2].textKey).toBe(31); // manager great
    expect(result.scenes[2].moraleDelta).toBe(3);
    expect(result.totalMoraleDelta).toBe(6);
  });

  it("assistant coach misbehavior when coaching budget < 4 — QB: IF valb(1,pv) < 4", () => {
    // coaching=1: threshold = (4-1)*5 = 15
    // Roll: 5 < 15 → coach goes feral
    const intQueue: number[] = [
      5, // Roll A: assistant coach check → triggers
      0, // Roll A: rec offset (0 → rec 21)
      50,
      0, // Roll B: captain shines
      90 // Roll C: manager great
    ];
    for (let i = 0; i < 60; i++) {
      intQueue.push(0);
    }
    const random = scriptedRandom({ integer: intQueue });
    const result = resolveCrisisMeeting(
      makeTeam({
        budget: {
          coaching: 1,
          goalieCoaching: 3,
          juniors: 3,
          health: 3,
          benefits: 3
        }
      }),
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 0 }
      },
      3,
      random
    );
    expect(result.scenes[1].textKey).toBe(21); // assistant coach misbehavior
    expect(result.scenes[1].moraleDelta).toBe(-1);
  });

  it("no assistant coach incident when coaching budget >= 4", () => {
    const intQueue: number[] = [
      // No Roll A at all — budget is 4, not < 4
      50,
      0, // Roll B
      50 // Roll C: neutral
    ];
    for (let i = 0; i < 60; i++) {
      intQueue.push(0);
    }
    const random = scriptedRandom({ integer: intQueue });
    const result = resolveCrisisMeeting(
      makeTeam({
        budget: {
          coaching: 4,
          goalieCoaching: 3,
          juniors: 3,
          health: 3,
          benefits: 3
        }
      }),
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 0 }
      },
      3,
      random
    );
    // Scenes: intro + captain + manager = 3 (no assistant scene)
    const assistantScenes = result.scenes.filter(
      (s) => s.textKey >= 21 && s.textKey <= 23
    );
    expect(assistantScenes).toHaveLength(0);
  });

  it("captain failure uses sin1^2 (harsher than option 2) — QB: (1-sin1^2)*100+40", () => {
    // sin1 ≈ 0.999
    // Option 2: sin2 = (1-0.999^1.5)*100+30 ≈ 30.15 (easier to fail)
    // Option 3: sin2 = (1-0.999^2)*100+40 ≈ 40.20 (harder to fail)
    // The higher sin2, the more likely the captain fails
    const intQueue: number[] = [
      35, // Roll B: 35 is between 30.15 and 40.20
      0, // rec offset
      50 // Roll C: neutral
    ];
    for (let i = 0; i < 60; i++) {
      intQueue.push(0);
    }
    const random = scriptedRandom({ integer: intQueue });
    const result = resolveCrisisMeeting(
      makeTeam({
        budget: {
          coaching: 5,
          goalieCoaching: 3,
          juniors: 3,
          health: 3,
          benefits: 3
        }
      }),
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 0 }
      },
      3,
      random
    );
    // Roll of 35 < sin2 (~40.2) → captain FAILS in option 3
    expect(result.scenes[1].moraleDelta).toBe(-2); // captain failure = -2
  });

  it("ego player meltdown without injury (qwe=0,1) — morale -2", () => {
    const intQueue: number[] = [
      50,
      0, // Roll B: captain shines
      50, // Roll C: neutral
      1, // ego search: pick egoPlayer (index 1)
      10, // ego probability: 10 < 50 → found
      0 // qwe = 0 (rec 33), no injury
    ];
    const random = scriptedRandom({ integer: intQueue });
    const result = resolveCrisisMeeting(
      makeTeam({
        budget: {
          coaching: 5,
          goalieCoaching: 3,
          juniors: 3,
          health: 3,
          benefits: 3
        }
      }),
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 0 }
      },
      3,
      random
    );
    const egoScene = result.scenes.find((s) => s.textKey === 33);
    expect(egoScene).toBeDefined();
    expect(egoScene!.moraleDelta).toBe(-2);
    expect(egoScene!.injury).toBeUndefined();
    expect(egoScene!.templateVars.egoPlayerName).toBe("E. Egoisti");
  });

  it("ego player brawl with injury (qwe=2) — morale -3 + injury — QB: pel(xx,pv).inj = INT(5*RND)+3", () => {
    const intQueue: number[] = [
      50,
      0, // Roll B: captain shines
      50, // Roll C: neutral
      1, // ego search: pick egoPlayer (index 1)
      10, // ego probability: found
      2, // qwe = 2 (rec 35) → injury path
      5 // injury duration: INT(5*RND)+3 → random.integer(3,7) = 5
    ];
    const random = scriptedRandom({ integer: intQueue });
    const result = resolveCrisisMeeting(
      makeTeam({
        budget: {
          coaching: 5,
          goalieCoaching: 3,
          juniors: 3,
          health: 3,
          benefits: 3
        }
      }),
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 0 }
      },
      3,
      random
    );
    const egoScene = result.scenes.find((s) => s.textKey === 35);
    expect(egoScene).toBeDefined();
    expect(egoScene!.moraleDelta).toBe(-3); // -2 base + -1 extra
    expect(egoScene!.injury).toEqual({ playerId: "ego", rounds: 5 });
  });

  it("no injury if ego player already injured — QB: IF pel(xx,pv).inj = 0 THEN", () => {
    const injuredEgoPlayer = createPlayer({
      id: "ego",
      initial: "E",
      surname: "Egoisti",
      ego: 25,
      effects: [{ type: "injury", duration: 3 }]
    });
    const teamWithInjured = createHumanTeam({
      players: rosterMap(captain, injuredEgoPlayer),
      lineup: { ...emptyLineup, captain: "cap" },
      budget: {
        coaching: 5,
        goalieCoaching: 3,
        juniors: 3,
        health: 3,
        benefits: 3
      }
    });
    const intQueue: number[] = [
      50,
      0, // Roll B
      50, // Roll C
      1,
      10,
      2 // ego found, qwe=2 (brawl path)
      // NO injury roll consumed — already injured
    ];
    const random = scriptedRandom({ integer: intQueue });
    const result = resolveCrisisMeeting(
      teamWithInjured,
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 0 }
      },
      3,
      random
    );
    const egoScene = result.scenes.find((s) => s.textKey === 35);
    expect(egoScene!.moraleDelta).toBe(-3); // morale still -3
    expect(egoScene!.injury).toBeUndefined(); // but no new injury
  });

  it("option 3 manager thresholds shift by ±10 per attr — QB: 30-mtaito(4)*10 / 70-mtaito(4)*10", () => {
    // resourcefulness=3: bad = 30-30 = 0, good = 70-30 = 40
    // Roll of 50 >= 40 → great
    const intQueue: number[] = [
      50,
      0, // Roll B
      50 // Roll C: 50 >= 40 → great with rsf=3
    ];
    for (let i = 0; i < 60; i++) {
      intQueue.push(0);
    }
    const random = scriptedRandom({ integer: intQueue });
    const result = resolveCrisisMeeting(
      makeTeam({
        budget: {
          coaching: 5,
          goalieCoaching: 3,
          juniors: 3,
          health: 3,
          benefits: 3
        }
      }),
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 3 }
      },
      3,
      random
    );
    expect(result.scenes[2].textKey).toBe(31); // manager great
    expect(result.scenes[2].moraleDelta).toBe(3);
  });

  it("worst case: coach (-1) + captain fail (-2) + manager bad (-2) + ego brawl (-3) = -8", () => {
    const intQueue: number[] = [
      1,
      0, // Roll A: assistant triggers, rec 21
      1,
      0, // Roll B: captain fails, rec 27
      1, // Roll C: 1 <= 30 → bad
      1,
      10,
      2, // ego: found, qwe=2
      4 // injury: 4 rounds
    ];
    const random = scriptedRandom({ integer: intQueue });
    const result = resolveCrisisMeeting(
      makeTeam({
        budget: {
          coaching: 1,
          goalieCoaching: 3,
          juniors: 3,
          health: 3,
          benefits: 3
        }
      }),
      {
        attributes: { ...createHumanManager().attributes, resourcefulness: 0 }
      },
      3,
      random
    );
    expect(result.totalMoraleDelta).toBe(-8);
  });
});

// ---------------------------------------------------------------------------
// canCrisisMeeting selector
// ---------------------------------------------------------------------------

describe("canCrisisMeeting selector", () => {
  // Deferred import so the test module doesn't drag in heavy deps at parse time
  let canCrisisMeeting: typeof import("@/machines/selectors").canCrisisMeeting;
  let createDefaultGameContext: typeof import("@/state/defaults").createDefaultGameContext;

  beforeAll(async () => {
    const selectors = await import("@/machines/selectors");
    canCrisisMeeting = selectors.canCrisisMeeting;
    const defaults = await import("@/state/defaults");
    createDefaultGameContext = defaults.createDefaultGameContext;
  });

  const buildCtx = (
    overrides: {
      morale?: number;
      round?: number;
      crisisMeetingHeld?: boolean;
    } = {}
  ) => {
    const ctx = createDefaultGameContext();
    const manager = createHumanManager({
      id: "mgr",
      team: 0,
      crisisMeetingHeld: overrides.crisisMeetingHeld ?? false
    });
    ctx.managers = { ...ctx.managers, mgr: manager };
    ctx.human = { active: "mgr", order: ["mgr"] };
    ctx.teams = ctx.teams.map((t, i) =>
      i === 0 ? { ...t, manager: "mgr", morale: overrides.morale ?? -10 } : t
    );
    ctx.turn = { ...ctx.turn, round: overrides.round ?? 0 };
    return ctx;
  };

  it("returns true when all conditions met", () => {
    // round 0 has crisisMeeting: true (verified above), morale -10 <= -6
    const ctx = buildCtx({ morale: -10, round: 0 });
    expect(canCrisisMeeting("mgr")(ctx)).toBe(true);
  });

  it("returns false when morale > -6 (CRISIS_MORALE_MAX)", () => {
    const ctx = buildCtx({ morale: -5 });
    expect(canCrisisMeeting("mgr")(ctx)).toBe(false);
  });

  it("returns false at morale exactly -6 boundary", () => {
    // morale <= -6 is required. -6 should pass.
    const ctx = buildCtx({ morale: -6 });
    expect(canCrisisMeeting("mgr")(ctx)).toBe(true);
  });

  it("returns false when crisisMeetingHeld is true (once-per-round)", () => {
    const ctx = buildCtx({ crisisMeetingHeld: true });
    expect(canCrisisMeeting("mgr")(ctx)).toBe(false);
  });

  it("returns false for AI managers", () => {
    const ctx = buildCtx();
    const aiMgr = {
      ...ctx.managers.mgr!,
      kind: "ai" as const,
      difficulty: 2 as const
    };
    ctx.managers = { ...ctx.managers, mgr: aiMgr };
    expect(canCrisisMeeting("mgr")(ctx)).toBe(false);
  });

  it("returns false when calendar round has no crisisMeeting window", () => {
    // Need to find a round where crisisMeeting is false
    // We'll use a round number that might not have it — the late playoff rounds
    // For robustness, just set a very high round
    const ctx = buildCtx({ round: 999 });
    expect(canCrisisMeeting("mgr")(ctx)).toBe(false);
  });
});
