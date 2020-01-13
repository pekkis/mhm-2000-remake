export { default as game } from "./game";
export { default as manager } from "./manager";
export { default as event } from "./event";
export { default as meta } from "./meta";
export { default as news } from "./news";
export { default as ui } from "./ui";
export { default as notification } from "./notification";
export { default as prank } from "./prank";
export { default as betting } from "./betting";
export { default as stats } from "./stats";
export { default as invitation } from "./invitation";
export { default as country } from "./country";

import { BettingState } from "./betting";
import { NotificationState } from "./notification";
import { CountryState } from "./country";
import { GameState } from "./game";
import { ManagerState } from "./manager";
import { InvitationState } from "./invitation";
import { NewsState } from "./news";
import { PrankState } from "./prank";
import { UIState } from "./ui";
import { EventState } from "./event";
import { MetaState } from "./meta";
import { StatsState } from "./stats";

export interface MHMState {
  meta: MetaState;
  betting: BettingState;
  notification: NotificationState;
  country: CountryState;
  game: GameState;
  manager: ManagerState;
  invitation: InvitationState;
  news: NewsState;
  prank: PrankState;
  ui: UIState;
  event: EventState;
  stats: StatsState;
}
