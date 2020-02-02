import { MapOf, ForEvery } from "../types/base";
import {
  Manager,
  HumanManager,
  ComputerManager,
  ManagerAbilities
} from "../types/manager";
import rawManagerData, { RawManagerData } from "./data/manager-data";
import { countryFromLegacyCountry } from "./country";
import { trim, indexBy, prop, sortWith, ascend, values } from "ramda";
import { mapIndexed } from "ramda-adjunct";
import uuid from "uuid";
import slug from "slug";

export const isHumanManager = (manager: Manager): manager is HumanManager => {
  return manager.isHuman;
};

export const isComputerManager = (
  manager: Manager
): manager is ComputerManager => {
  return !manager.isHuman;
};

export const previousExperience = [
  {
    name: "Uusi kasvo",
    minRanking: 44
  },
  {
    name: "Kokenut konkari",
    minRanking: 8
  },
  {
    name: "Elävä legenda",
    minRanking: 1
  }
];

export const createFillerManager = (): ComputerManager => {
  const name = "Alan Smithee";

  const smithee: ComputerManager = {
    id: createId({ name }),
    name,
    ai: "default",
    isHuman: false,
    country: "FI",
    abilities: {
      charisma: 0,
      cunning: 0,
      luck: 0,
      negotiation: 0,
      specialTeams: 0,
      strategy: 0
    }
  };

  return smithee;
};

export const createId = (manager: { name: string }) => {
  return (
    slug(manager.name, { lower: true }) +
    "-" +
    uuid()
      .split("-")
      .shift()
  );
};

const managerList = mapIndexed<RawManagerData, ComputerManager>(md => {
  const [
    name,
    countryId,
    strategy,
    specialTeams,
    negotiation,
    cunning,
    charisma,
    luck,
    ai
  ] = md;

  const d = {
    name
  };

  const manager: ComputerManager = {
    id: createId(d),
    name: trim(name),
    ai,
    country: countryFromLegacyCountry(countryId),
    abilities: {
      strategy,
      specialTeams,
      negotiation,
      cunning,
      charisma,
      luck
    },
    isHuman: false
  };

  return manager;
}, rawManagerData);

export const managers: MapOf<ComputerManager> = indexBy(
  prop("id"),
  managerList
);

interface ManagerAbilityService {
  id: keyof ManagerAbilities;
  weight: number;
  name: string;
  description: string;
}

/*
"Tämä taito kertoo managerin pitkän tähtäimen valmennusosaamisen: sen merkitystä ei voi liiaksi korostaa. Kellään ei ole enää mukavaa, jos huolella laadittu harjoitusohjelma pettää kesken kauden.",
"Ylivoima, alivoima, rangaistuslaukaukset ja yleensä mitä kummallisimmat erikoistilanteet kuuluvat tämän taidon piiriin. Ei tarvinne erikseen mainita, että erikoistilanteet ratkaisevat usein otteluja.",
"Manageri kohtaa urallaan monia neuvottelutilanteita, joissa hän tarvitsee tilanteesta riippuen erilaisia menetelmiä: kovuutta, mielistelyä, manipulointia ja niin edelleen. Neuvottelutaito pitää sisällään nämä kaikki.",
"Manageri ei voi välttyä kriisitilanteilta, ja kysymys kuuluukin: kuinka hän niistä selviytyy? Tähtipelaajien välillä on kismaa, tappioputki painaa moraalia, ja niin edelleen. Tällöin neuvokkuutta kaivataan!",
"Maailma rakastaa karismaattista manageria. Pelaajat neuvottelevat hänen kanssaan mielellään, fanit rakastavat ja media palvoo häntä - kukaan ei tahdo hänelle pahaa eikä usko hänestä pahaa. Rujon, epämiellyttävän managerin elämä on ankeampaa, hän saa kerätä postiluukustaan rakkausrunojen sijasta pommiuhkauksia.",
"Jääkiekko on toki taitolaji, mutta kaikesta huolimatta myös managerin elämässä tuurilla on suuri merkitys... suuri, sen enempää täsmentämättä, luo epäonninen persoona niin saat selville kuinka suuri.",
*/

export const managerAbilitySorter = sortWith<ManagerAbilityService>([
  ascend(prop("weight"))
]);

export const managerAbilities: ForEvery<
  keyof ManagerAbilities,
  ManagerAbilityService
> = {
  strategy: {
    id: "strategy",
    weight: 1000,
    name: "strategiat",
    description:
      "Tämä taito kertoo managerin pitkän tähtäimen valmennusosaamisen: sen merkitystä ei voi liiaksi korostaa. Kellään ei ole enää mukavaa, jos huolella laadittu harjoitusohjelma pettää kesken kauden."
  },
  specialTeams: {
    id: "specialTeams",
    weight: 2000,
    name: "erikoistilanteet",
    description:
      "Ylivoima, alivoima, rangaistuslaukaukset ja yleensä mitä kummallisimmat erikoistilanteet kuuluvat tämän taidon piiriin. Ei tarvinne erikseen mainita, että erikoistilanteet ratkaisevat usein otteluja."
  },
  negotiation: {
    id: "negotiation",
    weight: 3000,
    name: "neuvottelutaito",
    description:
      "Manageri kohtaa urallaan monia neuvottelutilanteita, joissa hän tarvitsee tilanteesta riippuen erilaisia menetelmiä: kovuutta, mielistelyä, manipulointia ja niin edelleen. Neuvottelutaito pitää sisällään nämä kaikki."
  },
  cunning: {
    id: "cunning",
    weight: 4000,
    name: "neuvokkuus",
    description:
      "Manageri ei voi välttyä kriisitilanteilta, ja kysymys kuuluukin: kuinka hän niistä selviytyy? Tähtipelaajien välillä on kismaa, tappioputki painaa moraalia, ja niin edelleen. Tällöin neuvokkuutta kaivataan!"
  },
  charisma: {
    id: "charisma",
    weight: 5000,
    name: "karisma",
    description:
      "Maailma rakastaa karismaattista manageria. Pelaajat neuvottelevat hänen kanssaan mielellään, fanit rakastavat ja media palvoo häntä - kukaan ei tahdo hänelle pahaa eikä usko hänestä pahaa. Rujon, epämiellyttävän managerin elämä on ankeampaa, hän saa kerätä postiluukustaan rakkausrunojen sijasta pommiuhkauksia."
  },
  luck: {
    id: "luck",
    weight: 6000,
    name: "onni",
    description:
      "Jääkiekko on toki taitolaji, mutta kaikesta huolimatta myös managerin elämässä tuurilla on suuri merkitys... suuri, sen enempää täsmentämättä, luo epäonninen persoona niin saat selville kuinka suuri."
  }
};

export const weightedManagerAbilityList = managerAbilitySorter(
  values(managerAbilities)
);
