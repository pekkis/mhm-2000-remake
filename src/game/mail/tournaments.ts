import type { TournamentsCompetitionMeta } from "@/data/competitions/tournaments";
import type { MailHandler } from "@/game/mail-handlers";
import {
  currentCalendarEntry,
  humanManagers,
  managersTeam
} from "@/machines/selectors";
import { createSendMail } from "@/services/mail";
import random from "@/services/random";
import type { MailTemplate } from "@/state/mail";
import tournamentList, { type CandidatePool } from "@/data/tournaments";
import { omitBy, values } from "remeda";
import { NHL_CHALLENGE_SENDER_ID } from "./nhl-challenge";

export const TOURNAMENT_SENDER_PREFIX = "tournament:";

const senderIdFor = (tournamentId: string) =>
  `${TOURNAMENT_SENDER_PREFIX}${tournamentId}`;

/** Pick a candidate pool by weighted random (QB: percentage-threshold branching). */
const pickPoolByWeight = (
  pools: CandidatePool[],
  totalWeight: number
): CandidatePool => {
  let roll = random.integer(1, totalWeight);
  for (const pool of pools) {
    roll -= pool.weight;
    if (roll <= 0) {
      return pool;
    }
  }
  return pools[pools.length - 1];
};

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
          { expires: expiresInRounds(3) }
        );
      }
    }
  }

  // --- Process replies: assign each human to the worst accepted tournament ---
  if (c.tags.includes("mailbox:tournaments:process")) {
    console.log("HIP HEI HAA HOO");

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
    // Pre-claim any manager whose team is already in the NHL Challenge.
    const nhlChallengeTeamIds = new Set(
      meta.acceptedTeams
        .filter((a) => a.tournamentId === "nhl-challenge")
        .map((a) => a.teamId)
    );

    const claimedManagers = new Set<string>();
    for (const mgr of values(humanManagers(ctx))) {
      if (nhlChallengeTeamIds.has(mgr.team!)) {
        claimedManagers.add(mgr.id);
      }
    }

    const { sendMail } = createSendMail(ctx);

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

        // Notify the manager which tournament they ended up in.
        sendMail(
          {
            kind: "regular",
            from: {
              kind: "external",
              recipientId: senderIdFor(tournament.id),
              recipientName: tournament.name
            },
            subject: `${tournament.name} — tervetuloa turnaukseen!`,
            body: [
              `Joukkueenne on hyväksytty mukaan turnaukseen **${tournament.name}**. Turnaus pelataan joulutauolla. Onnea peleihin!`
            ]
          },
          { kind: "manager", recipient: managerId }
        );
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

    // --- Fill remaining seats with AI teams ---
    // QB: turnax(1..86) bitmap prevents cross-tournament duplicates.
    // We track the same with a Set<number> of already-seated team ids.
    const seatedTeams = new Set<number>(
      meta.acceptedTeams.map((a) => a.teamId)
    );

    const SEATS_PER_TOURNAMENT = 6;
    const MAX_FILL_ATTEMPTS = 200;

    for (const tournament of sortedTournaments) {
      const humanSeats = meta.acceptedTeams.filter(
        (a) => a.tournamentId === tournament.id
      ).length;

      const pools = tournament.candidatePools(ctx.teams);
      const totalWeight = pools.reduce((sum, p) => sum + p.weight, 0);

      if (totalWeight === 0) {
        continue;
      }

      let seatsToFill = SEATS_PER_TOURNAMENT - humanSeats;
      let attempts = 0;

      while (seatsToFill > 0 && attempts < MAX_FILL_ATTEMPTS) {
        attempts++;

        // Pick a pool by weighted random roll.
        const pool = pickPoolByWeight(pools, totalWeight);
        if (pool.teams.length === 0) {
          continue;
        }

        // Pick a random team from the pool.
        const teamId = pool.teams[random.integer(0, pool.teams.length - 1)];

        // Reject if already seated in any tournament this Christmas.
        if (seatedTeams.has(teamId)) {
          continue;
        }

        meta.acceptedTeams.push({
          tournamentId: tournament.id,
          teamId
        });
        seatedTeams.add(teamId);
        seatsToFill--;
      }
    }
  }
};
