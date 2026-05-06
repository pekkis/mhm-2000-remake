import type { Player } from "@/state/player";

// QB MHM2K.BAS:55-60 — global constants shared by both palkmaar sites
// (ILEX5.BAS:4063-4070 in-season, ILEZ5.BAS:1322-1331 end-of-season).
const POTENSSI = 1.17;
const POTENSSIPLUS = 0.035;
const PERUSRAHA = 100;
const XVOLISA = 0.05;
const JOHLISA = 0.02;
const KARLISA = 0.015;

/**
 * Port of QB `palkmaar` SUB.
 *
 * Computes the base salary for a player. This is the starting point for
 * contract negotiation — the player's asking price before ego / age /
 * duration / clause premiums are applied in `sopimusext`.
 *
 * QB formula (verbatim, MHM2K.BAS:55-60 + ILEX5.BAS:4063-4070):
 *   exponent = potenssi + psk * potenssiplus        (1.17 + psk * 0.035)
 *   rahna    = CLNG(psk ^ exponent * perusraha)     (exponential base)
 *   if ppp ≠ 1: rahna *= 1 + (avo + yvo) * xvolisa (skaters only; +5% per ±1)
 *   rahna *= 1 + (ldr − 6)  * johlisa              (leadership; neutral at 6)
 *   rahna *= 1 + (kar − 10) * karlisa              (charisma; neutral at 10)
 *
 * Resulting ranges at neutral modifiers (ldr=6, kar=10, yvo=avo=0):
 *   psk= 1 →    100  psk= 5 →    871  psk=10 →  3 311
 *   psk=12 →  5 472  psk=15 →  9 836  psk=20 → 27 073
 */
export function computeSalary(player: {
  skill: number;
  position: Player["position"];
  powerplayMod: number;
  penaltyKillMod: number;
  leadership: number;
  charisma: number;
}): number {
  const { skill, position, powerplayMod, penaltyKillMod, leadership, charisma } =
    player;
  const exponent = POTENSSI + skill * POTENSSIPLUS;
  let salary = Math.pow(skill, exponent) * PERUSRAHA;
  if (position !== "g") {
    salary *= 1 + (powerplayMod + penaltyKillMod) * XVOLISA;
  }
  salary *= 1 + (leadership - 6) * JOHLISA;
  salary *= 1 + (charisma - 10) * KARLISA;
  return Math.round(salary);
}
