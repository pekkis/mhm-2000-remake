import { List, Map } from "immutable";

const managers = List.of(
  "Marcó Harcimó",
  "Franco M. Berg",
  "Hannes DeAnsas",
  "Carlos Numminen",
  "Marty Saariganges",
  "Per von Bachman",
  "Micho Magelä",
  "Sven Stenvall",
  "Curt Lindman",
  "Jannu Hortikka",
  "Kari P.A. Sietilä",
  "Sulpo Ahonen",
  "Aimo S. Rummanen",
  "Juri Simonov",
  "Nykan Hågren",
  "Juri Simonov Jr."
).map((name, id) => {
  return Map({
    name,
    id
  });
});

export default managers;
