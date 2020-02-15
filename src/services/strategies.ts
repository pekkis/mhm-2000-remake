import { SeasonStrategy, SeasonStrategies, ForEvery } from "../types/base";
import { sortWith, ascend, prop, values } from "ramda";
import { Manager } from "../types/manager";

export const strategyHandlers: ForEvery<SeasonStrategies, SeasonStrategy> = {
  simonov: {
    weight: 1000,
    id: "simonov",
    name: "Juri Simonov",
    description: `Kuuluisan venäläismanageri **Juri Simonovin** aikoinaan kehittämä ovela strategia. Joukkue treenaa rajusti koko kesän ja syksyn, ja peliesitykset kärsivät. Talven mittaan pelaajien uskomaton kuntopohja alkaa kuitenkin kantaa hedelmää, ja keväällä joukkuetta ei pysäytä mikään.`,
    initialReadiness: (manager: Manager) => {
      return 0.945 + manager.abilities.strategy * 0.007;
    },
    incrementReadiness: () => 0.0025
  },
  kaikkipeliin: {
    weight: 2000,
    id: "kaikkipeliin",
    name: "Kaikki peliin!",
    description: `Kaikki voimavarat laitetaan peliin heti kauden alusta alkaen! Kaudella 1994-1995 manageri **Per von Bachman** yllätti kaikki putoajaksi tuomitun ryhmänsä kanssa ja ylsi miltei play-offeihin asti fantastisen alkukauden ansiosta.`,
    initialReadiness: (manager: Manager) => {
      return 1.055 + manager.abilities.strategy * 0.007;
    },
    incrementReadiness: () => -0.0025
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

export const weightedStrategyList = strategySorter(values(strategyHandlers));

export default strategyHandlers;
