import { List } from "immutable";

const difficultyLevels = List.of(
  {
    value: "1",
    name: "Nörttivatsa",
    description: "Sokeria, sokeria!"
  },
  {
    value: "2",
    name: "Maitovatsa",
    description: "Rutkasti maitoa, kiitos!"
  },
  {
    value: "3",
    name: "Kahvivatsa",
    description: "Kahvi kahvina, maito maitona"
  },
  {
    value: "4",
    name: "Vatsahaava",
    description: "Vahvan elämyksen ystäville"
  },
  {
    value: "5",
    name: "Vatsakatarri",
    description: "Todellista tervanjuontia"
  }
);

export default difficultyLevels;
