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
import juznetsov from "./events/juznetsov";
import workPermits from "./events/work-permits";
import ogilny from "./events/ogilny";
import abcd from "./events/abcd";
import hirmukunto from "./events/hirmukunto";
import divisionRally from "./events/division-rally";
import phlRally from "./events/phl-rally";
import otsohalli from "./events/otsohalli";
import sopupeli from "./events/sopupeli";
import yhteispeli from "./events/yhteispeli";
import habadobo from "./events/habadobo";
import jatovrel from "./events/jatovrel";
import pertinPselit from "./events/pertin-pselit";
import youStalk from "./events/you-stalk";
import paajanen from "./events/paajanen";
import saunailta from "./events/saunailta";
import bestManagerEver from "./events/best-manager-ever";
import worstManagerEver from "./events/worst-manager-ever";
import florist from "./events/florist";
import moneyTroubles from "./events/money-troubles";
import pauligkahvi from "./events/pauligkahvi";
import randomDude from "./events/random-dude";
import onecky from "./events/onecky";
import mcHabadobo from "./events/mc-habadobo";
import ultimateCruelty from "./events/ultimate-cruelty";
import etelalaAscends from "./events/etelala-ascends";
import etelalaDescends from "./events/etelala-descends";
import etelalaBonusFrenzy from "./events/etelala-bonusfrenzy";
import etelalaGlitch from "./events/etelala-glitch";

/* non-random events */

import topGame from "./events/top-game";
import protest from "./events/protest";
import bazookaStrike from "./events/bazooka-strike";
import sellNarcotics from "./events/sell-narcotics";

const events = Map({
  protest,
  sellNarcotics,
  bazookaStrike,
  topGame,

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
  pakibetteri,
  juznetsov,
  workPermits,
  ogilny,
  abcd,
  hirmukunto,
  divisionRally,
  phlRally,
  otsohalli,
  sopupeli,
  yhteispeli,
  habadobo,
  jatovrel,
  pertinPselit,
  youStalk,
  paajanen,
  saunailta,
  bestManagerEver,
  worstManagerEver,
  florist,
  moneyTroubles,
  pauligkahvi,
  randomDude,
  onecky,
  mcHabadobo,
  ultimateCruelty,
  etelalaAscends,
  etelalaDescends,
  etelalaBonusFrenzy,
  etelalaGlitch
});

export default events;
