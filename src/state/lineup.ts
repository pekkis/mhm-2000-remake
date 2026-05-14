export type Lineup = {
  captain?: string;
  g: string | null;
  forwardLines: [ForwardLine, ForwardLine, ForwardLine, ForwardLine];
  defensivePairings: [DefensivePairing, DefensivePairing, DefensivePairing];
  powerplayTeam: PowerPlayTeam;
  penaltyKillTeam: PenaltyKillTeam;
};

export type ForwardLine = {
  lw: string | null;
  c: string | null;
  rw: string | null;
};

export type DefensivePairing = {
  ld: string | null;
  rd: string | null;
};

export type PowerPlayTeam = {
  lw: string | null;
  c: string | null;
  rw: string | null;
  ld: string | null;
  rd: string | null;
};

export type PenaltyKillTeam = {
  f1: string | null;
  f2: string | null;
  ld: string | null;
  rd: string | null;
};
