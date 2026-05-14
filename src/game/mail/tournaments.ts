import type { MailHandler } from "@/game/mail-handlers";
import { currentCalendarEntry } from "@/machines/selectors";

export const tournamentsMailHandler: MailHandler = (ctx) => {
  const c = currentCalendarEntry(ctx);
  if (c.tags.includes("mailbox:tournaments:send")) {
    // implement tournament mail sending here
  }
};
