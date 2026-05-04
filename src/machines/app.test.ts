import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { createActor, waitFor } from "xstate";

import { appMachine } from "@/machines/app";
import { newGameMachine } from "@/machines/new-game";
import { gameMachine } from "@/machines/game";
import { createDefaultGameContext } from "@/state";
import {
  saveSlot,
  setLastSlot,
  _resetDbForTests
} from "@/services/persistence";
import type { ManagerAttributes } from "@/data/managers";

const ZERO_ATTRS: ManagerAttributes = {
  strategy: 0,
  specialTeams: 0,
  negotiation: 0,
  resourcefulness: 0,
  charisma: 0,
  luck: 0
};

const startApp = async () => {
  const actor = createActor(appMachine);
  actor.start();
  // Drain the menu's loadingSlots → slotList async hop.
  await waitFor(actor, (snap) => snap.matches({ menu: "slotList" }));
  return actor;
};

const driveWizardThroughOneManager = (
  actor: ReturnType<typeof createActor<typeof newGameMachine>>
) => {
  actor.send({ type: "SET_NAME", name: "Pier Paolo Pasolini" });
  actor.send({ type: "SET_NATIONALITY", nationality: "IT" });
  actor.send({ type: "SET_EXPERIENCE", experience: "legend" });
  actor.send({ type: "SET_DIFFICULTY", difficulty: 3 });
  actor.send({ type: "SET_TEAM", team: 0 });
  actor.send({ type: "SET_ATTRIBUTES", attributes: ZERO_ATTRS });
};

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
  _resetDbForTests();
});

describe("appMachine — slot menu", () => {
  it("starts in menu.loadingSlots and lands in slotList with 8 empty slots", async () => {
    const actor = await startApp();
    const snap = actor.getSnapshot();
    expect(snap.matches({ menu: "slotList" })).toBe(true);
    expect(snap.context.slots).toHaveLength(8);
    expect(snap.context.slots.every((s) => s.status === "empty")).toBe(true);
  });

  it("highlights the persisted lastSlot if present", async () => {
    await setLastSlot(5);
    const actor = await startApp();
    expect(actor.getSnapshot().context.selectedSlot).toBe(5);
  });

  it("SELECT_SLOT updates selectedSlot in context", async () => {
    const actor = await startApp();
    actor.send({ type: "SELECT_SLOT", slot: 3 });
    expect(actor.getSnapshot().context.selectedSlot).toBe(3);
  });

  it("REQUEST_CLEAR_SLOT moves to confirmingClear; CANCEL_CLEAR_SLOT returns", async () => {
    const actor = await startApp();
    actor.send({ type: "REQUEST_CLEAR_SLOT", slot: 2 });
    expect(actor.getSnapshot().matches({ menu: "confirmingClear" })).toBe(
      true
    );
    expect(actor.getSnapshot().context.pendingClearSlot).toBe(2);
    actor.send({ type: "CANCEL_CLEAR_SLOT" });
    expect(actor.getSnapshot().matches({ menu: "slotList" })).toBe(true);
    expect(actor.getSnapshot().context.pendingClearSlot).toBeUndefined();
  });
});

describe("appMachine — load flow", () => {
  it("LOAD_SLOT loads the snapshot and reaches `playing`", async () => {
    const ctx = createDefaultGameContext();
    ctx.turn.season = 9;
    const tmp = createActor(gameMachine, { input: ctx });
    tmp.start();
    const persisted = tmp.getPersistedSnapshot();
    tmp.stop();

    await saveSlot(4, persisted, {
      managerCount: 0,
      year: 2007,
      managers: [],
      savedAt: 0
    });

    const actor = await startApp();
    actor.send({ type: "LOAD_SLOT", slot: 4 });
    await waitFor(actor, (snap) => snap.matches("playing"));
    const snap = actor.getSnapshot();
    expect(snap.context.gameRef).toBeDefined();
    expect(snap.context.gameRef!.getSnapshot().context.turn.season).toBe(9);
  });
});

describe("appMachine — new game flow", () => {
  it("START_NEW_GAME spawns the wizard child; wizard completion lands in `playing`", async () => {
    const actor = await startApp();
    actor.send({ type: "START_NEW_GAME", slot: 1 });
    expect(actor.getSnapshot().matches("creatingGame")).toBe(true);

    const wizard = actor.getSnapshot().children.newGame as ReturnType<
      typeof createActor<typeof newGameMachine>
    >;
    expect(wizard).toBeDefined();
    wizard.send({ type: "SET_MANAGER_COUNT", count: 1 });
    driveWizardThroughOneManager(wizard);
    // askMore auto-skips for single-manager runs (no event needed),
    // peckingOrder auto-resolves and we hit `done`.

    await waitFor(actor, (snap) => snap.matches("playing"));
    const snap = actor.getSnapshot();
    const gameCtx = snap.context.gameRef!.getSnapshot().context;
    const activeId = gameCtx.human.active!;
    expect(gameCtx.managers[activeId].name).toBe("Pier Paolo Pasolini");
    expect(gameCtx.teams[0].manager).toBe(activeId);
  });

  it("custom-team override renames the displaced team", async () => {
    const actor = await startApp();
    actor.send({ type: "START_NEW_GAME", slot: 1 });
    const wizard = actor.getSnapshot().children.newGame as ReturnType<
      typeof createActor<typeof newGameMachine>
    >;
    wizard.send({ type: "SET_MANAGER_COUNT", count: 1 });
    wizard.send({ type: "SET_NAME", name: "Tester" });
    wizard.send({ type: "SET_NATIONALITY", nationality: "FI" });
    wizard.send({ type: "SET_EXPERIENCE", experience: "legend" });
    wizard.send({ type: "SET_DIFFICULTY", difficulty: 3 });
    wizard.send({
      type: "SET_TEAM",
      team: 0,
      customTeam: {
        name: "PASOLINIT",
        city: "Hirvikoski",
        arena: "Pasolinin Halli"
      }
    });
    wizard.send({ type: "SET_ATTRIBUTES", attributes: ZERO_ATTRS });

    await waitFor(actor, (snap) => snap.matches("playing"));
    const gameCtx = actor.getSnapshot().context.gameRef!.getSnapshot().context;
    expect(gameCtx.teams[0].name).toBe("PASOLINIT");
    expect(gameCtx.teams[0].city).toBe("Hirvikoski");
    expect(gameCtx.teams[0].arena.name).toBe("Pasolinin Halli");
  });

  it("QUIT from creatingGame returns to menu", async () => {
    const actor = await startApp();
    actor.send({ type: "START_NEW_GAME", slot: 1 });
    expect(actor.getSnapshot().matches("creatingGame")).toBe(true);
    actor.send({ type: "QUIT" });
    await waitFor(actor, (snap) => snap.matches({ menu: "slotList" }));
  });
});

describe("appMachine — quit flow", () => {
  it("QUIT from playing returns to menu and drops gameRef", async () => {
    const actor = await startApp();
    actor.send({ type: "START_NEW_GAME", slot: 1 });
    const wizard = actor.getSnapshot().children.newGame as ReturnType<
      typeof createActor<typeof newGameMachine>
    >;
    wizard.send({ type: "SET_MANAGER_COUNT", count: 1 });
    driveWizardThroughOneManager(wizard);
    await waitFor(actor, (snap) => snap.matches("playing"));

    actor.send({ type: "QUIT" });
    await waitFor(actor, (snap) => snap.matches({ menu: "slotList" }));
    expect(actor.getSnapshot().context.gameRef).toBeUndefined();
  });
});
