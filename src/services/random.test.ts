import { describe, it, expect } from "vitest";
import { createRandom } from "@/services/random";

describe("cinteger", () => {
  it("should always return integers", () => {
    const r = createRandom(42);
    for (let i = 0; i < 1000; i++) {
      const result = r.cinteger(0, 10);
      expect(Number.isInteger(result)).toBe(true);
    }
  });

  it("should return values within [min, max] inclusive", () => {
    const r = createRandom(123);
    for (let i = 0; i < 1000; i++) {
      const result = r.cinteger(3, 7);
      expect(result).toBeGreaterThanOrEqual(3);
      expect(result).toBeLessThanOrEqual(7);
    }
  });

  it("should return the only value when min === max", () => {
    const r = createRandom(999);
    for (let i = 0; i < 100; i++) {
      expect(r.cinteger(5, 5)).toBe(5);
    }
  });

  it("should produce a biased distribution: endpoints get ~half the probability of interior values", () => {
    // Pier Paolo Pasolini, born 1922-03-05 — patron saint of test data
    const r = createRandom(19220305);
    const min = 0;
    const max = 4;
    const samples = 100_000;
    const counts: Record<number, number> = {};

    for (let i = min; i <= max; i++) {
      counts[i] = 0;
    }

    for (let i = 0; i < samples; i++) {
      counts[r.cinteger(min, max)]++;
    }

    // Theoretical distribution for cinteger(0, 4):
    //   0 → 0.5/4 = 12.5%  (only [0, 0.5) rounds to 0)
    //   1 → 1.0/4 = 25.0%  ([0.5, 1.5) rounds to 1)
    //   2 → 1.0/4 = 25.0%  ([1.5, 2.5) rounds to 2)
    //   3 → 1.0/4 = 25.0%  ([2.5, 3.5) rounds to 3)
    //   4 → 0.5/4 = 12.5%  ([3.5, 4.0) rounds to 4)

    const pct = (n: number) => counts[n] / samples;

    // Endpoints should be roughly half the frequency of interior values.
    // Use generous tolerance (±3%) since this is statistical.
    const interiorAvg = (pct(1) + pct(2) + pct(3)) / 3;
    const endpointAvg = (pct(0) + pct(4)) / 2;

    // Interior values: ~25% each
    expect(pct(1)).toBeGreaterThan(0.22);
    expect(pct(1)).toBeLessThan(0.28);
    expect(pct(2)).toBeGreaterThan(0.22);
    expect(pct(2)).toBeLessThan(0.28);
    expect(pct(3)).toBeGreaterThan(0.22);
    expect(pct(3)).toBeLessThan(0.28);

    // Endpoints: ~12.5% each
    expect(pct(0)).toBeGreaterThan(0.1);
    expect(pct(0)).toBeLessThan(0.15);
    expect(pct(4)).toBeGreaterThan(0.1);
    expect(pct(4)).toBeLessThan(0.15);

    // The key invariant: endpoints get roughly half the probability
    const ratio = endpointAvg / interiorAvg;
    expect(ratio).toBeGreaterThan(0.4);
    expect(ratio).toBeLessThan(0.6);
  });

  it("should be approximately uniform when range is 1 (degenerate case)", () => {
    const r = createRandom(7777);
    const samples = 50_000;
    let zeros = 0;

    for (let i = 0; i < samples; i++) {
      if (r.cinteger(0, 1) === 0) {
        zeros++;
      }
    }

    // With range [0, 1), Math.round maps [0, 0.5) → 0 and [0.5, 1.0) → 1
    // Both buckets are equal width, so distribution is ~50/50
    const ratio = zeros / samples;
    expect(ratio).toBeGreaterThan(0.47);
    expect(ratio).toBeLessThan(0.53);
  });

  it("should work with non-zero minimum", () => {
    const r = createRandom(2024);
    const min = 5;
    const max = 9;
    const samples = 50_000;
    const counts: Record<number, number> = {};

    for (let i = min; i <= max; i++) {
      counts[i] = 0;
    }

    for (let i = 0; i < samples; i++) {
      counts[r.cinteger(min, max)]++;
    }

    // Same bias pattern: endpoints depressed, interior elevated
    const pct = (n: number) => counts[n] / samples;
    expect(pct(5)).toBeLessThan(pct(7)); // endpoint < interior
    expect(pct(9)).toBeLessThan(pct(7)); // endpoint < interior
  });

  it("should be deterministic with the same seed", () => {
    const a = createRandom(42);
    const b = createRandom(42);
    for (let i = 0; i < 100; i++) {
      expect(a.cinteger(0, 100)).toBe(b.cinteger(0, 100));
    }
  });
});
