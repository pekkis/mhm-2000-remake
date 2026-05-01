import { amount as a, currency } from "@/services/format";
import type { Manager, ManagerServices } from "@/state/manager";

export type ServiceDefinition = {
  name: string;
  description: (price: number) => string;
  price: (basePrice: number, manager: Manager) => number;
  effect: (competition: string, phase: number) => number;
};

const services: Record<keyof ManagerServices, ServiceDefinition> = {
  cheer: {
    name: "Kannustusryhmä",
    description: (price) =>
      `Palkatut kannattajat kohottavat taistelutahtoa. Ryhmä matkustaa myös vierasotteluihin, ja kustantaa __${currency(
        price
      )}__ / ottelu.`,
    price: (basePrice) => basePrice,
    effect: (competition, phase) => {
      if (phase > 0) {
        return 0;
      }
      if (competition === "division") {
        return 3;
      }
      return 6;
    }
  },
  microphone: {
    name: "Mikrofoni vastustajan vaihtoaitiossa",
    description: (price) =>
      `Salainen mikrofoni vastustajan aitiossa, suoraan valmentajan edessä, antaa yllättävän edun! Vakoilujärjestelmän ylläpito maksaa __${currency(
        price
      )}__ / ottelu, ja on tietenkin olemassa kiinnijäämisen riski. Silloin tuloksena on sakko ja 4 pisteen rangaistus!`,
    price: (basePrice) => basePrice,
    effect: (competition, phase) => {
      if (!["phl", "division"].includes(competition)) {
        return 0;
      }

      if (phase > 0) {
        return 0;
      }

      if (competition === "division") {
        return 5;
      }
      return 10;
    }
  },

  coach: {
    name: "Maalivahtivalmentaja",
    description: (price) =>
      `Entinen huippuveskari, Hari "Hilppa" Jalme, on ryhtynyt valmentajaksi! Hän piiskaa maalivahtinne huippukuntoon ainoastaan __${a(
        price
      )}__ pekalla / ottelu.`,
    price: (basePrice) => basePrice,
    effect: (_competition, phase) => {
      if (phase > 0) {
        return 0;
      }
      return 10;
    }
  },

  insurance: {
    name: "Vakuutus",
    description: (price) =>
      `Vakuutusyhtiö Etelälän kokonaisvaltainen vakuutuspaketti maksaa __${currency(
        price
      )}__ / vuoro, ja antaa suojan vahinkotapauksien varalta. Paitsi silloin kun ketkut vakuutustarkastaja havaitsevat _vilppiä_!`,
    price: (basePrice, manager) =>
      basePrice + (manager.arena.level + 1) * 1000 + manager.insuranceExtra,
    effect: () => 0
  }
};

export default services;
