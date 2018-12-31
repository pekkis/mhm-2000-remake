import { Map, List } from "immutable";
import { select, put } from "redux-saga/effects";
import { playerCompetesIn, playersDifficulty } from "../selectors";
import { amount as a } from "../../services/format";

/*
sat13:
IF sarja = 1 THEN matky = 100000
IF sarja = 2 THEN matky = 50000
IF vai > 3 THEN matky = matky + 40000
IF vai < 2 THEN matky = matky - 20000
PRINT "Aaaaargh! Verokarhu p„„tt„„ m„tk„ist„ "; matky; " pekan lis„veron joukkueellesi!"
raha = raha - matky
*/

const getAmount = (competesInPHL, difficulty) => {
  let amount = competesInPHL ? 100000 : 50000;

  console.log("difficulty");

  if ([2, 3].includes(difficulty)) {
    return amount;
  }

  if ([4, 5].includes(difficulty)) {
    return amount + 40000;
  }

  return amount - 20000;
};

const texts = data => {
  return List.of(
    `Aaaaargh! Verokarhu päättää mätkäistä ${a(
      data.get("amount")
    )} pekan lisäveron joukkueellesi!`
  );
};

const eventId = "moreTaxes";

const event = {
  type: "player",

  create: function*(data) {
    const { player } = data;

    const competesInPHL = yield select(playerCompetesIn(player, "phl"));
    const difficulty = yield select(playersDifficulty(player));

    const amount = getAmount(competesInPHL, difficulty);

    yield put({
      type: "EVENT_ADD",
      payload: {
        event: Map({
          eventId,
          player,
          resolved: true,
          amount
        })
      }
    });

    return;
  },

  render: texts,

  process: function*(data) {
    yield put({
      type: "PLAYER_DECREMENT_BALANCE",
      payload: {
        player: data.get("player"),
        amount: data.get("amount")
      }
    });
  }
};

export default event;
