/**
 * MHM 2000 crisis meeting options. Ported from `SUB kriisipalaveri`
 * (ILEX5.BAS:2747-2872). X.MHM records 156-158.
 *
 * Unlike MHM 97's one-button morale-buy, MHM 2000's crisis meeting
 * is a three-tier escalation with no cost — the price is the risk.
 */

export type CrisisOption = 1 | 2 | 3;

export const crisisOptions: Record<
  CrisisOption,
  { title: string; description: string }
> = {
  1: {
    title: "Kriisipalaveri",
    description: "Turvallinen pukukoppikokous kapteenisi kanssa."
  },
  2: {
    title: "Alkoholiton saunailta",
    description: "Kolme noppaa, isommat heilahdukset molempiin suuntiin."
  },
  3: {
    title: "Kaljahuuruinen saunailta",
    description:
      "Neljä noppaa, suurimmat heilahdukset — ja mahdollinen loukkaantuminen."
  }
};
