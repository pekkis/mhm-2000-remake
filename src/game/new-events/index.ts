/**
 * Declarative event registry. All 96 events from the legacy saga
 * system (`@/game/events/`) ported to pure
 * `(ctx, data) => EventEffect[]` form.
 *
 * `as const` (no `satisfies Record<…, DeclarativeEvent<…>>`):
 * `DeclarativeEvent` is contravariant in `TData` because of
 * `render(data: TData)`, so a heterogeneous registry can't be
 * widened to a single base type without losing per-event payload
 * typing at lookup sites. Mirrors the legacy `src/game/events.ts`
 * pattern.
 *
 * **Saga-side bugs preserved as 1-1 ports** (flagged for a future
 * BASIC parity audit):
 * - `ehlAward` is a literal duplicate of `fortuneTeller`
 * - the saga `ralliala.ts` mis-declared its id as `"cleandrug"`,
 *   so legacy `ralliala` rolls were silently swallowed by the
 *   real cleandrug event. Fixed here (correct id `"ralliala"`).
 * - `arenaBurns` drops the BASIC `IF vai = 4 THEN hjalli = hjalli - 1`
 *   extra arena decrement and uses `arena.level <= 5` instead of
 *   BASIC's `< 7`.
 */

import abcd from "./abcd";
import allgoSuccess from "./allgo-success";
import arenaBurns from "./arena-burns";
import arilander from "./arilander";
import attitudeCanada from "./attitude-canada";
import attitudeUSA from "./attitude-usa";
import bankMistake from "./bank-mistake";
import bazookaStrike from "./bazooka-strike";
import bestManagerEver from "./best-manager-ever";
import bloodbath from "./bloodbath";
import book from "./book";
import boxing from "./boxing";
import cleandrug from "./cleandrug";
import concert from "./concert";
import divisionRally from "./division-rally";
import ehlAward from "./ehl-award";
import ekkanen from "./ekkanen";
import embezzlement from "./embezzlement";
import enemyProtest from "./enemy-protest";
import etelalaAscends from "./etelala-ascends";
import etelalaBonusFrenzy from "./etelala-bonusfrenzy";
import etelalaDescends from "./etelala-descends";
import etelalaGlitch from "./etelala-glitch";
import fanMerchandise from "./fan-merchandise";
import fever from "./fever";
import florist from "./florist";
import foreignLegion from "./foreign-legion";
import fortuneTeller from "./fortune-teller";
import grossman from "./grossman";
import haanperaDivorce from "./haanpera-divorce";
import haanperaMarries from "./haanpera-marries";
import habadobo from "./habadobo";
import hasselgren from "./hasselgren";
import hirmukunto from "./hirmukunto";
import incredibleFeeling from "./incredible-feeling";
import jaralahti from "./jaralahti";
import jarasvuo from "./jarasvuo";
import jarko from "./jarko";
import jatovrel from "./jatovrel";
import jobofferDivision from "./joboffer-division";
import jobofferPHL from "./joboffer-phl";
import juznetsov from "./juznetsov";
import karijurri from "./karijurri";
import kasino from "./kasino";
import kecklin from "./kecklin";
import kuralahti from "./kuralahti";
import laskisalonen from "./laskisalonen";
import limpenius from "./limpenius";
import makrosoft from "./makrosoft";
import masotv from "./masotv";
import mauto from "./mauto";
import mcHabadobo from "./mc-habadobo";
import metterer from "./metterer";
import moneyTroubles from "./money-troubles";
import moreTaxes from "./more-taxes";
import ogilny from "./ogilny";
import onecky from "./onecky";
import otsohalli from "./otsohalli";
import paajanen from "./paajanen";
import pakibetteri from "./pakibetteri";
import pauligkahvi from "./pauligkahvi";
import pekkiini from "./pekkiini";
import pempers from "./pempers";
import pertinPselit from "./pertin-pselit";
import phlRally from "./phl-rally";
import pirka from "./pirka";
import protest from "./protest";
import pstudio from "./pstudio";
import psychoAttack from "./psycho-attack";
import psychoMail from "./psycho-mail";
import psychoRelease from "./psycho-release";
import ralliala from "./ralliala";
import ramirez from "./ramirez";
import randomDude from "./random-dude";
import russianAgent from "./russian-agent";
import saunailta from "./saunailta";
import scoreboard from "./scoreboard";
import sellNarcotics from "./sell-narcotics";
import simonovSuccess from "./simonov-success";
import sopupeli from "./sopupeli";
import stalking from "./stalking";
import strategyFailure from "./strategy-failure";
import strategySuccess from "./strategy-success";
import suddenDeath from "./sudden-death";
import swedenTransfer from "./sweden-transfer";
import taxEvasion from "./tax-evasion";
import topGame from "./top-game";
import ultimateCruelty from "./ultimate-cruelty";
import undqvist from "./undqvist";
import urheiluruuttu from "./urheiluruuttu";
import valiveto from "./valiveto";
import voodoo from "./voodoo";
import workPermits from "./work-permits";
import worstManagerEver from "./worst-manager-ever";
import yhteispeli from "./yhteispeli";
import youStalk from "./you-stalk";

const newEvents = {
  abcd,
  allgoSuccess,
  arenaBurns,
  arilander,
  attitudeCanada,
  attitudeUSA,
  bankMistake,
  bazookaStrike,
  bestManagerEver,
  bloodbath,
  book,
  boxing,
  cleandrug,
  concert,
  divisionRally,
  ehlAward,
  ekkanen,
  embezzlement,
  enemyProtest,
  etelalaAscends,
  etelalaBonusFrenzy,
  etelalaDescends,
  etelalaGlitch,
  fanMerchandise,
  fever,
  florist,
  foreignLegion,
  fortuneTeller,
  grossman,
  haanperaDivorce,
  haanperaMarries,
  habadobo,
  hasselgren,
  hirmukunto,
  incredibleFeeling,
  jaralahti,
  jarasvuo,
  jarko,
  jatovrel,
  jobofferDivision,
  jobofferPHL,
  juznetsov,
  karijurri,
  kasino,
  kecklin,
  kuralahti,
  laskisalonen,
  limpenius,
  makrosoft,
  masotv,
  mauto,
  mcHabadobo,
  metterer,
  moneyTroubles,
  moreTaxes,
  ogilny,
  onecky,
  otsohalli,
  paajanen,
  pakibetteri,
  pauligkahvi,
  pekkiini,
  pempers,
  pertinPselit,
  phlRally,
  pirka,
  protest,
  pstudio,
  psychoAttack,
  psychoMail,
  psychoRelease,
  ralliala,
  ramirez,
  randomDude,
  russianAgent,
  saunailta,
  scoreboard,
  sellNarcotics,
  simonovSuccess,
  sopupeli,
  stalking,
  strategyFailure,
  strategySuccess,
  suddenDeath,
  swedenTransfer,
  taxEvasion,
  topGame,
  ultimateCruelty,
  undqvist,
  urheiluruuttu,
  valiveto,
  voodoo,
  workPermits,
  worstManagerEver,
  yhteispeli,
  youStalk
} as const;

export default newEvents;
