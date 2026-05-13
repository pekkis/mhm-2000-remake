import type { MailHandler } from "@/game/mail-handlers";
import {
  currentCalendarEntry,
  domesticTeamsByPreviousSeasonsRanking,
  teamsManager
} from "@/machines/selectors";
import { createSendMail } from "@/services/mail";
import type { MailTemplate } from "@/state/mail";

export const NHL_CHALLENGE_SENDER_ID = "tournament:nhl_challenge";

export const nhlChallengeMailHandler: MailHandler = (ctx) => {
  const c = currentCalendarEntry(ctx);

  // --- Send invitations on the tagged round ---
  if (c.tags.includes("mailbox:send-nhl-challenge")) {
    console.log("HANDLING NHL");

    const { sendMail, expiresInRounds } = createSendMail(ctx);

    const tpl: MailTemplate = {
      from: {
        kind: "external",
        recipientId: "tournament:nhl_challenge",
        recipientName: "NHL Challenge"
      },
      subject: "Kutsu NHL Challenge-turnaukseen",
      kind: "rsvp",
      answerOptions: [
        {
          key: "k",
          label: "Kyllä, haluamme osallistua turnaukseen."
        },
        {
          key: "e",
          label: "Ei, emme halua tällä kertaa osallistua."
        }
      ],
      body: [
        `
**Lorem ipsum**, dolor sit amet {recipient}
            `
      ]
    };

    const teams = domesticTeamsByPreviousSeasonsRanking(1, 6)(ctx);

    teams.forEach((team) => {
      const manager = teamsManager(team.id)(ctx);

      sendMail(
        tpl,
        { kind: "manager", recipient: manager.id },
        {
          expires: expiresInRounds(3)
        }
      );
    });
  }

  // --- Process replies from the global mailbox ---
  const replies = ctx.mail.mailbox.filter(
    (m) =>
      m.to.kind === "external" &&
      m.to.recipientId === NHL_CHALLENGE_SENDER_ID
  );

  for (const reply of replies) {
    const { answerKey } = (reply.data ?? {}) as { answerKey?: string };
    if (answerKey === "k" && reply.from.kind === "manager") {
      const manager = ctx.managers[reply.from.recipient];
      if (manager?.team !== undefined) {
        ctx.competitions.tournaments.teams.push(manager.team);
      }
    }
  }

  // Remove processed replies.
  ctx.mail.mailbox = ctx.mail.mailbox.filter(
    (m) =>
      !(
        m.to.kind === "external" &&
        m.to.recipientId === NHL_CHALLENGE_SENDER_ID
      )
  );
};
