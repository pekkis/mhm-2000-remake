import { Map } from "immutable";

import pirka from "./events/pirka";
import kasino from "./events/kasino";
import mauto from "./events/mauto";
import jaralahti from "./events/jaralahti";
import kuralahti from "./events/kuralahti";
import russianAgent from "./events/russian-agent";
import taxEvasion from "./events/tax-evasion";
import suddenDeath from "./events/sudden-death";
import ralliala from "./events/ralliala";

import concert from "./events/concert";
import swedenTransfer from "./events/sweden-transfer";
import jarko from "./events/jarko";
import moreTaxes from "./events/more-taxes";

import cleandrug from "./events/cleandrug";

/* non-random events */

import protest from "./events/protest";

const events = Map({
  protest,

  pirka,
  kasino,
  mauto,
  jaralahti,
  kuralahti,
  russianAgent,
  taxEvasion,
  suddenDeath,
  ralliala,
  concert,
  swedenTransfer,
  jarko,
  moreTaxes,
  cleandrug
});

export default events;
