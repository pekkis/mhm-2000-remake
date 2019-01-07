import { List, Map } from "immutable";

/*
IF vai = 1 AND mo < -6 THEN mo = -6
IF vai = 2 AND mo < -10 THEN mo = -10
IF vai = 3 AND mo < -14 THEN mo = -14
IF vai = 4 AND mo < -18 THEN mo = -18
IF vai = 5 AND mo < -22 THEN mo = -22
IF mo > 12 THEN mo = 12
IF vai = 5 AND mo > 8 THEN mo = 8

IF vai$ = "1" THEN vai = 1: banki = 1: ghalli = 1: moplus = 1: raha = 1000000: GOTO hgg
IF vai$ = "2" THEN vai = 2: banki = 1: ghalli = 0: moplus = 1: raha = 500000: GOTO hgg
IF vai$ = "3" THEN vai = 3: banki = 0: ghalli = 0: moplus = 0: raha = 0: GOTO hgg
IF vai$ = "4" THEN vai = 4: banki = 0: ghalli = 0: moplus = -1: raha = -250000: GOTO hgg
IF vai$ = "5" THEN vai = 5: banki = 0: ghalli = 0: moplus = -1: raha = -600000: GOTO hgg
*/

const difficultyLevels = List.of(
  Map({
    value: "0",
    name: "Nörttivatsa",
    description: "Sokeria, sokeria!",
    moraleMin: -6,
    moraleMax: 12,
    moraleBoost: 1,
    startBalance: 1000000,
    pranksPerSeason: 5
  }),
  Map({
    value: "1",
    name: "Maitovatsa",
    description: "Rutkasti maitoa, kiitos!",
    moraleMin: 10,
    moraleMax: 12,
    moraleBoost: 1,
    startBalance: 500000,
    pranksPerSeason: 4
  }),
  Map({
    value: "2",
    name: "Kahvivatsa",
    description: "Kahvi kahvina, maito maitona",
    moraleMin: -14,
    moraleMax: 12,
    moraleBoost: 0,
    // startBalance: 0,
    startBalance: 0,
    pranksPerSeason: 3
  }),
  Map({
    value: "3",
    name: "Vatsahaava",
    description: "Vahvan elämyksen ystäville",
    moraleMin: -18,
    moraleMax: 12,
    moraleBoost: -1,
    startBalance: -250000,
    pranksPerSeason: 2
  }),
  Map({
    value: "4",
    name: "Vatsakatarri",
    description: "Todellista tervanjuontia",
    moraleMin: -22,
    moraleMax: 8,
    moraleBoost: -1,
    startBalance: -600000,
    pranksPerSeason: 1
  })
);

export default difficultyLevels;
