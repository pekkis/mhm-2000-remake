import { TeamOrganization } from "../types/team";
import { ForEvery } from "../types/base";
import { sortWith, ascend, prop, values } from "ramda";

export interface OrganizationAspect {
  id: keyof TeamOrganization;
  weight: number;
  name: string;
  descriptions: string[];
  unit: string;
  prices: number[];
}

export const organizationLevels: ForEvery<
  keyof TeamOrganization,
  OrganizationAspect
> = {
  coaching: {
    name: "Kenttäpelaajavalmennus",
    weight: 1000,
    id: "coaching",
    descriptions: [
      "Tällä panostuksella saat erittäin kokemattoman, läpeensä korruptoituneen ja pahasti alkoholisoituneen apulaisvalmentajan, etkä ollenkaan katsomo- valmentajaa.",
      "Tällä panostuksella avuksesi tulee heppuli, jonka vaikuttavin ominaisuus on valloittava pepsodent-hymy. Katsomovalmentajasi löytää kiikareillaan ainoastaan vastapuolen pelaajien tyttö/poikaystävät, mutta heitä sitten sitäkin enemmän.",
      "Tällä rahalla saat apulaisvalmentajan, joka piirtää fläppitaululleen merkillisiä, joskus jopa toimivia kuvioita (kaupan päälle 10 tussia) sekä katsomovalmentajan, joka sekoaa ajoittain ruveten tekemään töitä.",
      "Panostaessasi tämän verran avuksesi rientää rutinoitunut apulaisvalmentaja joka hoitaa hommansa eleettömästi. Katsomossa vastustaa kyttää yli 100 PHL-ottelun veteraani, jolle jääkiekko on tuttua joka osa-alueelta.",
      "Valtavalla panostuksella saat avuksesi vuosikymmenen NHL-kokemuksen omaavan entisen supertähden, jolle jääkiekko on kaikki kaikessa. Katsomovalmentajaksesi saapuu lahjomattomasti kaiken esille tonkiva, yleisesti pelätty ketku."
    ],
    unit: "per kierros",
    prices: [-1000, -2000, -4000, -7000, -11000]
  },
  goalieCoaching: {
    name: "Maalivahtivalmennus",
    weight: 2000,
    id: "goalieCoaching",
    descriptions: [
      "Tällä panostuksella maalivahdeistasi huolehtii kokonaista kolme jääkiekko- ottelua (40-luvulla) elämänsä aikana nähnyt Summan veteraani, joka vastaa kymmentä venäläistä???",
      "Kun panostat näin paljon, veskareitasi tukemaan saapuu salibandyn ykkösdivisioonassa maalivahtina pelannut mies, jonka oma ura keskeytyi jo alta kolmekymppisenä kun meininki muuttui ammattimaiseksi.",
      "Tämä mies on pelannut jääkiekkoa! Hän oli Pietarsaaren Centers-IFK:n luottomaalivahteja heidän katastrofiin päättyneen divisioonakautensa aikana, ja senkin jälkeen alasarjoissa...",
      "Tämän miehen ura katkesi loukkaantumiseen juuri tähteyteen nousun kynnyksellä. Onneksi hänen asiantuntemuksensa on mahdollista ottaa käyttöön edes valmennuspuolella.",
      "Oliko tämä neuvostoliittolainen virtuoosi suuruuden päivinään 70-luvulla jopa parempi huin Haminik Dosek? Siinä kysymys, johon monet ovat ottaneet kantaa mutta johon emme koskaan saa vastausta..."
    ],
    unit: "per kierros",
    prices: [-1000, -2000, -4000, -7000, -11000]
  },
  juniorAcademy: {
    name: "Juniorityö",
    weight: 3000,
    id: "juniorAcademy",
    descriptions: [
      "Tällä rahalla saat junioripäälliköksesi oudon, pitkään sadetakkiin verhoutuneen hiipparin Tiukukosken suljetulta osastolta.",
      "Tällä panostuksella avuksesi rientää läheisestä lastentarhasta tarmokas tätihenkilö, jolla on vankka yli 20 vuoden kokemus lasten kaitsemisesta.",
      "Tämä mies vasta aloittelee uraansa, mutta hänessä on potentiaalia nousta vaikkapa historian suurimmaksi junioripäälliköksi.",
      "Kun panostat näin paljon, saat juniorityöhösi pomoksi ammattilaisen joka tietää tasan tarkkaan miten lahjakkaat junnut muutetaan PHL-jyriksi.",
      "Tämä mies on luonut supertähtiä, kun muut junioripäälliköt makasivat vielä kapaloissa. Hänet tunnetaan, häntä arvostetaan, ja hänen käsialaansa ovat niin Kari Jurri, Nenä Teemules kuin Paki-Betteri Erg:kin."
    ],
    unit: "per kierros",
    prices: [-1000, -2000, -4000, -7000, -11000]
  },
  care: {
    name: "Huolto",
    weight: 4000,
    id: "care",
    descriptions: [
      "Keskiafrikkalainen poppamies tuo tällä rahalla mukanaan jopa rumpunsa ja monta nuottikirjaa. Ne auttavat kaikkiin mahdollisiin vaivoihin!",
      "Ensimmäisessä maailmansodassa koeteltu lääkintämies on hyvä vaihtoehto! Hän osaa hoitaa ampumahaavat, jos ei vain ole unohtanut silmälasejaan ja hengityskonettaan pukusuojaan.",
      "Paikallisesta terveyskeskuksesta saa napattua kätevästi joukkueen palvelukseen nuoren yleislääkärin; hän tuo mukanaan paketin Puranaa.",
      "Tämä panostus tuo avuksesi arkkiatrin, joka hoitaa vaivan kuin vaivan tehokkaasti. Hän sitoo, paikkaa ja vaikkapa hellii, jos se suinkin vain edistää paranemisprosessia.",
      "Tällä panostuksella saat houkuteltua noin vuosikymmen sitten mysteerisesti kadonneen itäsaksalaisen tohtori Mengelen palaamaan ruotuun. Mies tuo mukanaan sekalaisen kasan lääkkeitä ja lääkkeenkaltaisia substansseja, jotka kursivat loukkaantuneet entistä ehommaksi alta aikayksikön."
    ],
    unit: "per kierros",
    prices: [-1000, -2000, -4000, -7000, -11000]
  },
  benefits: {
    name: "Luontaisedut",
    weight: 5000,
    id: "benefits",
    descriptions: [
      "Pyh! Mitään luontaisetuja meillä ole, hoitakoon pelaajat itse asiansa.",
      "No voimme me soppaa harjoitusten jälkeen tarjota, ja pelin tuoksinassa joskus urheilujuomaa - muuta EI tipu.",
      "Pyrimme auttamaan pelaajia sopeutumisessa esim. hankkimalla heille asunnon paikkakunnalta. Vuokraa emme kuitenkaan maksa, emme missään nimessä.",
      "Luontaisetuihimme kuuluu asunto sekä luotettava 80-luvun itäauto. Teemme muutenkin kaikkemme, jotta pelaajat viihtyisivät joukkueessamme.",
      "Nopeita naisia, halpoja autoja, kumiruoskia ja käsirautoja! Mitä pelaaja haluaakaan, sen me hänelle annamme. Palkkalistoillamme on kokopäivätoimisena psykiatri joka auttaa sopeutumisvaikeuksissa, ja koko joukkueemme toimii pelaajien mielihalujen ehdoilla. Melkein kuin *IT-alalla!*"
    ],
    unit: "* pelaajien lkm per kierros",
    prices: [0, -100, -200, -500, -1000]
  }
};

export const organizationLevelSorter = sortWith<OrganizationAspect>([
  ascend(prop("weight"))
]);

export const weightedOrganizationLevelList: OrganizationAspect[] = organizationLevelSorter(
  values(organizationLevels)
);
