import table, { sortStats } from "@/services/league";
import { defaultMoraleBoost } from "@/services/morale";
import { scheduler as roundRobinScheduler } from "@/services/round-robin";
import tournamentScheduler from "@/services/tournament";
import { currency } from "@/services/format";
import type {
  Competition,
  CompetitionDefinition,
  TeamStat
} from "@/types/competitions";

// EHL final-tournament prizes by ranking. `strength` is awarded to
// foreign teams (no manager); managed teams get `amount` + announcement.
type EhlAward = {
  amount: number;
  strength: number;
  text: (amount: number) => string;
};

const ehlAwards: EhlAward[] = [
  {
    amount: 2_000_000,
    strength: 30,
    text: (a) =>
      `Voitimme jääkiekon euroopan mestaruuden. Johtokunta onnittelee menestyksekästä joukkuetta ja sen manageria yksissä tuumin. Sielua lämmittävän kiittelyn ohella joukkueen tilille napsahtaa aimo summa pätäkkää, kaiken kaikkiaan __${currency(a)}__. `
  },
  {
    amount: 1_600_000,
    strength: 28,
    text: (a) =>
      `Sijoituimme toiseksi EHL:n lopputurnauksessa. Hopea ei ole häpeä, ja johtokunta on samaan aikaan onnellinen saavutuksesta mutta haikea saavuttamattomasta. Onneksi palkkiosumma, __${currency(a)}__, lohduttaa tasaisesti kaikkia asianosaisia.`
  },
  {
    amount: 1_400_000,
    strength: 26,
    text: (a) =>
      `Sijoituimme kolmanneksi EHL:n lopputurnauksessa. Himmeinkin mitali kelpaa, ja johtokunta on miedosti onnellinen saavutuksestanne. Kättelyt ovat ainakin kädenlämpoisiä, ja rahapalkkio, __${currency(a)}__, kyllä kelpaa aivan jokaiselle.`
  },
  {
    amount: 1_200_000,
    strength: 24,
    text: (a) =>
      `Sijoituimme neljänneksi EHL:n lopputurnauksessa. Johtokunta tunnustaa haaveilleensa paremmasta, mutta ottaa silti ilolla vastaan rahapalkkion, __${currency(a)}__.`
  },
  {
    amount: 1_000_000,
    strength: 22,
    text: (a) =>
      `Sijoituimme viidenneksi EHL:n lopputurnauksessa. Johtokunta nyreilee ja kyräilee, he odottivat joukkueelta selvästi enemmän. Rahapalkkio, __${currency(a)}__, kelpaa heille kyllä, mutta se ei kuulemma "lohduta heitä pimeinä talvi-iltoina".`
  },
  {
    amount: 800_000,
    strength: 20,
    text: (a) =>
      `Sijoituimme viimeiseksi EHL:n lopputurnauksessa. No, ainakin kohtuullinen rahapalkkio, __${currency(a)}__, napsahtaa tilillenne.`
  }
];

const ehl: CompetitionDefinition = {
  data: {
    weight: 2000,
    id: "ehl",
    phase: -1,
    name: "EHL",
    abbr: "ehl",
    teams: [],
    phases: []
  },

  relegateTo: false,
  promoteTo: false,

  gameBalance: (phase, _facts, manager) => {
    if (phase > 0) {
      return 0;
    }

    const arenaLevel = manager.arena.level + 1;
    return 100000 + 20000 * arenaLevel;
  },

  moraleBoost: (phase, facts, _manager) => {
    if (phase > 0) {
      return 0;
    }

    return defaultMoraleBoost(facts);
  },

  readinessBoost: (phase, _facts, _manager) => {
    if (phase > 0) {
      return 0;
    }
    return -1;
  },

  parameters: {
    gameday: (phase) => ({
      advantage: {
        home: (_team) => (phase === 0 ? 10 : 0),
        away: (_team) => (phase === 0 ? -10 : 0)
      },
      base: () => 20,
      moraleEffect: (team) => {
        return team.morale * 2;
      }
    })
  },

  seed: [
    (competitions: Record<string, Competition>) => {
      const times = 1;
      const ehlComp = competitions.ehl;
      const teams = ehlComp.teams;

      const groups = Array.from({ length: 5 }, (_, groupId) => {
        const teamSlice = teams.slice(groupId * 4, groupId * 4 + 4);
        return {
          type: "round-robin" as const,
          round: 0,
          name: `lohko ${groupId + 1}`,
          teams: teamSlice,
          schedule: roundRobinScheduler(teamSlice.length, times),
          colors: ["d", "l", "l", "l"],
          penalties: [],
          stats: []
        };
      });

      return {
        teams,
        name: "runkosarja",
        type: "round-robin" as const,
        groups
      };
    },
    (competitions: Record<string, Competition>) => {
      const ehlGroups = competitions.ehl.phases[0].groups;
      const ehlTables = ehlGroups.map(table);

      const qualifiedVictors = ehlTables.map((t) => t[0]);

      const allSeconds = ehlTables.flatMap((t) => t.slice(1));
      const sorted = sortStats(allSeconds);
      const qualifiedSecond = sorted[0];

      const teams = [...qualifiedVictors, qualifiedSecond].map((e) => e.id);

      console.log("Qualified teams", teams);

      return {
        name: "lopputurnaus",
        type: "tournament" as const,
        teams,
        groups: [
          {
            type: "tournament" as const,
            penalties: [],
            colors: ["d", "l", "l", "l", "l", "l"],
            teams,
            round: 0,
            name: "lopputurnaus",
            schedule: tournamentScheduler(teams.length),
            stats: []
          }
        ]
      };
    }
  ],

  groupEnd: (draft, { phase, group }) => {
    // Awards only run after the final tournament (phase 1).
    if (phase !== 1) {
      return;
    }
    const stats = group.stats as TeamStat[];
    for (const [ranking, stat] of stats.entries()) {
      const team = draft.teams[stat.id];
      if (ranking === 0 && draft.stats.currentSeason) {
        draft.stats.currentSeason.ehlChampion = team.id;
      }
      if (!team.domestic) {
        continue;
      }
      team.readiness -= 2;
      if (team.manager === undefined) {
        team.strength += ehlAwards[ranking].strength;
        continue;
      }
      const award = ehlAwards[ranking];
      const m = draft.managers[team.manager];
      if (!m) {
        continue;
      }

      if (m.kind === "ai") {
        continue;
      }

      m.balance += award.amount;
      if (!draft.news.announcements[m.id]) {
        draft.news.announcements[m.id] = [];
      }
      draft.news.announcements[m.id].push(award.text(award.amount));
    }
  }
};

export default ehl;
