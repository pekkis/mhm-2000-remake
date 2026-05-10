import { createContext } from "react";
import type { LineupSlot, LineupTarget } from "@/services/lineup";
import type { Lineup } from "@/state/lineup";
import type { HiredPlayer } from "@/state/player";

export type LineupContextValue = {
  players: Record<string, HiredPlayer>;
  lineup: Lineup;
  appearances: Map<string, number>;
  onAssign: (target: LineupTarget, playerId: string | null) => void;
  activeTarget: LineupTarget | null;
  openSlot: (target: LineupTarget, slot: LineupSlot) => void;
  closeSlot: () => void;
  activeSlot: LineupSlot | null;
};

export const LineupContext = createContext<LineupContextValue | null>(null);
