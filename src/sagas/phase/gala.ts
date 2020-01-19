import { take, call, select } from "redux-saga/effects";
import { GAME_ADVANCE_REQUEST } from "../../ducks/game";
import { setPhase } from "../game";
import { addNews } from "../news";
import { randomManager } from "../../data/selectors";

export default function* galaPhase() {
  yield call(setPhase, "gala");

  const teams = yield select(state => state.game.get("teams"));
  const managers = yield select(state => state.manager.get("managers"));

  const phlRegularSeason = yield select(state =>
    state.game.getIn(["competitions", "phl", "phases", 0, "groups", 0])
  );

  const phlFinals = yield select(state =>
    state.game.getIn(["competitions", "phl", "phases", 3, "groups", 0])
  );

  const phlLast = teams.get(
    phlRegularSeason
      .get("stats")
      .last()
      .get("id")
  );

  const phlFinalists = phlFinals
    .get("teams")
    .take(2)
    .map(t => teams.get(t));

  const phlBronzists = phlFinals
    .get("teams")
    .takeLast(2)
    .map(t => teams.get(t));

  const divFinals = yield select(state =>
    state.game.getIn(["competitions", "division", "phases", 3, "groups", 0])
  );

  const divFinalists = divFinals
    .get("teams")
    .take(2)
    .map(t => teams.get(t));

  const divRegularSeason = yield select(state =>
    state.game.getIn(["competitions", "division", "phases", 0, "groups", 0])
  );

  const otherManager = yield select(randomManager());

  yield call(
    addNews,
    `Ilmassa on jännitystä, finaalijoukkueet ovat viimein pitkän kauden jälkeen selvillä!`
  );

  yield call(
    addNews,
    `Kotiedun finaalisarjaan saa __${phlFinalists.first().get("name")}__, ${
      phlFinalists.first().get("strength") >=
      phlFinalists.last().get("strength")
        ? `joka lähtee ennakkosuosikkina tuleviin otteluihin!`
        : `mutta joukkue lähteekin altavastaajana mukaan ja tarvitsee etua.`
    }`
  );

  const theManager = phlFinalists.last().get("manager")
    ? managers.get(phlFinalists.last().get("manager"))
    : otherManager;

  yield call(
    addNews,
    `Toinen loppuottelija on __${phlFinalists
      .last()
      .get("name")}__, jonka manageri _${theManager.get(
      "name"
    )}_ on piiskannut hyvään vauhtiin kuluvalla kaudella.`
  );

  yield call(
    addNews,
    `Pronssitaistossa vastakkain ovat  __${phlBronzists
      .first()
      .get("name")}__ ja __${phlBronzists
      .last()
      .get(
        "name"
      )}__. Kolmannen sijan merkitystä ei pidä ollenkaan väheksyä, sillä tuohan se mukanaan paikan _europeleihin._`
  );

  if (
    phlRegularSeason
      .get("stats")
      .findIndex(stat => stat.get("id") === phlBronzists.first()) === 0
  ) {
    yield call(
      addNews,
      `__${phlBronzists.first()}__ voitti runkosarjan, joten sille pronssiotteluun joutuminen on varmasti valtava pettymys.`
    );
  }

  if (
    phlRegularSeason
      .get("stats")
      .findIndex(stat => stat.get("id") === phlBronzists.first().get("id")) >= 6
  ) {
    yield call(
      addNews,
      `__${phlBronzists
        .first()
        .get(
          "name"
        )}__ ylsi hikisesti play-offeihin, ja saa olla tyytyväinen pronssiottelupaikasta!`
    );
  }

  if (
    phlRegularSeason
      .get("stats")
      .findIndex(stat => stat.get("id") === phlBronzists.last().get("id")) >= 6
  ) {
    yield call(
      addNews,
      `Runkosarjassa rämpinyt __${phlBronzists
        .last()
        .get(
          "name"
        )}__ on ollut yksi myöhäiskevään positiiviisimmista yllättäjistä!`
    );
  }

  yield call(
    addNews,
    `Nousukarsinnan finaalissa kohtaavat __${divFinalists
      .first()
      .get("name")}__ ja __${divFinalists.last().get("name")}__.`
  );

  if (phlRegularSeason.get("teams").includes(divFinalists.first().get("id"))) {
    yield call(
      addNews,
      `__${divFinalists
        .first()
        .get(
          "name"
        )}__ on läpikäynyt kovan kauden liigassa, ja voisi olettaa tämän kokemuksen antavan heille edun haastajaa vastaan.`
    );
  } else {
    yield call(
      addNews,
      `Liigassa pelannut __${phlLast.get(
        "name"
      )}__ ei ole enää mukana nousukarsinnoissa. Kotiedun finaaliin saa siten __${divFinalists
        .first()
        .get("name")}__`
    );
    yield call(
      addNews,
      `Liigaseuran semifinaalissa niputtanut __${divFinalists
        .last()
        .get("name")}__ lähtee todella nälkäisenä finaaliin.`
    );
  }

  for (const divFinalist of divFinalists) {
    const ranking = divRegularSeason
      .get("stats")
      .findIndex(stat => stat.get("id") === divFinalist.get("id"));

    if (ranking === 0) {
      yield call(
        addNews,
        `Divisioonan runkosarjan voittanut __${divFinalist.get(
          "name"
        )}__ katselee myös himokkaasti liigan suuntaan.`
      );
    }
  }

  for (const divFinalist of divFinalists) {
    const ranking = divRegularSeason
      .get("stats")
      .findIndex(stat => stat.get("id") === divFinalist.get("id"));

    if (ranking === 4) {
      yield call(
        addNews,
        `Divisioonassa kovin keskinkertaisesti pärjännyt __${divFinalist.get(
          "name"
        )}__ on yllättänyt kaikki jyräämällä vastuttamattomasti tietänsä ylemmälle sarjatasolle.`
      );
    }

    if (ranking === 5) {
      yield call(
        addNews,
        `Viimeisenä divarin jatkopeleihin ponnistanut  __${divFinalist.get(
          "name"
        )}__ on härän vimmalla raivannut vastustajansa pois alta. Miten käynee nyt?`
      );
    }
  }

  yield take(GAME_ADVANCE_REQUEST);
}
