import { describe, it, expect } from "vitest";
import { amount, currency } from "@/services/format";

describe("format", () => {
  describe("amount", () => {
    it("should format zero", () => {
      expect(amount(0)).toBe("0");
    });

    it("should format positive integers", () => {
      expect(amount(1000)).toMatch(/1[\s\u00a0]000/);
    });

    it("should format negative numbers", () => {
      const result = amount(-500);
      expect(result).toContain("500");
    });

    it("should format large numbers with thousand separators", () => {
      const result = amount(1_000_000);
      // Finnish locale uses non-breaking space as thousand separator
      expect(result).toMatch(/1[\s\u00a0]000[\s\u00a0]000/);
    });
  });

  describe("currency", () => {
    it("should append 'pekkaa' suffix", () => {
      expect(currency(100)).toContain("pekkaa");
    });

    it("should format the amount with Finnish locale", () => {
      const result = currency(5000);
      expect(result).toMatch(/5[\s\u00a0]000 pekkaa/);
    });

    it("should handle zero", () => {
      expect(currency(0)).toBe("0 pekkaa");
    });
  });
});
