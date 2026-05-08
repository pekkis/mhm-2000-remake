export type Lineup = {
  g?: string;
  forwardLines: [ForwardLine, ForwardLine, ForwardLine, ForwardLine];
  defensivePairings: [DefensivePairing, DefensivePairing, DefensivePairing];
  powerplayTeam: PowerPlayTeam;
  penaltyKillTeam: PenaltyKillTeam;
};

export type ForwardLine = {
  lw?: string;
  c?: string;
  rw?: string;
};

export type DefensivePairing = {
  ld?: string;
  rd?: string;
};

export type PowerPlayTeam = {
  lw?: string;
  c?: string;
  rw?: string;
  ld?: string;
  rd?: string;
};

export type PenaltyKillTeam = {
  f1?: string;
  f2?: string;
  ld?: string;
  rd?: string;
};
