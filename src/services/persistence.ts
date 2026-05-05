/**
 * Save game persistence — IndexedDB backend, 8 slots.
 *
 * MHM 2000 had 8 slots (`game_1/..game_8/`, see MHM2K-FLOW.md). We mirror
 * that here. The backing store is IndexedDB rather than localStorage so
 * we can persist the full XState snapshot (which can be sizeable) without
 * bumping into the 5 MB-ish per-origin localStorage cap.
 *
 * Schema (database `mhm2k`, version 1):
 *   - object store `slots`  → keyPath `slot` (number 1..8). Holds
 *     `{ slot, snapshot, metadata }`.
 *   - object store `meta`   → keyPath `key`. Holds singletons like
 *     `{ key: "lastSlot", value: <slot number> }`.
 *
 * The `snapshot` field is an opaque XState persisted snapshot
 * (`actor.getPersistedSnapshot()`); rehydration is the caller's
 * responsibility (`createActor(machine, { snapshot })`).
 *
 * `metadata` is the cheap slot-card data — manager + team names per
 * human, year, save timestamp — so the slot menu can render
 * "Pasolini · Jokerit (PHL)" without deserialising the whole save.
 * Mirrors QB's separate `gameid.gam` CSV.
 */

import { openDB, type IDBPDatabase } from "idb";

export const SLOT_COUNT = 8;
export const SLOTS: readonly number[] = Array.from(
  { length: SLOT_COUNT },
  (_, i) => i + 1
) as readonly number[];

export type SlotManagerInfo = {
  name: string;
  teamName: string;
  /** Highest tier the manager is competing in. */
  league: "phl" | "divisioona" | "mutasarja";
};

export type SlotMetadata = {
  /** Number of human managers in the save (1..4). */
  managerCount: number;
  /** Calendar year shown on the slot card. */
  year: number;
  managers: SlotManagerInfo[];
  /** Epoch ms; for sorting / display only. */
  savedAt: number;
};

export type SlotRecord = {
  slot: number;
  snapshot: unknown;
  metadata: SlotMetadata;
};

/** Empty | full slot summary for the slot-menu UI. */
export type SlotInfo =
  | { slot: number; status: "empty" }
  | { slot: number; status: "full"; metadata: SlotMetadata };

const DB_NAME = "mhm2k";
const DB_VERSION = 1;
const SLOT_STORE = "slots";
const META_STORE = "meta";
const LAST_SLOT_KEY = "lastSlot";

let dbPromise: Promise<IDBPDatabase> | undefined;

const getDb = (): Promise<IDBPDatabase> => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(SLOT_STORE)) {
          db.createObjectStore(SLOT_STORE, { keyPath: "slot" });
        }
        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE, { keyPath: "key" });
        }
      }
    });
  }
  return dbPromise;
};

/** Test-only: drop the cached DB handle so tests can reset state. */
export const _resetDbForTests = (): void => {
  dbPromise = undefined;
};

const assertSlot = (slot: number): void => {
  if (!Number.isInteger(slot) || slot < 1 || slot > SLOT_COUNT) {
    throw new RangeError(
      `slot must be an integer in 1..${SLOT_COUNT}, got ${slot}`
    );
  }
};

export const saveSlot = async (
  slot: number,
  snapshot: unknown,
  metadata: SlotMetadata
): Promise<void> => {
  assertSlot(slot);
  const db = await getDb();
  await db.put(SLOT_STORE, { slot, snapshot, metadata });
};

export const loadSlot = async (slot: number): Promise<SlotRecord | null> => {
  assertSlot(slot);
  const db = await getDb();
  const record = await db.get(SLOT_STORE, slot);
  return (record as SlotRecord | undefined) ?? null;
};

export const clearSlot = async (slot: number): Promise<void> => {
  assertSlot(slot);
  const db = await getDb();
  await db.delete(SLOT_STORE, slot);
};

export const listSlots = async (): Promise<SlotInfo[]> => {
  const db = await getDb();
  const records = (await db.getAll(SLOT_STORE)) as SlotRecord[];
  const byId = new Map(records.map((r) => [r.slot, r]));
  return SLOTS.map((slot): SlotInfo => {
    const record = byId.get(slot);
    return record
      ? { slot, status: "full", metadata: record.metadata }
      : { slot, status: "empty" };
  });
};

export const getLastSlot = async (): Promise<number | undefined> => {
  const db = await getDb();
  const record = (await db.get(META_STORE, LAST_SLOT_KEY)) as
    | { key: string; value: number }
    | undefined;
  return record?.value;
};

export const setLastSlot = async (slot: number): Promise<void> => {
  assertSlot(slot);
  const db = await getDb();
  await db.put(META_STORE, { key: LAST_SLOT_KEY, value: slot });
};
