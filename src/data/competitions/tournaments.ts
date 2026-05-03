import type { Team } from "@/state/game";
import type {
  Competition,
  CompetitionDefinition,
  TeamStat,
  TournamentGroup
} from "@/types/competitions";
import tournamentScheduler from "@/services/tournament";
import { currency } from "@/services/format";
import type { Manager } from "@/state/game";
import type { Invitation } from "@/state/invitation";
import { foreignTeams } from "@/machines/selectors";
import tournamentList from "@/data/tournaments";
import random from "@/services/random";

export type TournamentSeedContext = {
  teams: Team[];
  managers: Record<string, Manager>;
  invitations: Invitation[];
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

  relegateTo: false,
  promoteTo: false,

  /*

  */

  /*

  */

  gameBalance: (_phase, _facts, _manager) => {
    return 0;
  },

  moraleBoost: (_phase, _facts, _manager) => {
    return 0;
  },

  readinessBoost: (_phase, _facts, _manager) => {
    return 0;
  },

  parameters: {
    gameday: (_phase, _group) => ({
      advantage: {
        home: (_team) => 0,
        away: (_team) => 0
      },
      base: () => 20,
      moraleEffect: (team) => {
        return team.morale * 2;
      }
    })
  },

  seed: [
    (
      _competitions: Record<string, Competition>,
      context: TournamentSeedContext
    ) => {
      const { teams, invitations, managers } = context;

      // Build invited teams grouped by tournament index
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
          schedule: tournamentScheduler(participants.length),
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
    }
  ],

  seedContext: [
    (ctx) => ({
      teams: foreignTeams(ctx),
      managers: ctx.human.order,
      invitations: ctx.invitation.invitations.filter((i) => i.accepted)
    })
  ],

  groupEnd: (draft, { groupIdx, group }) => {
    if (group.type !== "tournament") {
      return;
    }
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
  }
};

export default tournaments;
