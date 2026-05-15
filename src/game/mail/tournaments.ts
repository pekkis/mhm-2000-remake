import type { TournamentsCompetitionMeta } from "@/data/competitions/tournaments";
import type { MailHandler } from "@/game/mail-handlers";
import {
  currentCalendarEntry,
  humanManagers,
  managersTeam
} from "@/machines/selectors";
import { createSendMail } from "@/services/mail";
import type { MailTemplate } from "@/state/mail";
import tournamentList from "@/data/tournaments";
import { omitBy, values } from "remeda";
import { NHL_CHALLENGE_SENDER_ID } from "./nhl-challenge";

export const TOURNAMENT_SENDER_PREFIX = "tournament:";

const senderIdFor = (tournamentId: string) =>
  `${TOURNAMENT_SENDER_PREFIX}${tournamentId}`;

export const tournamentsMailHandler: MailHandler = (ctx) => {
  const c = currentCalendarEntry(ctx);

  // --- Send invitations on the tagged round ---
  if (c.tags.includes("mailbox:tournaments:send")) {
    const { sendMail, expiresInRounds } = createSendMail(ctx);

    // NHL Challenge has its own handler — skip it here.
    const eligibleTournaments = tournamentList.filter(
      (t) => t.id !== "nhl-challenge"
    );

    for (const mgr of values(humanManagers(ctx))) {
      const team = ctx.teams[mgr.team!];
      const ranking = team.previousRankings?.[0] ?? 99;

      for (const tournament of eligibleTournaments) {
        if (ranking > tournament.maxPreviousRanking) {
          continue;
        }

        const tpl: MailTemplate = {
          from: {
            kind: "external",
            recipientId: senderIdFor(tournament.id),
            recipientName: tournament.name
          },
          subject: `Kutsu: ${tournament.name}`,
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
            `Hyvä manageri {recipient},\n\nJoukkueenne on kutsuttu mukaan turnaukseen **${tournament.name}**. Turnaus pelataan jouluisen tauon aikana kuuden joukkueen lohkoturnauksena. Palkintopotit ovat houkuttelevat!\n\nVastatkaa kutsuun mahdollisimman pian.`
          ]
        };

        sendMail(
          tpl,
          { kind: "manager", recipient: mgr.id },
          { expires: expiresInRounds(5) }
        );
      }
    }
  }

  // --- Process replies: assign each human to the worst accepted tournament ---
  if (c.tags.includes("mailbox:tournaments:process")) {
    const meta = ctx.competitions.tournaments
      .meta as TournamentsCompetitionMeta;

    // Sort non-NHL tournaments by seedOrder ascending (worst first).
    const sortedTournaments = tournamentList
      .filter((t) => t.id !== "nhl-challenge")
      .toSorted((a, b) => a.seedOrder - b.seedOrder);

    // Collect all tournament replies from the global mailbox.
    const allReplies = values(ctx.mail.mailbox).filter(
      (m) =>
        m.to.kind === "external" &&
        m.to.recipientId.startsWith(TOURNAMENT_SENDER_PREFIX) &&
        m.to.recipientId !== NHL_CHALLENGE_SENDER_ID
    );

    // Build a map: managerId → set of tournament ids they accepted.
    const acceptedByManager = new Map<string, Set<string>>();
    for (const reply of allReplies) {
      if (reply.from.kind !== "manager") {
        continue;
      }
      const { answerKey } = (reply.data ?? {}) as { answerKey?: string };
      if (answerKey !== "k") {
        continue;
      }
      const tournamentId =
        reply.to.kind === "external"
          ? reply.to.recipientId.slice(TOURNAMENT_SENDER_PREFIX.length)
          : undefined;
      if (!tournamentId) {
        continue;
      }
      const set = acceptedByManager.get(reply.from.recipient) ?? new Set();
      set.add(tournamentId);
      acceptedByManager.set(reply.from.recipient, set);
    }

    // Worst-first assignment: iterate sorted tournaments, claim unclaimed managers.
    const claimedManagers = new Set<string>();

    for (const tournament of sortedTournaments) {
      for (const [managerId, acceptedTournaments] of acceptedByManager) {
        if (claimedManagers.has(managerId)) {
          continue;
        }
        if (!acceptedTournaments.has(tournament.id)) {
          continue;
        }

        const team = managersTeam(managerId)(ctx);
        meta.acceptedTeams.push({
          tournamentId: tournament.id,
          teamId: team.id
        });
        claimedManagers.add(managerId);
      }
    }

    // Clean up: remove tournament reply mails from the global mailbox.
    ctx.mail.mailbox = omitBy(
      ctx.mail.mailbox,
      (m) =>
        m.to.kind === "external" &&
        m.to.recipientId.startsWith(TOURNAMENT_SENDER_PREFIX) &&
        m.to.recipientId !== NHL_CHALLENGE_SENDER_ID
    );

    // Clean up: remove the original RSVP invitations from manager mailboxes.
    for (const mgr of values(humanManagers(ctx))) {
      ctx.managers[mgr.id].mailbox = omitBy(
        ctx.managers[mgr.id].mailbox,
        (m) =>
          m.from.kind === "external" &&
          m.from.recipientId.startsWith(TOURNAMENT_SENDER_PREFIX) &&
          m.from.recipientId !== NHL_CHALLENGE_SENDER_ID
      );
    }

    const teams = ctx.teams.filter((t) => t.kind === "ai");

    // computer team randomization here
  }
};
