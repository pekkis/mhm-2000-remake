import { List, Map } from "immutable";
import { put } from "redux-saga/effects";

import pirka from "./events/pirka";
import kasino from "./events/kasino";

/*
x = CINT(14 * RND) + 1
PRINT "Manageri "; lm(x); " kytt„„ paikkaa joukkueessa."
PRINT "Mies tunnetaan tappavan raskaista harjoituksistaan ja pirullisuudestaan,"
PRINT "joten pelko romahduttaa moraalin vaikkei jutussa olekaan per„„!"
mo = mo - 40
*/

const events = List.of(pirka, kasino);

export default events;
