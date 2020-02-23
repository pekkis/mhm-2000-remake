import { sponsorNames } from "./data/sponsors";
import random from "./random";
import { SponsorshipClausule, SponsorshipProposal } from "../types/sponsor";
import { MapOf } from "../types/base";
import { sortWith, ascend, prop, values } from "ramda";
import { Arena } from "../types/arena";

/*
seks: [
  1: phl => 4, div,mut => 0
  2: phl: 0, div,mut => 3
  3: 3
  4: ehl: 3, ei ehl => 0
]
*/

interface SponsorshipClausuleService {
  id: string;
  legacyId: number;
  title: string;
  weight: number;

  willSponsorOffer: (proposal: SponsorshipProposal) => boolean;

  getAmount: (proposal: SponsorshipProposal) => number;

  // isRelevant: (proposal: SponsorshipProposal) => boolean;
}

export const sponsorshipClausuleMap: MapOf<SponsorshipClausuleService> = {
  firstPlace: {
    weight: 1000,
    id: "firstPlace",
    legacyId: 1,
    title: "Mestaruus",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("phl");
    },

    getAmount: (proposal: SponsorshipProposal) => {
      return 0;
    }
  },
  secondPlace: {
    weight: 1000,
    id: "secondPlace",
    legacyId: 2,
    title: "Hopea",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("phl");
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  bronzeMedal: {
    weight: 1000,
    id: "thirdPlace",
    legacyId: 3,
    title: "Pronssi",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("phl");
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  fourthPlace: {
    weight: 1000,
    id: "fourthPlace",
    legacyId: 4,
    title: "Neljäs sija",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("phl");
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  playoffs: {
    weight: 1000,
    id: "playoffs",
    legacyId: 5,
    title: "Pääsy Play-Offeihin",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return true;
    },
    getAmount: (proposal: SponsorshipProposal) => {
      if (proposal.requirements.basic === 2) {
        return proposal.baseAmount * 3;
      }

      return 0;
    }
  },
  cupWin: {
    weight: 1000,
    id: "cupWin",
    legacyId: 6,
    title: "Cupin voitto",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return true;
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  cupAdvancement: {
    weight: 1000,
    id: "cupAdvancement",
    legacyId: 7,
    title: "Eteneminen cupissa",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return true;
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  ehlWin: {
    weight: 1000,
    id: "ehlWin",
    legacyId: 8,
    title: "Euroopan mestaruus",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("ehl");
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  ehlPhaseTwo: {
    weight: 1000,
    id: "ehlPhaseTwo",
    legacyId: 9,
    title: "Pääsy EHL:n lopputurnaukseen",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("ehl");
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  promotion: {
    weight: 1000,
    id: "promotion",
    legacyId: 10,
    title: "Sarjanousu",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return (
        proposal.competitions.includes("division") ||
        proposal.competitions.includes("mutasarja")
      );
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  missMedal: {
    weight: 1000,
    id: "missMedal",
    legacyId: 11,
    title: "Mitalitta jääminen",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("phl");
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  missSemiFinals: {
    weight: 1000,
    id: "missSemiFinals",
    legacyId: 12,
    title: "Semifinaaleista karsiutuminen",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("phl");
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  missPlayoffs: {
    weight: 1000,
    id: "missPlayoffs",
    legacyId: 13,
    title: "Play-offeista ulos jääminen",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("phl");
    },
    getAmount: (proposal: SponsorshipProposal) => {
      if (proposal.requirements.basic === 1) {
        return 0;
      }
    }
  },
  missSafetyFromRelegation: {
    weight: 1000,
    id: "missSafetyFromRelegation",
    legacyId: 14,
    title: "Karsintaan joutuminen",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return (
        proposal.competitions.includes("phl") ||
        proposal.competitions.includes("division")
      );
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  relegation: {
    weight: 1000,
    id: "relegation",
    legacyId: 15,
    title: "Putoaminen",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return (
        proposal.competitions.includes("phl") ||
        proposal.competitions.includes("division")
      );
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  missCupSemiFinals: {
    weight: 1000,
    id: "missCupSemiFinals",
    legacyId: 16,
    title: "Putoaminen cupista ennen semifinaaleja",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return true;
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  missCup2ndRound: {
    weight: 1000,
    id: "missCup2ndRound",
    legacyId: 17,
    title: "Putoaminen cupista 1. kierroksella",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return true;
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  missEhlPhaseTwo: {
    weight: 1000,
    id: "missEhlPhaseTwo",
    legacyId: 18,
    title: "EHL:n lopputurnauksesta karsiutuminen",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("ehl");
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  missPromotion: {
    weight: 1000,
    id: "missPromotion",
    legacyId: 18,
    title: "Ei sarjanousua",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return (
        proposal.competitions.includes("division") ||
        proposal.competitions.includes("mutasarja")
      );
    },
    getAmount: (proposal: SponsorshipProposal) => {
      return 666;
    }
  },
  roundlyPayment: {
    weight: 1000,
    id: "roundlyPayment",
    legacyId: 18,
    title: "Ottelumaksu",
    willSponsorOffer: () => true,
    getAmount: (proposal: SponsorshipProposal) => {
      return proposal.baseAmount;
    }
  }
};

const sorter = sortWith<SponsorshipClausuleService>([ascend(prop("weight"))]);

export const weightedSponsorshipClausuleList = () => {
  return sorter(values(sponsorshipClausuleMap));
};

/*
  "MESTARUUS",
  "HOPEA",
  "PRONSSI",
  "NELJÄS SIJA",
  "PÄÄSY PLAY-OFFEIHIN",
  "CUPIN VOITTO",
  "KIERROS/CUP",
  "EUROOPAN MESTARUUS",
  "PÄÄSY EHL-LOPPUTURNAUKSEEN",
  "SARJANOUSU",
  "MITALITTA JÄÄMINEN",
  "SEMIFINAALEISTA KARSIUTUMINEN",
  "PLAY-OFFEISTA ULOS JÄÄMINEN",
  "KARSINTAAN JOUTUMINEN",
  "PUTOAMINEN",
  "PUTOAMINEN CUPISTA ENNEN SEMIFINAALEJA",
  "PUTOAMINEN CUPISTA 1. KIERROKSELLA",
  "EHL:N LOPPUTURNAUKSESTA KARSIUTUMINEN",
  "EI SARJANOUSUA",
*/

export const getRandomAttitude = (proposal: SponsorshipProposal): number => {
  return 0.9 + random.real(0, 0.05) + proposal.attitudeBonus;
};

export const getRandomSponsorName = (): string => {
  return random.pick(sponsorNames);
};

export const getArenaModifier = (arena: Arena): number => {
  if (!arena.boxes) {
    return 0;
  }

  return 0.05;
};
