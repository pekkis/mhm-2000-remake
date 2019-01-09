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

import fortuneTeller from "./events/fortune-teller";
import voodoo from "./events/voodoo";
import stalking from "./events/stalking";
import fanMerchandise from "./events/fan-merchandise";
import embezzlement from "./events/embezzlement";
import masotv from "./events/masotv";

import jobofferPHL from "./events/joboffer-phl";
import undqvist from "./events/undqvist";
import jobofferDivision from "./events/joboffer-division";
import fever from "./events/fever";
import haanperaMarries from "./events/haanpera-marries";
import haanperaDivorce from "./events/haanpera-divorce";
import pempers from "./events/pempers";
import limpenius from "./events/limpenius";

import hasselgren from "./events/hasselgren";
import arilander from "./events/arilander";
import karijurri from "./events/karijurri";
import metterer from "./events/metterer";
import arenaBurns from "./events/arena-burns";
import valiveto from "./events/valiveto";
import bankMistake from "./events/bank-mistake";
import pekkiini from "./events/pekkiini";
import enemyProtest from "./events/enemy-protest";
import urheiluruuttu from "./events/urheiluruuttu";
import pstudio from "./events/pstudio";
import ekkanen from "./events/ekkanen";
import makrosoft from "./events/makrosoft";
import jarasvuo from "./events/jarasvuo";
import laskisalonen from "./events/laskisalonen";
import kecklin from "./events/kecklin";
import pakibetteri from "./events/pakibetteri";

/* non-random events */

import protest from "./events/protest";
import bazookaStrike from "./events/bazooka-strike";
import sellNarcotics from "./events/sell-narcotics";

const events = Map({
  protest,
  sellNarcotics,
  bazookaStrike,

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
  cleandrug,

  fortuneTeller,
  voodoo,
  stalking,
  fanMerchandise,
  embezzlement,
  masotv,
  jobofferPHL,
  undqvist,
  jobofferDivision,
  fever,
  haanperaMarries,
  haanperaDivorce,
  pempers,
  limpenius,
  hasselgren,
  arilander,
  karijurri,
  metterer,
  arenaBurns,
  valiveto,
  bankMistake,
  pekkiini,
  enemyProtest,
  urheiluruuttu,
  pstudio,
  ekkanen,
  makrosoft,
  jarasvuo,
  laskisalonen,
  kecklin,
  pakibetteri
});

export default events;
