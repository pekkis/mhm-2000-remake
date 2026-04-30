import type { BaseEventFields } from "@/types/base";

export type StoredEvent = BaseEventFields & Record<string, unknown>;

export type EventState = {
  events: Record<string, StoredEvent>;
};
