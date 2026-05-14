import type { AchievementsStat, TeamBudget, TeamServices } from "@/state/game";
import type { Lineup } from "@/state/lineup";
import type { OngoingSeasonStats } from "@/state/stats";

export const emptyAchievements = (): AchievementsStat => {
  return {
    gold: 0,
    silver: 0,
    bronze: 0,
    ehl: 0,
    cup: 0,
    promoted: 0,
    relegated: 0
  };
};

export const emptyTeamServices = (): TeamServices => {
  return {
    alcoholSales: 0,
    doping: 0,
    fanGroup: 0,
    travel: 0
  };
};

export const emptyTeamBudget = (): TeamBudget => {
  return {
    benefits: 1,
    coaching: 1,
    goalieCoaching: 1,
    health: 1,
    juniors: 1
  };
};

export const emptySeasonStat = (): OngoingSeasonStats => {
  return {
    ehlChampion: undefined,
    presidentsTrophy: undefined,
    medalists: [],
    promoted: {
      division: [],
      mutasarja: []
    },
    relegated: {
      phl: [],
      division: []
    },
    worldChampionships: undefined,
    stories: {}
  } satisfies OngoingSeasonStats;
};

export const emptyLineup = (): Lineup => {
  return {
    g: null,

    forwardLines: [
      {
        lw: null,
        c: null,
        rw: null
      },
      {
        lw: null,
        c: null,
        rw: null
      },
      {
        lw: null,
        c: null,
        rw: null
      },
      {
        lw: null,
        c: null,
        rw: null
      }
    ],
    defensivePairings: [
      {
        ld: null,
        rd: null
      },
      {
        ld: null,
        rd: null
      },
      {
        ld: null,
        rd: null
      }
    ],
    penaltyKillTeam: {
      f1: null,
      f2: null,
      ld: null,
      rd: null
    },
    powerplayTeam: {
      lw: null,
      c: null,
      rw: null,
      ld: null,
      rd: null
    }
  };
};
