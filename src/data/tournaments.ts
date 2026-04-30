import { amount as a } from "@/services/format";
import type { Team } from "@/state/game";
import type { CompetitionId } from "@/types/competitions";

type Tournament = {
  name: string;
  award: number;
  description: (amount: number) => string;
  eligibility: { competitionId: CompetitionId; maxRanking: number };
  filter: (t: Team) => boolean;
};

const tournamentList: Tournament[] = [
  {
    name: "Christmas Cup",
    award: 300000,
    description: (amount) =>
      `__Christmas Cup__ on euroopan perinteisin, suurin ja seuratuin jokavuotinen kutsuturnaus. Mukana on seurajoukkueita monesta maasta, ja osallistumisesta on luvassa __${a(amount)}__ pekkaa.`,
    eligibility: { competitionId: "phl", maxRanking: 5 },
    filter: (t) => t.strength > 200
  },
  {
    name: "Go-Go Cola Cup",
    award: 250000,
    description: (amount) =>
      `__GoGo Cola-Cup__ on ei-kovin-perinteikäs, miedosti tunnettu ja arvostettu joulunajan kutsuturnaus Kööpenhaminassa, Tanskassa, ja joukkuettasi on pyydetty mukaan. Osallistuminen kartuttaisi kassaa __${a(amount)}__ pekalla.`,
    eligibility: { competitionId: "phl", maxRanking: 9 },
    filter: (t) => t.strength >= 150 && t.strength < 225
  },
  {
    name: "Cacca Cup",
    award: 100000,
    description: (amount) =>
      `Sloveniassa järjestettävään __Cacca Cupiin__ osallistuvat monet maanosan ehdottomat rupuseurat! Järjestäjät etsivät uusia jännittäviä kökköjoukkueita surkuhupaisaan pikku turnaukseensa, ja osallistumisesta on luvassa __${a(amount)}__ pekan palkkio.`,
    eligibility: { competitionId: "division", maxRanking: 5 },
    filter: (t) => t.strength <= 175
  }
];

export default tournamentList;
