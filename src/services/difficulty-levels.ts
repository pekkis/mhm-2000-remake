import { DifficultyLevelMap } from "../types/base";

/*
  "Tämä aloittelijoille ja helpon menestyksen ystäville tarkoitettu taso tekee menestymisestä helppoa: sponsorit antavat kottikärryittäin rahaa, tietokoneen managerit rakastavat sinua ja kaikki on halpaa!",
  "Kynsiä ei tarvitse pureskella tätä vaikeustasoa käyttäessä. Pokaaleja ei kanneta sinulle hopeatarjottimella, vaan joudut itse hakemaan tarjottimen metrin päästä.",
  "MHM 2000:n perustaso tarjoaa keskitasoista haastetta kaikin puolin: menestyksen eteen saa nähdä jo vähän vaivaakin.",
  "Vahvan elämyksen ystäville. Kaikki maksaa, sponsorit ovat pihejä ja tietokoneen managerit eivät pidä sinusta. Menestys on työn ja tuskan takana.",
  "Tätä vaikeustasoa käyttäessäsi saat varautua ikävyyksiin kaikilla osa-alueilla: kukaan ei halua nähdä sinun menestyvän. Kaikki tekevät kaikkensa (!) kampittaakseen sinut.",
*/

/*
13,-5
10,-10
10,-10
10,-10
7,-15
*/

const difficultyLevels: DifficultyLevelMap = {
  1: {
    value: 1,
    name: "Nörttivatsa",
    description:
      "Tämä aloittelijoille ja helpon menestyksen ystäville tarkoitettu taso tekee menestymisestä helppoa: sponsorit antavat kottikärryittäin rahaa, tietokoneen managerit rakastavat sinua ja kaikki on halpaa!",
    moraleMin: -5,
    moraleMax: 13,
    moraleBoost: 1,
    startBalance: 1000000,
    pranksPerSeason: 5,
    extra: 3000,
    salary: competition => {
      return competition === "phl" ? 2600 : 2000;
    },
    rallyMorale: 33,
    rallyExtra: competition => {
      return competition === "phl" ? 40000 : 10000;
    }
  },
  2: {
    value: 2,
    name: "Maitovatsa",
    description:
      "Kynsiä ei tarvitse pureskella tätä vaikeustasoa käyttäessä. Pokaaleja ei kanneta sinulle hopeatarjottimella, vaan joudut itse hakemaan tarjottimen metrin päästä.",
    moraleMin: -10,
    moraleMax: 10,
    moraleBoost: 1,
    startBalance: 500000,
    pranksPerSeason: 4,
    extra: 0,
    salary: competition => {
      return competition === "phl" ? 3000 : 2350;
    },
    rallyMorale: 33,
    rallyExtra: competition => {
      return competition === "phl" ? 35000 : 10000;
    }
  },

  3: {
    value: 3,
    name: "Kahvivatsa",
    description:
      "MHM 2000:n perustaso tarjoaa keskitasoista haastetta kaikin puolin: menestyksen eteen saa nähdä jo vähän vaivaakin.",
    moraleMin: -10,
    moraleMax: 10,
    moraleBoost: 0,
    // startBalance: 0,
    startBalance: 0,
    pranksPerSeason: 3,
    extra: 0,
    salary: competition => {
      return competition === "phl" ? 3200 : 2700;
    },
    rallyMorale: 33,
    rallyExtra: competition => {
      return competition === "phl" ? 30000 : 10000;
    }
  },

  4: {
    value: 4,
    name: "Haavavatsa",
    description:
      "Vahvan elämyksen ystäville. Kaikki maksaa, sponsorit ovat pihejä ja tietokoneen managerit eivät pidä sinusta. Menestys on työn ja tuskan takana.",
    moraleMin: -0,
    moraleMax: 10,
    moraleBoost: -1,
    startBalance: -250000,
    pranksPerSeason: 2,
    extra: -3000,
    salary: competition => {
      return competition === "phl" ? 3500 : 2900;
    },
    rallyMorale: 33,
    rallyExtra: competition => {
      return competition === "phl" ? 25000 : 10000;
    }
  },
  5: {
    value: 5,
    name: "Katarrivatsa",
    description:
      "Tätä vaikeustasoa käyttäessäsi saat varautua ikävyyksiin kaikilla osa-alueilla: kukaan ei halua nähdä sinun menestyvän. Kaikki tekevät kaikkensa (!) kampittaakseen sinut.",
    moraleMin: -15,
    moraleMax: 7,
    moraleBoost: -1,
    startBalance: -600000,
    pranksPerSeason: 1,
    extra: -3000,
    salary: competition => {
      return competition === "phl" ? 4000 : 3200;
    },
    rallyMorale: 15,
    rallyExtra: competition => {
      return competition === "phl" ? 20000 : 10000;
    }
  }
};

export default difficultyLevels;
