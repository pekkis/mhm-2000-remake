import { map, trim, indexBy, prop } from "ramda";
import { Manager, ComputerManager } from "../../types/manager";
import { mapIndexed } from "ramda-adjunct";
import uuid from "uuid";
import { countryFromLegacyCountry } from "../country";
import { MapOf } from "../../types/base";

type ManagerData = [
  string,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

const managerData: ManagerData[] = [
  ["Scotty Booman       ", 10, -2, -2, 2, 2, -1, 1],
  ["Ptr Srszrscen       ", 6, 1, -2, 0, -1, 3, -1],
  ["Karl Gustaf Bormann ", 3, 0, 1, -1, 3, -2, -1],
  ["Fjatseslav Vandals  ", 8, -1, -1, 0, 0, 3, -1],
  ["Seter Ptastny       ", 12, -1, 2, -2, -1, 1, 1],
  ["Wurst Kaltheim      ", 16, 0, 0, 0, 1, 0, -1],
  ["Heinrich Heydrich   ", 3, -1, -1, 1, 1, -1, 1],
  ["Lennart Järvi       ", 7, 2, 2, -2, -1, 0, -1],
  ["Eriko Nondo         ", 13, -1, -1, -1, 1, 1, 1],
  ["Dave Queen          ", 9, 2, 2, -2, -2, 2, -2],
  ["Xavier Rated        ", 20, -2, -2, -1, -1, 3, 3],
  ["Juri Dorkaeff       ", 15, -1, 0, 0, 3, -1, -1],
  ["Tex Genderblender   ", 10, 2, -1, 1, 0, -2, 0],
  ["Blavio Friatore     ", 4, 0, 0, -3, 1, 1, 1],
  ["Clawsa Sykora       ", 6, 0, 0, 1, -1, 0, 0],
  ["Reijo Mustikka      ", 1, 0, 0, 0, 0, 0, 0],
  ["Wech Lalesa         ", 17, 1, 0, 0, 0, 0, -1],
  ["Per von Bachman     ", 1, -3, -3, -3, 3, 3, 3],
  ["Nykan Hågren        ", 2, 2, 2, -2, 0, -1, -1],
  ["Curt Lindman        ", 2, -1, 2, -1, 2, -1, -1],
  ["Sven Stenvall       ", 2, 0, -1, 0, 1, 0, 0],
  ["Kauno O. Pirr       ", 1, -1, -1, -1, -1, 2, 2],
  ["Fent Korsberg       ", 2, 2, 0, 0, -3, 1, 0],
  ["Marcó Harcimo       ", 1, 0, 0, 3, -2, -3, 2],
  ["Kari P.A. Sietilä   ", 1, 3, 3, 0, 2, 2, -3],
  ["Ara Hannuvirta      ", 1, 1, 1, 1, 1, 1, -3],
  ["SuPo Alhonen        ", 1, 0, 3, -2, -1, 0, 0],
  ["Juri Simonov Jr.    ", 5, 2, 2, 0, 0, -1, -3],
  ["Kannu Happanen      ", 1, 0, -2, -2, 2, 2, 0],
  ["Aimo SA Rummanen    ", 1, 0, 2, 0, -2, 0, 0],
  ["Hannes De Ansas     ", 1, 1, 1, 0, 0, -3, 1],
  ["Marty Saariganges   ", 1, 2, -1, 0, 3, -3, -1],
  ["Juri Simonov        ", 5, 3, 2, 2, 3, 3, -3],
  ["Carlos Numminen     ", 1, 1, 0, 1, -1, 1, -2],
  ["Micho Magelä        ", 7, 1, -1, -1, 1, 0, 0],
  ["Jannu Hortikka      ", 1, 2, 2, 0, 2, -3, -3],
  ["Franco M. Berg      ", 2, -1, -1, 1, -1, 3, -1],
  ["Tinjami Uhmanen     ", 1, 2, 1, -3, -2, 3, -1],
  ["Kai L. Sinisalko    ", 1, -2, -2, 1, 1, 1, 1],
  ["Tilhelm Well        ", 11, -1, 2, -1, -1, 2, -1],
  ["Hari Järkäle        ", 1, -2, 0, 2, -1, 1, 0],
  ["Amok R. Jekäläinen  ", 1, 1, 1, -1, -1, -1, 1],
  ["Limo Tahtinen       ", 1, 3, -3, 0, 1, 1, -2],
  ["Mint E. Pattikainen ", 1, -3, 3, -2, 2, -2, 2],
  ["Jukka Palmu         ", 1, 1, 1, 1, -2, -1, 0],
  ["Tasili Vihonov      ", 5, 1, 3, -2, 1, -2, -1],
  ["Pekka Rautakallo    ", 1, -1, -1, 3, -2, 3, -2],
  ["Werkka Easterlund   ", 1, 1, 1, 1, -1, -1, -1],
  ["Imsohel Kone        ", 1, -2, -2, 3, 3, -1, -1],
  ["Um-Bongo Rabban     ", 19, 2, 2, -2, -2, 3, -3],
  ["Ronadlo             ", 18, 0, 3, -3, -3, 3, 0],
  ["Ari Keloranta       ", 1, 1, -1, 0, -1, 0, 1],
  ["Bonatoli Agdanov    ", 5, 3, 0, -1, -1, -1, 0],
  ["Qimbo Tondvist      ", 1, -1, 0, 0, -1, 1, 1]
];

const managerList = mapIndexed<ManagerData, ComputerManager>(md => {
  const [
    name,
    countryId,
    strategy,
    specialTeams,
    negotiation,
    cunning,
    charisma,
    luck
  ] = md;

  const manager: ComputerManager = {
    id: uuid(),
    name: trim(name),
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
}, managerData);

export const managers: MapOf<ComputerManager> = indexBy(
  prop("id"),
  managerList
);
