import { randomManager } from "@/machines/selectors";
import type { GameContext } from "@/state";
import type { TeamStat } from "@/types/competitions";
import type { Draft } from "immer";

export const runGala = (draft: Draft<GameContext>) => {
  const teams = draft.teams;
  const managers = draft.managers;

  const phlRegularSeason = draft.competitions.phl.phases[0].groups[0];
  const phlFinals = draft.competitions.phl.phases[3].groups[0];
  const divFinals = draft.competitions.division.phases[3].groups[0];
  const divRegularSeason = draft.competitions.division.phases[0].groups[0];

  const phlRegStats = phlRegularSeason.stats as TeamStat[];
  const divRegStats = divRegularSeason.stats as TeamStat[];

  const phlLast = teams[phlRegStats[phlRegStats.length - 1].id];
  const phlFinalists = phlFinals.teams.slice(0, 2).map((t) => teams[t]);
  const phlBronzists = phlFinals.teams.slice(-2).map((t) => teams[t]);
  const divFinalists = divFinals.teams.slice(0, 2).map((t) => teams[t]);

  const otherManager = randomManager()(draft);

  const push = (line: string) => {
    draft.news.news.push(line);
  };

  push(
    `Ilmassa on jännitystä, finaalijoukkueet ovat viimein pitkän kauden jälkeen selvillä!`
  );

  push(
    `Kotiedun finaalisarjaan saa __${phlFinalists[0].name}__, ${
      phlFinalists[0].strength >= phlFinalists[phlFinalists.length - 1].strength
        ? `joka lähtee ennakkosuosikkina tuleviin otteluihin!`
        : `mutta joukkue lähteekin altavastaajana mukaan ja tarvitsee etua.`
    }`
  );

  const finalUnderdog = phlFinalists[phlFinalists.length - 1];
  const theManager = finalUnderdog.manager
    ? managers[finalUnderdog.manager]
    : otherManager;

  push(
    `Toinen loppuottelija on __${finalUnderdog.name}__, jonka manageri _${theManager.name}_ on piiskannut hyvään vauhtiin kuluvalla kaudella.`
  );

  push(
    `Pronssitaistossa vastakkain ovat  __${phlBronzists[0].name}__ ja __${phlBronzists[phlBronzists.length - 1].name}__. Kolmannen sijan merkitystä ei pidä ollenkaan väheksyä, sillä tuohan se mukanaan paikan _europeleihin._`
  );

  const bronze0Rank = phlRegStats.findIndex((s) => s.id === phlBronzists[0].id);
  const bronze1Rank = phlRegStats.findIndex(
    (s) => s.id === phlBronzists[phlBronzists.length - 1].id
  );

  if (bronze0Rank === 0) {
    push(
      `__${phlBronzists[0].name}__ voitti runkosarjan, joten sille pronssiotteluun joutuminen on varmasti valtava pettymys.`
    );
  }

  if (bronze0Rank >= 6) {
    push(
      `__${phlBronzists[0].name}__ ylsi hikisesti play-offeihin, ja saa olla tyytyväinen pronssiottelupaikasta!`
    );
  }

  if (bronze1Rank >= 6) {
    push(
      `Runkosarjassa rämpinyt __${phlBronzists[phlBronzists.length - 1].name}__ on ollut yksi myöhäiskevään positiiviisimmista yllättäjistä!`
    );
  }

  push(
    `Nousukarsinnan finaalissa kohtaavat __${divFinalists[0].name}__ ja __${divFinalists[divFinalists.length - 1].name}__.`
  );

  if (phlRegularSeason.teams.includes(divFinalists[0].id)) {
    push(
      `__${divFinalists[0].name}__ on läpikäynyt kovan kauden liigassa, ja voisi olettaa tämän kokemuksen antavan heille edun haastajaa vastaan.`
    );
  } else {
    push(
      `Liigassa pelannut __${phlLast.name}__ ei ole enää mukana nousukarsinnoissa. Kotiedun finaaliin saa siten __${divFinalists[0].name}__`
    );
    push(
      `Liigaseuran semifinaalissa niputtanut __${divFinalists[divFinalists.length - 1].name}__ lähtee todella nälkäisenä finaaliin.`
    );
  }

  for (const divFinalist of divFinalists) {
    const ranking = divRegStats.findIndex((s) => s.id === divFinalist.id);
    if (ranking === 0) {
      push(
        `Divisioonan runkosarjan voittanut __${divFinalist.name}__ katselee myös himokkaasti liigan suuntaan.`
      );
    }
  }

  for (const divFinalist of divFinalists) {
    const ranking = divRegStats.findIndex((s) => s.id === divFinalist.id);
    if (ranking === 4) {
      push(
        `Divisioonassa kovin keskinkertaisesti pärjännyt __${divFinalist.name}__ on yllättänyt kaikki jyräämällä vastuttamattomasti tietänsä ylemmälle sarjatasolle.`
      );
    }
    if (ranking === 5) {
      push(
        `Viimeisenä divarin jatkopeleihin ponnistanut  __${divFinalist.name}__ on härän vimmalla raivannut vastustajansa pois alta. Miten käynee nyt?`
      );
    }
  }
};
