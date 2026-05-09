import type { SeasonStats } from "@/state";
import type { AchievementsStat } from "@/state/game";
import type { Lineup } from "@/state/lineup";

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

export const emptySeasonStat = (): SeasonStats => {
  return {
    ehlChampion: undefined,
    medalists: [],
    presidentsTrophy: undefined,
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
  } satisfies SeasonStats;
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
