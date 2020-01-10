import { mapIndexed } from "ramda-adjunct";

const managers = mapIndexed((name: string, id: number) => ({
  name,
  id
}))([
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
]);

export default managers;
