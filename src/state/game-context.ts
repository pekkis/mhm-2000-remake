/**
 * `GameContext` — the canonical shape of the game's full state.
 *
 * Lives in `@/state` so it can be consumed equally by the XState machines
 * (where it is `gameMachine.context`) and any remaining Redux/legacy code
 * during the transition.
 */

import type { GameState } from "./game";
import type { ManagerState } from "./manager";
import type { EventState } from "./event";
import type { InvitationState } from "./invitation";
import type { NewsState } from "./news";
import type { NotificationState } from "./notification";
import type { StatsState } from "./stats";
import type { CountryState } from "./country";
import type { PrankState } from "./prank";
import type { BettingState } from "./betting";

export type GameContext = GameState & {
  manager: ManagerState;
  event: EventState;
  news: NewsState;
  notification: NotificationState;
  prank: PrankState;
  stats: StatsState;
  invitation: InvitationState;
  country: CountryState;
  betting: BettingState;
};
