export type MHMEventType = "manager";

export type MHMEventGenerator = Generator<unknown, void, unknown>;

/**
 * Base fields present on all stored event data.
 * `id` is injected by the event reducer on EVENT_ADD.
 */
export type BaseEventFields = {
  id: string;
  eventId: string;
  manager: string;
  resolved: boolean;
  processed?: boolean;
};

export type BaseEventCreationFields = { manager: string };

/**
 * A game event definition, generic over its event-specific data shape.
 *
 * TData carries the full stored shape (BaseEventFields + event-specific fields).
 * During the migration, JS event files use the unparameterized default and remain untyped.
 * Newly converted TS event files specify their TData for full type safety.
 */
export type MHMEvent<
  TData extends BaseEventFields = BaseEventFields,
  CData extends BaseEventCreationFields = BaseEventCreationFields
> = {
  type: MHMEventType;
  create: (data: CData) => MHMEventGenerator;
  render: (data: TData) => string[];
  process: (data: TData) => MHMEventGenerator;
  options?: (data: TData) => Record<string, string>;
  resolve?: (data: TData, value: string) => MHMEventGenerator;
};
