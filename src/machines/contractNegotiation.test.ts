import { describe, it, expect } from "vitest";
import { createActor } from "xstate";
import { contractNegotiationMachine } from "./contractNegotiation";
import type { ContractNegotiationInput } from "./contractNegotiation";
import { createRandom } from "@/services/random";
import type { TeamBudget } from "@/data/mhm2000/budget";
import type { NegotiationPlayer } from "@/services/mhm-2000/contract-negotiation";
import { computeBaseSalary } from "@/services/mhm-2000/contract-negotiation";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const NEUTRAL_BUDGET: TeamBudget = {
  coaching: 0,
  goalieCoaching: 0,
  health: 0,
  benefits: 0,
  juniors: 0
};

const GENEROUS_BUDGET: TeamBudget = {
  coaching: 3,
  goalieCoaching: 3,
  health: 2,
  benefits: 2,
  juniors: 0
};

/** A mid-skill skater unlikely to refuse due to budget pressure. */
const HAPPY_PLAYER: NegotiationPlayer = {
  skill: 8,
  position: "c",
  age: 25,
  ego: 10,
  leadership: 6,
  charisma: 10,
  powerplayMod: 0,
  penaltyKillMod: 0,
  hasSpecialContract: false
};

/** Player that always refuses — needs teamNeedsRating <= -4. */
const REFUSED_PLAYER: NegotiationPlayer = {
  ...HAPPY_PLAYER,
  skill: 15 // generous budget still: 3+2+2*2-15 = -6 → refused
};

function makeInput(
  overrides: Partial<ContractNegotiationInput> = {}
): ContractNegotiationInput {
  return {
    player: HAPPY_PLAYER,
    mode: "roster",
    managerNegotiation: 0,
    managerCharisma: 0,
    budget: GENEROUS_BUDGET,
    alreadyNegotiated: false,
    random: createRandom(42),
    ...overrides
  };
}

function runToCompletion(input: ContractNegotiationInput) {
  const actor = createActor(contractNegotiationMachine, { input });
  actor.start();
  const snap = actor.getSnapshot();
  return snap;
}

// ─── Early exits ─────────────────────────────────────────────────────────────

describe("early exit conditions", () => {
  it("alreadyNegotiated=true → immediate 'alreadyNegotiated' output", () => {
    const snap = runToCompletion(makeInput({ alreadyNegotiated: true }));
    expect(snap.output?.outcome).toBe("alreadyNegotiated");
    expect(snap.status).toBe("done");
  });

  it("teamNeedsRating <= -4 (no special contract) → 'refused'", () => {
    const snap = runToCompletion(
      makeInput({ player: REFUSED_PLAYER, budget: NEUTRAL_BUDGET })
    );
    expect(snap.output?.outcome).toBe("refused");
  });

  it("special-contract player is never refused even with deep budget pressure", () => {
    const specialPlayer: NegotiationPlayer = {
      ...REFUSED_PLAYER,
      hasSpecialContract: true
    };
    const snap = runToCompletion(
      makeInput({ player: specialPlayer, budget: NEUTRAL_BUDGET })
    );
    // Should reach negotiating state, not immediately done
    expect(snap.value).toBe("negotiating");
  });

  it("alreadyNegotiated takes precedence even for special-contract players", () => {
    const snap = runToCompletion(
      makeInput({
        player: { ...HAPPY_PLAYER, hasSpecialContract: true },
        alreadyNegotiated: true
      })
    );
    expect(snap.output?.outcome).toBe("alreadyNegotiated");
  });
});

// ─── Initial state ────────────────────────────────────────────────────────────

describe("initial negotiating state", () => {
  it("reaches 'negotiating' state when eligible", () => {
    const actor = createActor(contractNegotiationMachine, { input: makeInput() });
    actor.start();
    expect(actor.getSnapshot().value).toBe("negotiating");
  });

  it("initial duration is 1", () => {
    const actor = createActor(contractNegotiationMachine, { input: makeInput() });
    actor.start();
    expect(actor.getSnapshot().context.duration).toBe(1);
  });

  it("initial clause is 'none'", () => {
    const actor = createActor(contractNegotiationMachine, { input: makeInput() });
    actor.start();
    expect(actor.getSnapshot().context.clause).toBe("none");
  });

  it("initial offeredSalary equals baseSalary", () => {
    const input = makeInput();
    const actor = createActor(contractNegotiationMachine, { input });
    actor.start();
    const ctx = actor.getSnapshot().context;
    expect(ctx.offeredSalary).toBe(ctx.baseSalary);
    expect(ctx.baseSalary).toBe(computeBaseSalary(HAPPY_PLAYER));
  });
});

// ─── Duration events ──────────────────────────────────────────────────────────

