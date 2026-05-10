import { createContext } from "react";
import type { LineupTarget } from "@/services/lineup";
import type { Lineup } from "@/state/lineup";
import type { HiredPlayer } from "@/state/player";

export type LineupContextValue = {
  players: Record<string, HiredPlayer>;
  lineup: Lineup;
  appearances: Map<string, number>;
  onAssign: (target: LineupTarget, playerId: string | null) => void;
};

export const LineupContext = createContext<LineupContextValue | null>(null);
