import { random } from "@/services/random";
import type { Manager, Team } from "@/state/game";

type BlurbParams = {
  team: Team;
  fired: Manager;
  current: Manager;
};

type BlurbVars = {
  team: string;
  fired: string;
  replacement: string;
};

const firingBlurbs = [
  ({ team, fired, replacement }: BlurbVars) =>
    `**${team}** on johtokunnan kokouksessa päättänyt seuraavaa: Manageri **${fired}** ei enää työskentele joukkueen hyväksi. Joukkueen uusi manageri on **${replacement}**.`,
  ({ team, fired, replacement }: BlurbVars) =>
    `**${team}** vaihtaa manageria: kengänkuvan takalistoonsa saa **${fired}**. Tästä päivästä alkaen managerointivastuun kantaja on **${replacement}**.`,
  ({ team, fired, replacement }: BlurbVars) =>
    `**${team}** julistaa johtokunnan hätäkokouksen jälkeen seuraavan ilmoituksen: **${replacement}** on organisaation uusi manageri. Hänen edeltäjänsä, **${fired}**, on passitettu tylysti kilometritehtaalle.`,
  ({ team, fired, replacement }: BlurbVars) =>
    `**${team}** on päätynyt seuraavanlaiseen ratkaisuun: manageri **${fired}** saa lähteä, tilalle palkataan välittömästi **${replacement}**.`,
  ({ team, fired, replacement }: BlurbVars) =>
    `**${team}** erottaa managerinsa - **${fired}** lentää pellolle kuin leppäkeihäs. Miehen paikan penkin päässä ottaa jo seuraavassa ottelussa **${replacement}**.`,
  ({ team, fired, replacement }: BlurbVars) =>
    `**${team}** julkistaa suuren muutoksen organisaatiossaan: manageri **${fired}** ei enää kuulu muonavahvuuteen. Managerointivastuun kantaa tästedes **${replacement}**.`
];

export const getManagerFiredBlurb = ({ team, fired, current }: BlurbParams) => {
  const vars: BlurbVars = {
    team: team.name,
    fired: fired.name,
    replacement: current.name
  };
  return firingBlurbs[random.integer(0, 5)](vars);
};
