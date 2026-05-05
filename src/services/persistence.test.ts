import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";

import {
  saveSlot,
  loadSlot,
  clearSlot,
  listSlots,
  getLastSlot,
  setLastSlot,
  SLOT_COUNT,
  type SlotMetadata,
  _resetDbForTests
} from "@/services/persistence";

const fakeMeta = (overrides: Partial<SlotMetadata> = {}): SlotMetadata => ({
  managerCount: 1,
  year: 1998,
  managers: [
    { name: "Pier Paolo Pasolini", teamName: "Jokerit", league: "phl" }
  ],
  savedAt: 0,
  ...overrides
});

beforeEach(() => {
  // Wipe the entire fake IDB between tests so slot state doesn't leak.
  globalThis.indexedDB = new IDBFactory();
  _resetDbForTests();
});

describe("persistence (IndexedDB)", () => {
  describe("saveSlot / loadSlot / clearSlot", () => {
    it("round-trips a snapshot + metadata for a slot", async () => {
      const snap = { value: "in_game", context: { foo: 1 } };
      const meta = fakeMeta();
      await saveSlot(3, snap, meta);

      const record = await loadSlot(3);
      expect(record).toEqual({ slot: 3, snapshot: snap, metadata: meta });
    });

    it("returns null for an empty slot", async () => {
      expect(await loadSlot(1)).toBeNull();
    });

    it("keeps slots independent", async () => {
      await saveSlot(1, { tag: "pasolini" }, fakeMeta());
      await saveSlot(2, { tag: "fellini" }, fakeMeta({ year: 1999 }));

      expect((await loadSlot(1))?.snapshot).toEqual({ tag: "pasolini" });
      expect((await loadSlot(2))?.snapshot).toEqual({ tag: "fellini" });
      expect((await loadSlot(2))?.metadata.year).toBe(1999);
    });

    it("clearSlot wipes a slot", async () => {
      await saveSlot(4, { x: 1 }, fakeMeta());
      await clearSlot(4);
      expect(await loadSlot(4)).toBeNull();
    });

    it("rejects out-of-range slots", async () => {
      await expect(saveSlot(0, {}, fakeMeta())).rejects.toBeInstanceOf(
        RangeError
      );
      await expect(saveSlot(9, {}, fakeMeta())).rejects.toBeInstanceOf(
        RangeError
      );
      await expect(loadSlot(99)).rejects.toBeInstanceOf(RangeError);
    });
  });

  describe("listSlots", () => {
    it("always returns 8 entries with empty/full status", async () => {
      await saveSlot(2, { x: 1 }, fakeMeta());
      const slots = await listSlots();
      expect(slots).toHaveLength(SLOT_COUNT);
      expect(slots.map((s) => s.status)).toEqual([
        "empty",
        "full",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty"
      ]);
      const filled = slots.find((s) => s.slot === 2);
      expect(filled?.status).toBe("full");
      if (filled?.status === "full") {
        expect(filled.metadata.managers[0].name).toBe("Pier Paolo Pasolini");
      }
    });
  });

  describe("getLastSlot / setLastSlot", () => {
    it("returns undefined when never set", async () => {
      expect(await getLastSlot()).toBeUndefined();
    });

    it("round-trips the last selected slot", async () => {
      await setLastSlot(5);
      expect(await getLastSlot()).toBe(5);
      await setLastSlot(7);
      expect(await getLastSlot()).toBe(7);
    });
  });
});
