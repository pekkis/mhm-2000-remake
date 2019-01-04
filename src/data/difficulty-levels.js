import { List, Map } from "immutable";

const difficultyLevels = List.of(
  Map({
    value: "1",
    name: "Nörttivatsa",
    description: "Sokeria, sokeria!",
    minMorale: -6,
    maxMorale: 12
  }),
  Map({
    value: "2",
    name: "Maitovatsa",
    description: "Rutkasti maitoa, kiitos!",
    minMorale: -6,
    maxMorale: 12
  }),
  Map({
    value: "3",
    name: "Kahvivatsa",
    description: "Kahvi kahvina, maito maitona",
    minMorale: -6,
    maxMorale: 12
  }),
  Map({
    value: "4",
    name: "Vatsahaava",
    description: "Vahvan elämyksen ystäville",
    minMorale: -6,
    maxMorale: 12
  }),
  Map({
    value: "5",
    name: "Vatsakatarri",
    description: "Todellista tervanjuontia",
    minMorale: -6,
    maxMorale: 12
  })
);

export default difficultyLevels;
