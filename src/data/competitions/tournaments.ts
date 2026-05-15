// import type { Team } from "@/state/game";
import type {
  Competition,
  CompetitionDefinition
  // TeamStat,
  // TournamentGroup
} from "@/types/competitions";
// import tournamentScheduler from "@/services/tournament";
// import { currency } from "@/services/format";
// import type { Manager } from "@/state/game";
// import { foreignTeams } from "@/machines/selectors";
import type { GameContext } from "@/state/game-context";
// import tournamentList from "@/data/tournaments";
// import random from "@/services/random";

// e.g. in the tournaments competition file or wherever the meta shape lives
export type TournamentsCompetitionMeta = {
  acceptedTeams: {
    tournamentId: string;
    teamId: number;
  }[];
};

const tournaments: CompetitionDefinition = {
  data: {
    weight: 2000,
    id: "tournaments",
    phase: -1,
    name: "Joulutauon turnaukset",
    abbr: "tournaments",
    phases: [],
    teams: []
  },

  seasonStart: (context) => {
    console.log("SETTING META");
    context.competitions.tournaments.meta = {
      acceptedTeams: []
    } satisfies TournamentsCompetitionMeta;
  },

  relegateTo: false,
  promoteTo: false,

  homeAndAwayTeamAdvantages: () => {
    return {
      home: 1.0,
      away: 1.0
    };
  },

  seed: [
    (_competitions: Record<string, Competition>, _context: GameContext) => {
      // const { teams, invitations, managers } = context;

      return {
        name: "jouluturnaukset",
        type: "tournament" as const,
        teams: [],
        groups: []
      };

      // Build invited teams grouped by tournament index

      /*
      const invited: Map<number, number[]> = new Map();
      for (const inv of invitations) {
        const tournamentIdx = inv.tournament as number;
        const teamId = managers[inv.manager]?.team as number;
        if (!invited.has(tournamentIdx)) {
          invited.set(tournamentIdx, []);
        }
        invited.get(tournamentIdx)!.push(teamId);
      }

      let remainingTeams = [...teams];
      const groups: TournamentGroup[] = [];
      const allParticipantIds: number[] = [];

      for (const [tournamentIndex, tournament] of tournamentList.entries()) {
        const invitedTeamIds = invited.get(tournamentIndex) ?? [];

        const eligible = remainingTeams
          .filter(tournament.filter)
          .sort(() => random.real(1, 1000) - 500)
          .slice(0, 6 - invitedTeamIds.length)
          .map((t) => t.id);

        const participants = [...invitedTeamIds, ...eligible];

        groups.push({
          type: "tournament",
          penalties: [],
          colors: ["d", "l", "l", "l", "l", "l"],
          teams: participants,
          round: 0,
          name: tournament.name,
          schedule: tournamentScheduler(participants),
          stats: []
        });

        allParticipantIds.push(...participants);
        remainingTeams = remainingTeams.filter(
          (t) => !participants.includes(t.id)
        );
      }

      return {
        name: "jouluturnaukset",
        type: "tournament" as const,
        teams: allParticipantIds,
        groups
      };
      */
    }
  ],

  groupEnd: (_draft, { groupIdx, group }) => {
    if (group.type !== "tournament") {
      console.log(groupIdx);
      return;
    }

    /*
    const stats = group.stats as TeamStat[];
    const award = tournamentList[groupIdx].award;
    for (const stat of stats) {
      const team = draft.teams[stat.id];
      if (!team.domestic) {
        continue;
      }
      team.readiness -= 2;
      if (team.manager === undefined) {
        continue;
      }
      const m = draft.managers[team.manager];

      if (!m) {
        continue;
      }

      if (m.kind === "ai") {
        continue;
      }

      m.balance += award;
      if (!draft.news.announcements[m.id]) {
        draft.news.announcements[m.id] = [];
      }
      draft.news.announcements[m.id].push(
        `Tilillenne on siirretty __${currency(award)}__ rahaa. Viiteviesti: joulutauon turnaus, osallistumismaksu, _${group.name}_.`
      );
    }
      */
  }
};

export default tournaments;
