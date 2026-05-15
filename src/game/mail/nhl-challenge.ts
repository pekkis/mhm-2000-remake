import type { TournamentsCompetitionMeta } from "@/data/competitions/tournaments";
import type { MailHandler } from "@/game/mail-handlers";
import {
  currentCalendarEntry,
  domesticTeamsByPreviousSeasonsRanking,
  managersTeam,
  managersTeamId,
  teamsManager
} from "@/machines/selectors";
import { createSendMail } from "@/services/mail";
import random from "@/services/random";
import type { MailTemplate } from "@/state/mail";
import { omitBy, values } from "remeda";

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

    // Filter accepting managers.
    const acceptors = replies.filter((reply) => {
      if (reply.from.kind !== "manager") {
        return false;
      }
      const { answerKey } = (reply.data ?? {}) as { answerKey?: string };
      return answerKey === "k";
    });

    // Lottery: rank gives (7 - rank) * 10 balls, charisma gives charisma * 3.
    const rankedTeamIds = domesticTeamsByPreviousSeasonsRanking(
      1,
      6
    )(ctx).map((t) => t.id);

    const ballots = acceptors.map((reply) => {
      const managerId =
        reply.from.kind === "manager" ? reply.from.recipient : "";
      const teamId = managersTeamId(managerId)(ctx);
      const rank = rankedTeamIds.indexOf(teamId) + 1; // 1-6
      const charisma = ctx.managers[managerId].attributes.charisma;
      const rankBalls = Math.round(60 * 0.6 ** (rank - 1));
      const balls = Math.max(1, rankBalls + charisma * 3);
      return { managerId, reply, balls };
    });

    const totalBalls = ballots.reduce((sum, b) => sum + b.balls, 0);

    // Pick the winner (if anyone accepted).
    let winnerId: string | undefined;
    if (totalBalls > 0) {
      let roll = random.integer(1, totalBalls);
      for (const ballot of ballots) {
        roll -= ballot.balls;
        if (roll <= 0) {
          winnerId = ballot.managerId;
          break;
        }
      }
    }

    // Notify everyone.
    for (const { managerId } of ballots) {
      if (managerId === winnerId) {
        sendMail(
          {
            kind: "regular",
            from,
            subject: "NHL Challenge — tervetuloa turnaukseen!",
            body: [
              "Onnittelut! Joukkueenne on valittu mukaan tämän kauden NHL Challenge -turnaukseen. Nähdään jäällä!"
            ]
          },
          { kind: "manager", recipient: managerId }
        );

        const meta = ctx.competitions.tournaments
          .meta as TournamentsCompetitionMeta;

        const team = managersTeam(managerId)(ctx);

        meta.acceptedTeams.push({
          teamId: team.id,
          tournamentId: "nhl-challenge"
        });
      } else {
        sendMail(
          {
            kind: "regular",
            from,
            subject: "NHL Challenge — ilmoittautuminen hylätty",
            body: [
              "Valitettavasti joukkueenne ei mahtunut mukaan tämän kauden NHL Challenge -turnaukseen. Toivomme parempaa onnea ensi kaudella!"
            ]
          },
          { kind: "manager", recipient: managerId }
        );
      }
    }

    // Remove processed replies from the global mailbox.
    ctx.mail.mailbox = omitBy(
      ctx.mail.mailbox,
      (m) =>
        m.to.kind === "external" && m.to.recipientId === NHL_CHALLENGE_SENDER_ID
    );
  }
};
