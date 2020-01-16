export type ArenaLevels = 1 | 2 | 3 | 4 | 5 | 6;

export interface Arena {
  id: string;
  name: string;
  level: ArenaLevels;
  standing: number;
  seats: number;
  boxes: boolean;
}
