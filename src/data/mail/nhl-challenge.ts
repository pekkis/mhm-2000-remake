import type { MailHandler } from "@/game/mail-handlers";
import {
  currentCalendarEntry,
  domesticTeamsByPreviousSeasonsRanking,
  teamsManager
} from "@/machines/selectors";
import { createSendMail } from "@/services/mail";
import type { MailTemplate } from "@/state/mail";
import { entries, values } from "remeda";

export const NHL_CHALLENGE_SENDER_ID = "tournament:nhl_challenge";

export const nhlChallengeMailHandler: MailHandler = (ctx) => {
  const c = currentCalendarEntry(ctx);

  // --- Send invitations on the tagged round ---
  if (c.tags.includes("mailbox:nhl-challenge:send")) {
    const { sendMail, expiresInRounds } = createSendMail(ctx);

    const tpl: MailTemplate = {
      from: {
        kind: "external",
        recipientId: NHL_CHALLENGE_SENDER_ID,
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

  // --- Process replies: decide who gets in, notify everyone ---
  if (c.tags.includes("mailbox:nhl-challenge:process")) {
    const { sendMail } = createSendMail(ctx);

    const from = {
      kind: "external" as const,
      recipientId: NHL_CHALLENGE_SENDER_ID,
      recipientName: "NHL Challenge"
    };

    // Collect all replies addressed to us.
    const replies = values(ctx.mail.mailbox).filter(
      (m) =>
        m.to.kind === "external" && m.to.recipientId === NHL_CHALLENGE_SENDER_ID
    );

    // TODO: select accepted teams (for now, reject everyone).
    for (const reply of replies) {
      if (reply.from.kind !== "manager") {
        continue;
      }

      const { answerKey } = (reply.data ?? {}) as { answerKey?: string };

      if (answerKey === "k") {
        // Manager wanted in — send rejection.
        sendMail(
          {
            kind: "regular",
            from,
            subject: "NHL Challenge — ilmoittautuminen hylätty",
            body: [
              "Valitettavasti joukkueenne ei mahtunut mukaan tämän kauden NHL Challenge -turnaukseen. Toivomme parempaa onnea ensi kaudella!"
            ]
          },
          reply.from
        );
      }
    }

    // Remove processed replies from the global mailbox.
    for (const [id, m] of entries(ctx.mail.mailbox)) {
      if (
        m.to.kind === "external" &&
        m.to.recipientId === NHL_CHALLENGE_SENDER_ID
      ) {
        delete ctx.mail.mailbox[id];
      }
    }
  }
};
