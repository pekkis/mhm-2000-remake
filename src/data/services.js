import { OrderedMap, Map } from "immutable";
import { amount as a } from "../services/format";

const services = OrderedMap({
  cheer: Map({
    name: "Kannustusryhmä",
    description: price =>
      `Palkatut kannattajat kohottavat taistelutahtoa. Ryhmä matkustaa myös vierasotteluihin, ja kustantaa __${a(
        price
      )}__ pekkaa / ottelu.`,
    price: basePrice => basePrice,
    effect: (competition, phase) => {
      if (phase > 0) {
        return 0;
      }
      if (competition === "division") {
        return 3;
      }
      return 6;
    }
  }),
  microphone: Map({
    name: "Mikrofoni vastustajan vaihtoaitiossa",
    description: price =>
      `Salainen mikrofoni vastustajan aitiossa, suoraan valmentajan edessä, antaa yllättävän edun! Vakoilujärjestelmän ylläpito maksaa __${a(
        price
      )}__ pekkaa / ottelu, ja on tietenkin olemassa kiinnijäämisen riski. Silloin tuloksena on sakko ja 4 pisteen rangaistus!`,
    price: basePrice => basePrice,
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
  }),

  coach: Map({
    name: "Maalivahtivalmentaja",
    description: price =>
      `Entinen huippuveskari, Hari "Hilppa" Jalme, on ryhtynyt valmentajaksi! Hän piiskaa maalivahtinne huippukuntoon ainoastaan __${a(
        price
      )}__ pekalla / ottelu.`,
    price: basePrice => basePrice,
    effect: (competition, phase) => {
      if (phase > 0) {
        return 0;
      }
      return 10;
    }
  }),

  insurance: Map({
    name: "Vakuutus",
    description: price =>
      `Vakuutusyhtiö Etelälän kokonaisvaltainen vakuutuspaketti maksaa __${a(
        price
      )}__ pekkaa / vuoro, ja antaa suojan vahinkotapauksien varalta. Paitsi silloin kun ketkut vakuutustarkastaja havaitsevat _vilppiä_!`,
    price: (basePrice, manager) =>
      basePrice +
      (manager.getIn(["arena", "level"]) + 1) * 1000 +
      manager.get("insuranceExtra"),
    effect: () => 0
  })
});

export default services;

/*
IF veikko = 1 AND dotte = 0 THEN LOCATE 8, 1: PRINT "Vakuutusmaksusi: "; 1000 * hjalli + palo
*/
