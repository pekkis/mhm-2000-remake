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
import book from "./book";
import boxing from "./boxing";
import cleandrug from "./cleandrug";
import ehlAward from "./ehl-award";
import enemyProtest from "./enemy-protest";
import fanMerchandise from "./fan-merchandise";
import fortuneTeller from "./fortune-teller";
import grossman from "./grossman";
import habadobo from "./habadobo";
import karijurri from "./karijurri";
import kasino from "./kasino";
import kecklin from "./kecklin";
import limpenius from "./limpenius";
import masotv from "./masotv";
import metterer from "./metterer";
import moreTaxes from "./more-taxes";
import ogilny from "./ogilny";
import onecky from "./onecky";
import pakibetteri from "./pakibetteri";
import pauligkahvi from "./pauligkahvi";
import pempers from "./pempers";
import pertinPselit from "./pertin-pselit";
import pirka from "./pirka";
import protest from "./protest";
import pstudio from "./pstudio";
import psychoAttack from "./psycho-attack";
import psychoMail from "./psycho-mail";
import psychoRelease from "./psycho-release";
import ralliala from "./ralliala";
import saunailta from "./saunailta";
import sopupeli from "./sopupeli";
import stalking from "./stalking";
import suddenDeath from "./sudden-death";
import topGame from "./top-game";
import undqvist from "./undqvist";
import urheiluruuttu from "./urheiluruuttu";
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
  book,
  boxing,
  cleandrug,
  ehlAward,
  enemyProtest,
  fanMerchandise,
  fortuneTeller,
  grossman,
  habadobo,
  karijurri,
  kasino,
  kecklin,
  limpenius,
  masotv,
  metterer,
  moreTaxes,
  ogilny,
  onecky,
  pakibetteri,
  pauligkahvi,
  pempers,
  pertinPselit,
  pirka,
  protest,
  pstudio,
  psychoAttack,
  psychoMail,
  psychoRelease,
  ralliala,
  saunailta,
  sopupeli,
  stalking,
  suddenDeath,
  topGame,
  undqvist,
  urheiluruuttu,
  voodoo,
  workPermits,
  worstManagerEver,
  youStalk
} as const;

export default newEvents;
