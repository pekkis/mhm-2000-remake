import type { MailHandler } from "@/game/mail-handlers";
import { currentCalendarEntry, humanManagers } from "@/machines/selectors";
import { createSendMail } from "@/services/mail";
import type { MailTemplate } from "@/state/mail";
import tournamentList from "@/data/tournaments";
import { values } from "remeda";

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

  // --- Process replies: record acceptances, clean up ---
  if (c.tags.includes("mailbox:tournaments:process")) {
    // todo: the new invitations process here
  }
};
