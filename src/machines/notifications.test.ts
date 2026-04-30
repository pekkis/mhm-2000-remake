import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createActor } from "xstate";
import { notificationsMachine } from "@/machines/notifications";
import type { NotificationData } from "@/machines/notification";

const make = (id: string, message = `msg-${id}`): NotificationData => ({
  id,
  manager: "pasolini",
  message,
  type: "info"
});

const createTestActor = () => {
  const actor = createActor(notificationsMachine, {
    input: { defaultTimeout: 7000 }
  });
  actor.start();
  return actor;
};

const ids = (actor: ReturnType<typeof createTestActor>): string[] =>
  actor
    .getSnapshot()
    .context.notifications.map((r) => r.getSnapshot().context.id);

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("notificationsMachine", () => {
  describe("initial state", () => {
    it("starts with no notifications", () => {
      expect(createTestActor().getSnapshot().context.notifications).toEqual([]);
    });
  });

  describe("PUSH", () => {
    it("spawns a notification actor", () => {
      const actor = createTestActor();
      actor.send({ type: "PUSH", notification: make("a") });
      expect(ids(actor)).toEqual(["a"]);
    });

    it("spawned actors start in active state", () => {
      const actor = createTestActor();
      actor.send({ type: "PUSH", notification: make("a") });
      const ref = actor.getSnapshot().context.notifications[0];
      expect(ref.getSnapshot().value).toBe("active");
    });

    it("appends in push order", () => {
      const actor = createTestActor();
      actor.send({ type: "PUSH", notification: make("a") });
      actor.send({ type: "PUSH", notification: make("b") });
      actor.send({ type: "PUSH", notification: make("c") });
      expect(ids(actor)).toEqual(["a", "b", "c"]);
    });

    it("caps at 3 — fourth push drops oldest", () => {
      const actor = createTestActor();
      actor.send({ type: "PUSH", notification: make("a") });
      actor.send({ type: "PUSH", notification: make("b") });
      actor.send({ type: "PUSH", notification: make("c") });
      actor.send({ type: "PUSH", notification: make("d") });
      expect(ids(actor)).toEqual(["b", "c", "d"]);
    });
  });

  describe("auto-dismiss", () => {
    it("removes a notification ~7s after PUSH", () => {
      const actor = createTestActor();
      actor.send({ type: "PUSH", notification: make("a") });

      vi.advanceTimersByTime(6999);
      expect(ids(actor)).toEqual(["a"]);

      vi.advanceTimersByTime(2);
      expect(ids(actor)).toEqual([]);
    });

    it("each notification dismisses on its own clock", () => {
      const actor = createTestActor();
      actor.send({ type: "PUSH", notification: make("a") });

      vi.advanceTimersByTime(3000);
      actor.send({ type: "PUSH", notification: make("b") });

      // a expires first (at 7000 from start, b lives until 10000)
      vi.advanceTimersByTime(4001);
      expect(ids(actor)).toEqual(["b"]);

      vi.advanceTimersByTime(3000);
      expect(ids(actor)).toEqual([]);
    });
  });

  describe("DISMISS", () => {
    it("removes a specific notification before its timer fires", () => {
      const actor = createTestActor();
      actor.send({ type: "PUSH", notification: make("a") });
      actor.send({ type: "PUSH", notification: make("b") });

      actor.send({ type: "DISMISS", id: "a" });
      expect(ids(actor)).toEqual(["b"]);
    });

    it("untouched notifications still expire on schedule", () => {
      const actor = createTestActor();
      actor.send({ type: "PUSH", notification: make("a") });
      actor.send({ type: "PUSH", notification: make("b") });
      actor.send({ type: "DISMISS", id: "a" });

      vi.advanceTimersByTime(7001);
      expect(ids(actor)).toEqual([]);
    });
  });

  describe("overflow eviction", () => {
    it("dropped oldest is fully removed", () => {
      const actor = createTestActor();
      actor.send({ type: "PUSH", notification: make("a") });
      actor.send({ type: "PUSH", notification: make("b") });
      actor.send({ type: "PUSH", notification: make("c") });
      actor.send({ type: "PUSH", notification: make("d") });

      // The DISMISS sent to "a" makes it expire and emit REMOVE.
      // Both happen synchronously within the spawn assign, so by now
      // there should be exactly 3 — without "a".
      expect(ids(actor)).toEqual(["b", "c", "d"]);
    });
  });
});
