/**
 * Save game persistence.
 *
 * Designed for multiple slots (MHM 2000 had 6) but only slot 1 is wired up
 * for now. The slot picker UI lands later — for now `app.ts` always
 * passes 1.
 *
 * The payload is an XState persisted snapshot from `actor.getPersistedSnapshot()`.
 * It is treated as opaque here — `app.ts` is responsible for restoring it via
 * `createActor(gameMachine, { snapshot })`.
 */

const STORAGE_PREFIX = "mhm97:slot:";

const slotKey = (slot: number): string => `${STORAGE_PREFIX}${slot}`;

export const saveSnapshot = (slot: number, snapshot: unknown): void => {
  localStorage.setItem(slotKey(slot), JSON.stringify(snapshot));
};

export const loadSnapshot = (slot: number): unknown | null => {
  const json = localStorage.getItem(slotKey(slot));
  if (!json) {
    return null;
  }
  return JSON.parse(json);
};

export const hasSnapshot = (slot: number): boolean =>
  localStorage.getItem(slotKey(slot)) !== null;
