import { replyToMail } from "@/game/mail-reply";
import type { GameContext } from "@/state/game-context";
import type { RsvpMail } from "@/state/mail";
import type { Draft } from "immer";
import { values } from "remeda";

/**
 * AI manager turn processing. Runs once per action round, after
 * the human player has finished their turn.
 *
 * Current behaviors:
 * - Auto-answer all RSVP mails (always accepts — picks the first
 *   answer option). Uses the same `replyToMail` path as human
 *   answers, so side effects (tournament registration, etc.) are
 *   identical.
 *
 * Future behaviors (as MHM 2000 port progresses):
 * - Strategy selection, player transfers, prank ordering, etc.
 */
export const runAiAction = (draft: Draft<GameContext>) => {
  for (const manager of values(draft.managers)) {
    if (manager.kind !== "ai") {
      continue;
    }

    answerRsvpMails(draft, manager.id);
  }
};

/**
 * Walk the manager's mailbox, auto-answer every RSVP mail by
 * picking the first answer option. Uses `replyToMail` so the
 * same reply handlers fire for AI and human answers.
 */
const answerRsvpMails = (draft: Draft<GameContext>, managerId: string) => {
  const manager = draft.managers[managerId];
  if (!manager) {
    return;
  }

  // Snapshot the ids — replyToMail mutates the mailbox.
  const rsvpMails = values(manager.mailbox)
    .filter((m): m is Draft<RsvpMail> => m.kind === "rsvp" && !m.replied)
    .map((m) => ({ id: m.id, answerKey: m.answerOptions[0]?.key }));

  for (const { id, answerKey } of rsvpMails) {
    if (!answerKey) {
      continue;
    }
    replyToMail(draft, managerId, id, answerKey);
  }
};