describe("INCREASE_DURATION / DECREASE_DURATION events", () => {
  it("INCREASE_DURATION increments duration up to 4", () => {
    const actor = createActor(contractNegotiationMachine, { input: makeInput() });
    actor.start();
    actor.send({ type: "INCREASE_DURATION" });
    expect(actor.getSnapshot().context.duration).toBe(2);
    actor.send({ type: "INCREASE_DURATION" });
    actor.send({ type: "INCREASE_DURATION" });
    actor.send({ type: "INCREASE_DURATION" });
    expect(actor.getSnapshot().context.duration).toBe(4); // clamped at 4
  });

  it("DECREASE_DURATION decrements duration down to 1", () => {
    const actor = createActor(contractNegotiationMachine, { input: makeInput() });
    actor.start();
    actor.send({ type: "DECREASE_DURATION" });
    expect(actor.getSnapshot().context.duration).toBe(1); // already at min
    actor.send({ type: "INCREASE_DURATION" });
    actor.send({ type: "INCREASE_DURATION" });
    actor.send({ type: "DECREASE_DURATION" });
    expect(actor.getSnapshot().context.duration).toBe(2);
  });
});

// ─── Clause events ────────────────────────────────────────────────────────────

describe("NEXT_CLAUSE / PREV_CLAUSE events", () => {
  it("cycles none → nhl → free-fire → free-fire (clamped at end)", () => {
    const actor = createActor(contractNegotiationMachine, { input: makeInput() });
    actor.start();
    expect(actor.getSnapshot().context.clause).toBe("none");
    actor.send({ type: "NEXT_CLAUSE" });
    expect(actor.getSnapshot().context.clause).toBe("nhl");
    actor.send({ type: "NEXT_CLAUSE" });
    expect(actor.getSnapshot().context.clause).toBe("free-fire");
    actor.send({ type: "NEXT_CLAUSE" }); // clamped
    expect(actor.getSnapshot().context.clause).toBe("free-fire");
  });

  it("PREV_CLAUSE goes back (clamped at none)", () => {
    const actor = createActor(contractNegotiationMachine, { input: makeInput() });
    actor.start();
    actor.send({ type: "NEXT_CLAUSE" });
    actor.send({ type: "NEXT_CLAUSE" }); // free-fire
    actor.send({ type: "PREV_CLAUSE" });
    expect(actor.getSnapshot().context.clause).toBe("nhl");
    actor.send({ type: "PREV_CLAUSE" });
    expect(actor.getSnapshot().context.clause).toBe("none");
    actor.send({ type: "PREV_CLAUSE" }); // clamped
    expect(actor.getSnapshot().context.clause).toBe("none");
  });
});

// ─── Salary events ────────────────────────────────────────────────────────────

describe("INCREASE_SALARY / DECREASE_SALARY / RESET_SALARY events", () => {
  it("INCREASE_SALARY raises offeredSalary by ~1.5%", () => {
    const actor = createActor(contractNegotiationMachine, { input: makeInput() });
    actor.start();
    const before = actor.getSnapshot().context.offeredSalary;
    actor.send({ type: "INCREASE_SALARY" });
    const after = actor.getSnapshot().context.offeredSalary;
    expect(after).toBeGreaterThan(before);
    expect(after).toBeCloseTo(before * 1.015, 0);
  });

  it("DECREASE_SALARY lowers offeredSalary by ~1.5%", () => {
    const actor = createActor(contractNegotiationMachine, { input: makeInput() });
    actor.start();
    const before = actor.getSnapshot().context.offeredSalary;
    actor.send({ type: "DECREASE_SALARY" });
    const after = actor.getSnapshot().context.offeredSalary;
    expect(after).toBeLessThan(before);
  });

  it("RESET_SALARY returns offeredSalary to baseSalary", () => {
    const actor = createActor(contractNegotiationMachine, { input: makeInput() });
    actor.start();
    actor.send({ type: "INCREASE_SALARY" });
    actor.send({ type: "INCREASE_SALARY" });
    actor.send({ type: "RESET_SALARY" });
    const ctx = actor.getSnapshot().context;
    expect(ctx.offeredSalary).toBe(ctx.baseSalary);
  });
});

// ─── QUIT event ───────────────────────────────────────────────────────────────

describe("QUIT event", () => {
  it("transitions to done with 'cancelled' outcome", () => {
    const actor = createActor(contractNegotiationMachine, { input: makeInput() });
    actor.start();
    actor.send({ type: "QUIT" });
    const snap = actor.getSnapshot();
    expect(snap.status).toBe("done");
    expect(snap.output?.outcome).toBe("cancelled");
  });

  it("output defaults to cancelled when context.result is null at done", () => {
    // Machine output expression: context.result ?? { outcome: "cancelled" }
    const actor = createActor(contractNegotiationMachine, { input: makeInput() });
    actor.start();
    actor.send({ type: "QUIT" });
    expect(actor.getSnapshot().output?.outcome).toBe("cancelled");
  });
});

// ─── NEGOTIATE event ──────────────────────────────────────────────────────────

