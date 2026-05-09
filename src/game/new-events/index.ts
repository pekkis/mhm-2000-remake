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

import arilander from "./arilander";
import attitudeCanada from "./attitude-canada";
import attitudeUSA from "./attitude-usa";
import bankMistake from "./bank-mistake";
import bestManagerEver from "./best-manager-ever";
import bloodbath from "./bloodbath";
import book from "./book";
import boxing from "./boxing";
import cleandrug from "./cleandrug";
import concert from "./concert";
import divisionRally from "./division-rally";
import ehlAward from "./ehl-award";
import ekkanen from "./ekkanen";
import enemyProtest from "./enemy-protest";
import fanMerchandise from "./fan-merchandise";
import florist from "./florist";
import fortuneTeller from "./fortune-teller";
import grossman from "./grossman";
import haanperaDivorce from "./haanpera-divorce";
import habadobo from "./habadobo";
import jarasvuo from "./jarasvuo";
import jarko from "./jarko";
import karijurri from "./karijurri";
import kasino from "./kasino";
import kecklin from "./kecklin";
import limpenius from "./limpenius";
import makrosoft from "./makrosoft";
import masotv from "./masotv";
import mauto from "./mauto";
import metterer from "./metterer";
import moreTaxes from "./more-taxes";
import ogilny from "./ogilny";
import onecky from "./onecky";
import otsohalli from "./otsohalli";
import pakibetteri from "./pakibetteri";
import pauligkahvi from "./pauligkahvi";
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
import randomDude from "./random-dude";
import russianAgent from "./russian-agent";
import saunailta from "./saunailta";
import scoreboard from "./scoreboard";
import sellNarcotics from "./sell-narcotics";
import sopupeli from "./sopupeli";
import stalking from "./stalking";
import suddenDeath from "./sudden-death";
import topGame from "./top-game";
import undqvist from "./undqvist";
import urheiluruuttu from "./urheiluruuttu";
import valiveto from "./valiveto";
import voodoo from "./voodoo";
import workPermits from "./work-permits";
import worstManagerEver from "./worst-manager-ever";
import youStalk from "./you-stalk";

const newEvents = {
  arilander,
  attitudeCanada,
  attitudeUSA,
  bankMistake,
  bestManagerEver,
  bloodbath,
  book,
  boxing,
  cleandrug,
  concert,
  divisionRally,
  ehlAward,
  ekkanen,
  enemyProtest,
  fanMerchandise,
  florist,
  fortuneTeller,
  grossman,
  haanperaDivorce,
  habadobo,
  jarasvuo,
  jarko,
  karijurri,
  kasino,
  kecklin,
  limpenius,
  makrosoft,
  masotv,
  mauto,
  metterer,
  moreTaxes,
  ogilny,
  onecky,
  otsohalli,
  pakibetteri,
  pauligkahvi,
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
  randomDude,
  russianAgent,
  saunailta,
  scoreboard,
  sellNarcotics,
  sopupeli,
  stalking,
  suddenDeath,
  topGame,
  undqvist,
  urheiluruuttu,
  valiveto,
  voodoo,
  workPermits,
  worstManagerEver,
  youStalk
} as const;

export default newEvents;
