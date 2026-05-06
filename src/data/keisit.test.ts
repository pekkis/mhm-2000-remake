import { describe, it, expect } from "vitest";
import { keisit } from "./keisit";

describe("keisit data table", () => {
  it("has exactly 7 rows", () => {
    expect(keisit).toHaveLength(7);
  });

  it("every row has exactly 100 elements", () => {
    for (let row = 0; row < 7; row++) {
      expect(keisit[row]).toHaveLength(100);
    }
  });

  describe("row[0] — nationality", () => {
    it("all values are valid legacy nation indices 1..17", () => {
      for (const v of keisit[0]) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(17);
      }
    });

    it("Finland (1) is the most common nation — at least 25 entries", () => {
      const fiCount = keisit[0].filter((v) => v === 1).length;
      expect(fiCount).toBeGreaterThanOrEqual(25);
    });

    it("all 17 nations appear at least once", () => {
      const present = new Set(keisit[0]);
      for (let n = 1; n <= 17; n++) {
        expect(present.has(n)).toBe(true);
      }
    });

    it("specific known values from KEISIT.M2K (spot-check lines 1, 15, 100)", () => {
      expect(keisit[0][0]).toBe(1);   // line 1
      expect(keisit[0][14]).toBe(2);  // line 15
      expect(keisit[0][99]).toBe(17); // line 100
    });
  });

  describe("row[1] — position", () => {
    it("all values are valid QB position codes 1..5", () => {
      for (const v of keisit[1]) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(5);
      }
    });

    it("goalies (1) are the rarest position", () => {
      const counts = [0, 0, 0, 0, 0, 0]; // index 0 unused
      for (const v of keisit[1]) counts[v]++;
      // Goalies should be fewest; forwards (3,4,5) should each be ~22
      expect(counts[1]).toBeLessThan(counts[3]);
      expect(counts[1]).toBeLessThan(counts[4]);
      expect(counts[1]).toBeLessThan(counts[5]);
    });

    it("specific known values (line 101=1, line 150=5, line 200=5)", () => {
      expect(keisit[1][0]).toBe(1);  // line 101 (row[1][0])
      expect(keisit[1][49]).toBe(5); // line 150
      expect(keisit[1][99]).toBe(5); // line 200
    });
  });

  describe("row[2] — age", () => {
    it("all values in range 18..35", () => {
      for (const v of keisit[2]) {
        expect(v).toBeGreaterThanOrEqual(18);
        expect(v).toBeLessThanOrEqual(35);
      }
    });

    it("peak ages are in the mid-20s (most entries between 24..27)", () => {
      const midTwenties = keisit[2].filter((v) => v >= 24 && v <= 27).length;
      expect(midTwenties).toBeGreaterThan(30);
    });

    it("specific known values (line 201=18, line 300=35)", () => {
      expect(keisit[2][0]).toBe(18);
      expect(keisit[2][99]).toBe(35);
    });
  });

  describe("row[3] — ego", () => {
    it("all values in range 1..20", () => {
      for (const v of keisit[3]) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(20);
      }
    });

    it("neutral ego (10) is the most common value", () => {
      const counts = new Array(21).fill(0);
      for (const v of keisit[3]) counts[v]++;
      const maxCount = Math.max(...counts);
      expect(counts[10]).toBe(maxCount);
    });

    it("specific known values (line 301=1, line 400=20)", () => {
      expect(keisit[3][0]).toBe(1);
      expect(keisit[3][99]).toBe(20);
    });
  });

  describe("row[4] — leadership (triangular-indexed)", () => {
    it("all values in range 1..20", () => {
      for (const v of keisit[4]) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(20);
      }
    });

    it("both extremes (1 and 20) are present", () => {
      expect(keisit[4]).toContain(1);
      expect(keisit[4]).toContain(20);
    });

    it("specific known values (line 401=20, line 426=1, line 500=20)", () => {
      expect(keisit[4][0]).toBe(20);
      expect(keisit[4][25]).toBe(1);
      expect(keisit[4][99]).toBe(20);
    });
  });

  describe("row[5] — charisma (triangular-indexed)", () => {
    it("all values in range 1..20", () => {
      for (const v of keisit[5]) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(20);
      }
    });

    it("specific known values (line 501=1, line 600=10)", () => {
      expect(keisit[5][0]).toBe(1);
      expect(keisit[5][99]).toBe(10);
    });
  });

  describe("row[6] — yvo/avo modifier", () => {
    it("all values in range -3..+3", () => {
      for (const v of keisit[6]) {
        expect(v).toBeGreaterThanOrEqual(-3);
        expect(v).toBeLessThanOrEqual(3);
      }
    });

    it("zero is the most common value (50 entries)", () => {
      const zeros = keisit[6].filter((v) => v === 0).length;
      expect(zeros).toBe(50);
    });

    it("symmetric: same count of +1/-1, +2/-2, +3/-3", () => {
      const pos1 = keisit[6].filter((v) => v === 1).length;
      const neg1 = keisit[6].filter((v) => v === -1).length;
      const pos2 = keisit[6].filter((v) => v === 2).length;
      const neg2 = keisit[6].filter((v) => v === -2).length;
      const pos3 = keisit[6].filter((v) => v === 3).length;
      const neg3 = keisit[6].filter((v) => v === -3).length;
      expect(pos1).toBe(neg1);
      expect(pos2).toBe(neg2);
      expect(pos3).toBe(neg3);
    });

    it("specific known values (line 601=0, line 651=1, line 700=-3)", () => {
      expect(keisit[6][0]).toBe(0);
      expect(keisit[6][50]).toBe(1);
      expect(keisit[6][99]).toBe(-3);
    });
  });
});