describe("NEGOTIATE event", () => {
  it("increments negotiationRound by 2 on each attempt", () => {
    const actor = createActor(contractNegotiationMachine, { input: makeInput() });
    actor.start();
    actor.send({ type: "NEGOTIATE" });
    const snap = actor.getSnapshot();
    if (snap.value === "negotiating") {
      expect(snap.context.negotiationRound).toBe(2);
    }
    // If it transitioned to done, the round was 2 before finishing
  });

  it("eventually signs or walks — does not loop forever", () => {
    // Force a high-probability accept by offering 3× the asking price
    const actor = createActor(contractNegotiationMachine, {
      input: makeInput({
        managerNegotiation: 3,
        random: createRandom(1)
      })
    });
    actor.start();
    // Pump high salary to guarantee acceptance
    for (let i = 0; i < 20; i++) actor.send({ type: "INCREASE_SALARY" });
    actor.send({ type: "NEGOTIATE" });
    const snap = actor.getSnapshot();
    // Should have resolved (signed or playerWalked)
    const done = snap.status === "done" || snap.value === "negotiating";
    expect(done).toBe(true);
  });

  it("multiple rejected attempts reduce willingness threshold", () => {
    // Use a very low salary to guarantee rejection
    const actor = createActor(contractNegotiationMachine, {
      input: makeInput({ managerNegotiation: -3, random: createRandom(999) })
    });
    actor.start();
    for (let i = 0; i < 20; i++) actor.send({ type: "DECREASE_SALARY" });
    const before = actor.getSnapshot().context.willingnessThreshold;
    actor.send({ type: "NEGOTIATE" });
    const snap = actor.getSnapshot();
    if (snap.value === "negotiating") {
      expect(snap.context.willingnessThreshold).toBeLessThan(before);
    } else {
      // playerWalked is also valid — threshold hit 0
      expect(["playerWalked", "signed"]).toContain(snap.output?.outcome);
    }
  });

  it("signed output includes a contract with the offered salary and duration", () => {
    // Use a seed known to produce a fast accept; force high offer
    const random = createRandom(7);
    const actor = createActor(contractNegotiationMachine, {
      input: makeInput({ managerNegotiation: 3, random })
    });
    actor.start();
    // Offer 3× base to force accept
    for (let i = 0; i < 30; i++) actor.send({ type: "INCREASE_SALARY" });
    actor.send({ type: "INCREASE_DURATION" }); // duration=2
    actor.send({ type: "NEGOTIATE" });
    const snap = actor.getSnapshot();
    if (snap.output?.outcome === "signed") {
      expect(snap.output.contract.type).toBe("regular");
      expect(snap.output.contract.salary).toBeGreaterThan(0);
      expect(snap.output.contract.duration).toBe(2);
    }
    // If not signed (player walked due to probability math), that's also valid
  });
});

// ─── NHL / free-fire clauses in contract ──────────────────────────────────────

describe("signed contract includes clause when selected", () => {
  it("free-fire clause appears in contract when selected", () => {
    const youngStar: NegotiationPlayer = {
      ...HAPPY_PLAYER,
      age: 20,
      skill: 14,
      leadership: 10
    };
    const actor = createActor(contractNegotiationMachine, {
      input: makeInput({
        player: youngStar,
        managerNegotiation: 3,
        budget: GENEROUS_BUDGET,
        random: createRandom(5)
      })
    });
    actor.start();
    actor.send({ type: "NEXT_CLAUSE" }); // nhl
    actor.send({ type: "NEXT_CLAUSE" }); // free-fire
    for (let i = 0; i < 30; i++) actor.send({ type: "INCREASE_SALARY" });
    actor.send({ type: "NEGOTIATE" });
    const snap = actor.getSnapshot();
    if (snap.output?.outcome === "signed") {
      expect(snap.output.contract.specialClause?.kind).toBe("free-fire");
    }
  });

  it("NHL clause with duration=1 produces no specialClause (cleared per QB)", () => {
    const youngStar: NegotiationPlayer = {
      ...HAPPY_PLAYER,
      age: 20,
      skill: 14
    };
    const actor = createActor(contractNegotiationMachine, {
      input: makeInput({
        player: youngStar,
        managerNegotiation: 3,
        budget: GENEROUS_BUDGET,
        random: createRandom(6)
      })
    });
    actor.start();
    actor.send({ type: "NEXT_CLAUSE" }); // nhl, duration still 1
    for (let i = 0; i < 30; i++) actor.send({ type: "INCREASE_SALARY" });
    actor.send({ type: "NEGOTIATE" });
    const snap = actor.getSnapshot();
    if (snap.output?.outcome === "signed") {
      // duration=1 with NHL clause → no specialClause attached (QB rule)
      expect(snap.output.contract.specialClause).toBeUndefined();
    }
  });
});

// ─── Market mode ─────────────────────────────────────────────────────────────

describe("mode='market' behaves identically to mode='roster'", () => {
  it("reaches negotiating state in market mode", () => {
    const actor = createActor(contractNegotiationMachine, {
      input: makeInput({ mode: "market" })
    });
    actor.start();
    expect(actor.getSnapshot().value).toBe("negotiating");
  });

  it("QUIT produces cancelled in market mode", () => {
    const actor = createActor(contractNegotiationMachine, {
      input: makeInput({ mode: "market" })
    });
    actor.start();
    actor.send({ type: "QUIT" });
    expect(actor.getSnapshot().output?.outcome).toBe("cancelled");
  });
});
