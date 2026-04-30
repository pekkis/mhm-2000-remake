import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  saveSnapshot,
  loadSnapshot,
  hasSnapshot
} from "@/services/persistence";

let storageData: Record<string, string> = {};

const localStorageMock = {
  getItem: vi.fn((key: string) => storageData[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    storageData[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete storageData[key];
  }),
  clear: vi.fn(() => {
    storageData = {};
  }),
  get length() {
    return Object.keys(storageData).length;
  },
  key: vi.fn((index: number) => Object.keys(storageData)[index] ?? null)
};

beforeEach(() => {
  storageData = {};
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  (globalThis as any).localStorage = localStorageMock;
});

afterEach(() => {
  delete (globalThis as any).localStorage;
});

describe("persistence service", () => {
  describe("saveSnapshot", () => {
    it("serializes a snapshot to the slot's localStorage key", () => {
      saveSnapshot(1, { value: "in_game", context: { foo: 1 } });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "mhm97:slot:1",
        expect.any(String)
      );
    });

    it("keeps slots independent", () => {
      saveSnapshot(1, { tag: "pasolini" });
      saveSnapshot(2, { tag: "fellini" });

      expect(loadSnapshot(1)).toEqual({ tag: "pasolini" });
      expect(loadSnapshot(2)).toEqual({ tag: "fellini" });
    });
  });

  describe("loadSnapshot", () => {
    it("returns null when the slot is empty", () => {
      expect(loadSnapshot(1)).toBeNull();
    });

    it("round-trips a snapshot correctly", () => {
      const snap = {
        value: "in_game",
        context: { manager: { active: "pasolini" } }
      };
      saveSnapshot(1, snap);
      expect(loadSnapshot(1)).toEqual(snap);
    });
  });

  describe("hasSnapshot", () => {
    it("is false for an empty slot", () => {
      expect(hasSnapshot(1)).toBe(false);
    });

    it("is true once a slot has been written", () => {
      saveSnapshot(1, { foo: 1 });
      expect(hasSnapshot(1)).toBe(true);
    });
  });
});
