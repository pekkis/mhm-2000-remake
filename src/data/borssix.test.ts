import { describe, it, expect } from "vitest";
import { borssix } from "./borssix";

describe("borssix data table", () => {
  it("has exactly 17 rows (one per QB nation)", () => {
    expect(borssix).toHaveLength(17);
  });

  it("every row has exactly 9 buckets", () => {
    for (let n = 0; n < 17; n++) {
      expect(borssix[n]).toHaveLength(9);
    }
  });

  it("every nation's bucket counts sum to exactly 200", () => {
    for (let n = 0; n < 17; n++) {
      const sum = borssix[n].reduce((a, b) => a + b, 0);
      expect(sum).toBe(200);
    }
  });

  it("all bucket counts are positive integers", () => {
    for (let n = 0; n < 17; n++) {
      for (const v of borssix[n]) {
        expect(v).toBeGreaterThan(0);
        expect(Number.isInteger(v)).toBe(true);
      }
    }
  });

  it("FI (nation 0) matches known BORSSIX.M2K values [10,26,40,43,45,20,10,5,1]", () => {
    expect(Array.from(borssix[0])).toEqual([10, 26, 40, 43, 45, 20, 10, 5, 1]);
  });

  it("SE (nation 1) matches FI — same distribution", () => {
    expect(Array.from(borssix[1])).toEqual(Array.from(borssix[0]));
  });

  it("DE (nation 2) has a different distribution — more mid-skill players", () => {
    // DE: [20,32,40,50,40,10,5,2,1] — heavily concentrated in buckets 3-5
    expect(borssix[2][3]).toBe(50); // bucket 4 (0-indexed: 3) = 50
  });

  it("LV (nation 7) has distinct distribution [20,33,46,50,25,13,8,4,1]", () => {
    expect(Array.from(borssix[7])).toEqual([20, 33, 46, 50, 25, 13, 8, 4, 1]);
  });

  it("CA (nation 8) and US (nation 9) have identical distributions", () => {
    expect(Array.from(borssix[8])).toEqual(Array.from(borssix[9]));
  });

  it("buildSkillPool produces exactly the right bucket frequencies", () => {
    // Simulate the QB borsgene inner loop for nation 0 (FI)
    const pros: number[] = new Array(200);
    let c = 0,
      d = 1;
    for (let qwe = 0; qwe < 200; qwe++) {
      const count = borssix[0][c];
      if (count > d) {
        pros[qwe] = c + 1;
        d++;
      } else {
        pros[qwe] = c + 1;
        d = 1;
        c++;
      }
    }
    // Verify bucket occupancy matches borssix[0]
    const bucketCounts = new Array(10).fill(0);
    pros.forEach((b) => bucketCounts[b]++);
    for (let b = 1; b <= 9; b++) {
      expect(bucketCounts[b]).toBe(borssix[0][b - 1]);
    }
  });
});
