import { createSendMail } from "@/services/mail";
import type { GameContext } from "@/state";
import type { MailRecipient } from "@/state/mail";
import type { Draft } from "immer";

/**
 * Answer an RSVP mail: create a reply mail from the manager back
 * to the original sender carrying the chosen answer key, then
 * remove the original RSVP from the manager's mailbox.
 *
 * The reply is just a regular mail — no immediate side effects.
 * The mail handler that sent the original RSVP picks up the reply
 * on its next pass and decides what it means.
 *
 * Returns true if the mail was found and replied to, false otherwise.
 */
export const replyToMail = (
  draft: Draft<GameContext>,
  managerId: string,
  mailId: string,
  answerKey: string
): boolean => {
  const manager = draft.managers[managerId];
  if (!manager) {
    return false;
  }

  const mailIdx = manager.mailbox.findIndex((m) => m.id === mailId);
  if (mailIdx === -1) {
    return false;
  }

  const mail = manager.mailbox[mailIdx];
  if (mail.kind !== "rsvp") {
    return false;
  }

  const chosenOption = mail.answerOptions.find((o) => o.key === answerKey);

  const from: MailRecipient = { kind: "manager", recipient: managerId };

  const { sendMail } = createSendMail(draft);
  sendMail(
    {
      kind: "regular",
      from,
      subject: `Re: ${mail.subject}`,
      body: [chosenOption?.label ?? answerKey],
      data: { answerKey, inReplyTo: mail.id }
    },
    mail.from
  );

  // Mark the original RSVP as replied (keep it in the mailbox).
  manager.mailbox[mailIdx].replied = true;

  return true;
};
