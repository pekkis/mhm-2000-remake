// import type { Team } from "@/state/game";
import type {
  Competition,
  CompetitionDefinition,
  TournamentGroup
} from "@/types/competitions";
import tournamentScheduler from "@/services/tournament";
// import { currency } from "@/services/format";
// import type { Manager } from "@/state/game";
// import { foreignTeams } from "@/machines/selectors";
import type { GameContext } from "@/state/game-context";
import tournamentList from "@/data/tournaments";
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
    (_competitions: Record<string, Competition>, context: GameContext) => {
      const meta = context.competitions.tournaments
        .meta as TournamentsCompetitionMeta;

      // Build one TournamentGroup per tournament that has participants.
      // Iterate by seedOrder ascending (worst first) to match QB's
      // tier 10→1 iteration in SUB joulutauko.
      const groups: TournamentGroup[] = tournamentList
        .toSorted((a, b) => a.seedOrder - b.seedOrder)
        .flatMap((tournament) => {
          const teams = meta.acceptedTeams
            .filter((a) => a.tournamentId === tournament.id)
            .map((a) => a.teamId);

          console.log("TEAMS", { tournament, teams });

          if (teams.length === 0) {
            return [];
          }

          return [
            {
              type: "tournament" as const,
              round: 0,
              name: tournament.name,
              teams,
              schedule: tournamentScheduler(teams),
              stats: [],
              penalties: [],
              colors: []
            }
          ];
        });

      const allTeams = groups.flatMap((g) => g.teams);

      return {
        name: "jouluturnaukset",
        type: "tournament" as const,
        teams: allTeams,
        groups
      };
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
