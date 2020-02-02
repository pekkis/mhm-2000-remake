import { SeasonStrategy, SeasonStrategies, ForEvery } from "../types/base";
import { sortWith, ascend, prop, values } from "ramda";

const strategies: ForEvery<SeasonStrategies, SeasonStrategy> = {
  simonov: {
    weight: 1000,
    id: "simonov",
    name: "Juri Simonov",
    description: `Kuuluisan venäläismanageri **Juri Simonovin** aikoinaan kehittämä ovela strategia. Joukkue treenaa rajusti koko kesän ja syksyn, ja peliesitykset kärsivät. Talven mittaan pelaajien uskomaton kuntopohja alkaa kuitenkin kantaa hedelmää, ja keväällä joukkuetta ei pysäytä mikään.`,
    initialReadiness: () => -22,
    incrementReadiness: turn => {
      if (turn.round >= 54) {
        return 0;
      }
      return 1;
    }
  },
  kaikkipeliin: {
    weight: 2000,
    id: "kaikkipeliin",
    name: "Kaikki peliin!",
    description: `Kaikki voimavarat laitetaan peliin heti kauden alusta alkaen! Kaudella 1994-1995 manageri **Per von Bachman** yllätti kaikki putoajaksi tuomitun ryhmänsä kanssa ja ylsi miltei play-offeihin asti fantastisen alkukauden ansiosta.`,
    initialReadiness: () => 24,
    incrementReadiness: turn => {
      if (turn.round >= 54) {
        return 0;
      }

      if (turn.round > 44) {
        return -2;
      }

      // IF allgo = 1 AND kr > 35 THEN tre = tre - 1
      // IF allgo = 1 AND kr > 40 THEN tre = tre - 1

      // TODO: alterations?
      return -1;
    }
  },
  puurto: {
    weight: 3000,
    id: "puurto",
    name: "Tasainen puurto",
    description: `Tämä strategia perustuu tasaisen kunnon ylläpitämiseen koko pitkän ja puuduttavan kauden ajan. Junnaavilla valmennusmenetelmillä saavutetaan aito **puurtamisen** meininki!`,
    initialReadiness: () => 0,
    incrementReadiness: () => 0
  }
};

const strategySorter = sortWith<SeasonStrategy>([ascend(prop("weight"))]);

export const weightedStrategyList = strategySorter(values(strategies));

export default strategies;
