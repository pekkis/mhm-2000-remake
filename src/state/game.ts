import type { Competition, CompetitionId } from "@/types/competitions";
import type { Arena } from "@/data/mhm2000/teams";
import type { SponsorDeal } from "@/data/mhm2000/sponsors";
import type { CountryIso } from "@/data/countries";
import type { ManagerArenaProject } from "@/state/arena-project";

/**
 * Season-scoped mandatory actions. Each key maps to a player decision
 * that becomes *available* at season start and *required* (blocks ADVANCE)
 * on the calendar round that lists it in `requiredActions`.
 *
 * Stored per `HumanManager` in `completedActions`, cleared at season start.
 */
export type SeasonAction =
  | "budget"
  | "strategy"
  | "championshipBet"
  | "sponsor";
import type { ManagerAttributes } from "@/data/managers";
import type { TeamStrength } from "@/data/levels";
import type { BudgetCategoryName, BudgetLevel } from "@/data/mhm2000/budget";
import type { GameRecord } from "@/state/stats";
import type { HiredPlayer, MarketPlayer, Player } from "@/state/player";
import type { Lineup } from "@/state/lineup";
import type { TeamServiceIdentifier } from "@/data/mhm2000/team-services";
import type { Mail } from "@/state/mail";

export type { Player };

export type Manager = HumanManager | AIManager;

export type GamesPlayedStats = Partial<
  Record<CompetitionId, Record<number, GameRecord>>
>;

export type AchievementsStat = {
  ehl: number;
  gold: number;
  silver: number;
  bronze: number;
  cup: number;
  promoted: number;
  relegated: number;
};

type BaseManager = {
  id: string;
  name: string;
  nationality: CountryIso;
  attributes: ManagerAttributes;
  team?: number;
  tags: string[];
  difficulty: number;
  stats: { games: GamesPlayedStats; achievements: AchievementsStat };
  mailbox: Record<string, Mail>;
};

export type AIManager = BaseManager & {
  kind: "ai";
  difficulty: 2;
};

export type HumanManager = BaseManager & {
  kind: "human";
  difficulty: number;
  attributes: ManagerAttributes;
  balance: number;
  pranksExecuted: number;
  flags: Record<string, boolean>;
  tags: string[];
  sponsor: SponsorDeal | undefined;
  completedActions: SeasonAction[];
};

export type TeamEffect = {
  parameter: string[];
  amount: number | string;
  duration: number;
  extra?: Record<string, unknown>;
};

export type TeamBudget = Record<BudgetCategoryName, BudgetLevel>;

export type TeamServices = Record<TeamServiceIdentifier, number>;

type BaseTeam = {
  id: number;
  uid: string;
  name: string;
  city: string;
  arena: Arena;
  domestic: boolean;
  morale: number;
  strategy: number;
  readiness: number;
  effects: TeamEffect[];
  opponentEffects: TeamEffect[];
  manager?: string;
  tags: string[];
  tier: number;
  budget: TeamBudget;
  services: TeamServices;
  previousRankings?: [number, number, number];
  intensity: 0 | 1 | 2;
  fixMatch: boolean;
  mailbox: Record<string, Mail>;

  /**
   * QB `potti(pv)` — protected arena construction fund. Money flows in
   * from manager's balance but never back out — only deducted by the
   * per-round construction instalment (`mpv`). Shielded from the game's
   * cruelty systems (embezzlement, bankruptcy); the cruelty lives inside
   * the construction itself (permit denial, slacking builders, stalled
   * projects). See ARENAS.md §3.
   */
  arenaFund: number;

  /** Season tickets sold so far this preseason. Reset each season. */
  seasonTickets: number;

  /**
   * In-flight arena construction project, if any. `undefined` = no
   * active project. Set by the remppa design wizard, ticked per round
   * by `tickArenaConstruction`, cleared on completion or team swap.
   * See `ManagerArenaProject` in `src/state/arena-project.ts`.
   */
  arenaProject: ManagerArenaProject | undefined;
};

export type AITeam = BaseTeam & {
  kind: "ai";
  strengthObj: TeamStrength;
};

export type HumanTeam = BaseTeam & {
  kind: "human";
  /** QB `mw/pw/hw` — computed from roster by `orgamaar`; initially seeded from team tier. */
  strengthObj: TeamStrength;
  players: Record<string, HiredPlayer>;
  lineup: Lineup;
};

export type Team = HumanTeam | AITeam;

export type GameFlags = {
  jarko: boolean;
  usa: boolean;
  canada: boolean;
  haanperaMarried: boolean;
  mauto: boolean;
  psycho: string | undefined;
};

export type WorldChampionshipEntry = {
  id: string;
  name: string;
  strength: number;
  luck: number;
  random: number;
};

export type GameState = {
  turn: { season: number; round: number; phase: string | undefined };
  flags: GameFlags;
  managers: Record<string, Manager>;
  competitions: Record<CompetitionId, Competition>;
  teams: Team[];
  worldChampionshipResults: WorldChampionshipEntry[] | undefined;

  transferMarket: {
    players: Record<string, MarketPlayer>;
  };

  mail: {
    mailbox: Record<string, Mail>;
  };
};
