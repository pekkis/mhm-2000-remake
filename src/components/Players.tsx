import { useState, type FC, type ReactNode } from "react";
import { prop, sortBy, values } from "remeda";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "@mantine/hooks";
import ManagerInfo from "./ManagerInfo";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";
import Cluster from "@/components/ui/Cluster";
import Paragraph from "@/components/ui/Paragraph";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Tabs, { type TabItem } from "@/components/ui/Tabs";
import { Table, Td, Th } from "@/components/ui/Table";
import { useGameContext } from "@/context/game-machine-context";
import { activeManager, managersTeam } from "@/machines/selectors";
import { performanceModifier } from "@/services/lineup";
import {
  playerSpecialtyDisplayNames,
  PLAYER_SPECIALTY_SENTINELS
} from "@/data/player-specialties";
import { countries } from "@/data/countries";
import type { HiredPlayer, Contract } from "@/state/player";
import type { HumanTeam } from "@/state/game";

/**
 * WIP port of QB `SUB katsopel` (`ILEX5.BAS:2391`), reached via the
 * `a` ("PELAAJAT") hotkey on the action menu (`ILEX5.BAS:399`).
 *
 * QB layout (from `katsopel`):
 *   - Header line: P-RINKI (team tier), P.B (player budget), K-IK / K-TA
 *     / K-KA (mean age / skill / charisma) — printed at `ILEX5.BAS:2407-2415`.
 *   - Four sub-pages cycled via ←/→: TILAST., SOPIM., ERIK., RUNKOS.
 *     The last is only present `IF kr > 68` (playoffs).
 *   - Per-row columns from Y.MHM record 35:
 *     `NIMI  KAN PP IK JO KA  TA YV AV  TILA`
 *     plus per-page columns from records 36..39.
 *   - Per-player keyboard actions (printed in `actionprint`, dispatched
 *     in the `katsopel` switch around `:2452-2464`):
 *     `c` = set captain, `e` = sopimusext (extend contract),
 *     `t` = CCCP-tabletti, `k` = karismakoulutus, `p` = vapauta,
 *     `z` = zombipulveri, `m` = muilutus toggle on enforcer.
 *
 * What we DON'T model yet (TODO tags in JSX):
 *   - Captain (`kapu(pv)`) — no TS field on HumanTeam yet.
 *   - Player budget (`pelbudget(pv)`) — not modelled.
 *   - Junior list (`jel`/`lpj`) — A-junior pool, accessible via TAB
 *     in QB. No data model in TS yet.
 *   - Per-row contract action wiring (extend, release, CCCP, karisma,
 *     zombipulveri) — only the buttons exist. The QB SUBs (`xavier`,
 *     `sopimusext`) haven't ported.
 *   - Hangover indicator (`krapu(pv)`) overlay on skill — needs the
 *     team-level hangover model. QB shows `CHR$(1); CHR$(2);` instead.
 *   - Specialty visibility gate (`pok > 30` in QB at `:5157`). For
 *     POC we always reveal — easier to test.
 *   - Runkosarja-only stat split (`rug`/`rua` per-team regular-season
 *     totals, distinct from playoff totals). Our `stats.season` is
 *     undifferentiated; the RUNKOSARJA tab repeats the season totals
 *     for now and is tagged accordingly.
 */

const POSITION_ORDER: Record<HiredPlayer["position"], number> = {
  g: 0,
  d: 1,
  lw: 2,
  c: 3,
  rw: 4
};

/** QB `pelip(ppp)` short labels (g/d/lw/c/rw). */
const POSITION_LABEL: Record<HiredPlayer["position"], string> = {
  g: "MV",
  d: "PP",
  lw: "VL",
  c: "K",
  rw: "OL"
};

const playerSorter = sortBy<HiredPlayer[]>(
  [(p) => POSITION_ORDER[p.position], "asc"],
  [prop("skill"), "desc"],
  [prop("surname"), "asc"]
);

/** Mean over players. Mirrors `ketjuchk`'s avg() pass at `ILEX5.BAS:6660`. */
const mean = (xs: readonly number[]): number =>
  xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length;

const fmt1 = (n: number): string => n.toFixed(1);

/**
 * QB `inj` decoded into a short status tag.
 * Mirrors the `pel.inj` switch in `printpel` (`ILEX5.BAS:5070-5085`).
 */
const playerStatus = (
  player: HiredPlayer
): { label: string; level: "info" | "warning" | "danger" } | null => {
  for (const e of player.effects) {
    if (e.type === "injury") {
      // QB ranges: <1000 = LO (loukkaantuminen), 1001..1999 = PK
      // (pelikielto), 2001..2999 = VI (vireystila/sairaus), 9000+ = MJ
      // (maajoukkue). We don't yet split the variants — just tag it.
      return { label: `LO ${e.duration}`, level: "danger" };
    }
    if (e.type === "suspension") {
      return { label: `PK ${e.duration}`, level: "warning" };
    }
    if (e.type === "nationals") {
      return { label: "MJ", level: "info" };
    }
    if (e.type === "strike") {
      return { label: "LAKKO", level: "danger" };
    }
  }
  return null;
};

const contractClauseLabel = (contract: Contract): string => {
  if (contract.type === "guest") {
    return "VIERAS";
  }
  if (!contract.specialClause) {
    return "—";
  }
  if (contract.specialClause.kind === "free-fire") {
    return "VAPAAPOTKU";
  }
  return contract.specialClause.freshlySigned ? "NHL (uusi)" : "NHL";
};

const plannedDepartureLabel = (
  d: HiredPlayer["plannedDeparture"]
): string | null => {
  switch (d) {
    case "cut":
      return "PÖRSSI";
    case "nhl":
      return "NHL";
    case "foreign-return":
      return "KOTIMAA";
    case "retirement":
      return "ELÄKE";
    default:
      return null;
  }
};

const specialtyLabel = (player: HiredPlayer): string => {
  // QB sentinel overlays live in tags (see player-specialties.ts).
  if (player.tags.includes("zombified")) {
    // Same render path as `lay 54` in QB (`:5153`).
    return playerSpecialtyDisplayNames.zombie;
  }
  if (player.tags.includes("muilutus:primed")) {
    return `${playerSpecialtyDisplayNames.enforcer} (M)`;
  }
  if (!player.specialty || player.specialty === "none") {
    return "—";
  }
  return playerSpecialtyDisplayNames[player.specialty];
};

const countryName = (iso: HiredPlayer["nationality"]): string =>
  countries[iso]?.name ?? iso;

/**
 * Per-player WIP action row. QB dispatches these via single-letter
 * hotkeys in the `katsopel` loop; we surface them as buttons. The POC
 * brief explicitly allows repeating the row per player.
 *
 * Almost everything is TODO-disabled — the underlying SUBs (`xavier`,
 * `sopimusext`) and the captain field on HumanTeam haven't ported.
 */
const PlayerActions: FC<{ player: HiredPlayer }> = ({ player }) => {
  // TODO: enable once `kapu(pv)` field exists on HumanTeam and the
  // ASSIGN_CAPTAIN event is wired into gameMachine.
  const isCaptain = false;
  const isEnforcer = player.specialty === "enforcer";
  const muilutusPrimed = player.tags.includes("muilutus:primed");

  return (
    <Cluster gap="xs">
      <Button
        terse
        secondary
        disabled
        title="TODO: kapteenin nimitys (kapu(pv) puuttuu HumanTeamilta)"
      >
        {isCaptain ? "Kapteeni ✓" : "Kapteeniksi (c)"}
      </Button>
      <Button
        terse
        secondary
        disabled
        title="TODO: sopimusext SUB ei ole vielä portattu"
      >
        Jatka sopimusta (e)
      </Button>
      <Button
        terse
        secondary
        disabled
        title="TODO: xavier 1 (CCCP-TABLETTI) ei ole vielä portattu"
      >
        CCCP-tabletti (t)
      </Button>
      <Button
        terse
        secondary
        disabled
        title="TODO: xavier 2 (KARISMAKOULUTUS) ei ole vielä portattu"
      >
        Karismakoulutus (k)
      </Button>
      <Button
        terse
        secondary
        disabled
        title="TODO: xavier 3 (VAPAUTA) ei ole vielä portattu"
      >
        Vapauta (p)
      </Button>
      <Button
        terse
        secondary
        disabled
        title="TODO: xavier 4 (ZOMBIPULVERI) ei ole vielä portattu"
      >
        Zombipulveri (z)
      </Button>
      {isEnforcer && (
        <Button
          terse
          secondary
          disabled
          title={`TODO: muilutus-toggle (spe ${
            muilutusPrimed
              ? `${PLAYER_SPECIALTY_SENTINELS.muilutusOrdered}→5`
              : `5→${PLAYER_SPECIALTY_SENTINELS.muilutusOrdered}`
          })`}
        >
          {muilutusPrimed ? "Peruuta muilutus (m)" : "Muiluta! (m)"}
        </Button>
      )}
    </Cluster>
  );
};

type ColumnSpec = {
  header: ReactNode;
  cell: (player: HiredPlayer) => ReactNode;
  align?: "start" | "center" | "end";
};

/**
 * Common columns rendered on every sub-page (Y.MHM record 35 prefix).
 * Goalies skip YV/AV — QB `printpel` does the same at `:5051-5056`.
 */
const commonColumns: readonly ColumnSpec[] = [
  {
    header: "Nimi",
    cell: (p) => (
      <>
        {p.surname}, {p.initial}.
      </>
    )
  },
  { header: "Kan.", cell: (p) => countryName(p.nationality) },
  { header: "PP", cell: (p) => POSITION_LABEL[p.position], align: "center" },
  { header: "Ikä", cell: (p) => p.age, align: "end" },
  { header: "Joht.", cell: (p) => p.leadership, align: "end" },
  { header: "Kar.", cell: (p) => p.charisma, align: "end" },
  {
    header: "Taito",
    align: "end",
    cell: (p) => {
      const plus = performanceModifier(p);
      return plus === 0
        ? p.skill
        : `${p.skill + plus} (${plus > 0 ? "+" : ""}${plus})`;
    }
  },
  {
    header: "YV",
    align: "end",
    cell: (p) => (p.position === "g" ? "—" : p.powerplayMod)
  },
  {
    header: "AV",
    align: "end",
    cell: (p) => (p.position === "g" ? "—" : p.penaltyKillMod)
  },
  {
    header: "Tila",
    cell: (p) => {
      const s = playerStatus(p);
      if (!s) {
        return null;
      }
      return <Badge level={s.level}>{s.label}</Badge>;
    }
  }
];

/** Sivu 1 = TILASTOT (Y.MHM record 36: `KU POK POT M + S = P`). */
const statsColumns: readonly ColumnSpec[] = [
  { header: "Kunto", align: "end", cell: (p) => p.condition },
  { header: "POK", align: "end", cell: (p) => p.stats.total.games },
  { header: "POT", align: "end", cell: (p) => p.stats.season.games },
  { header: "M", align: "end", cell: (p) => p.stats.season.goals },
  { header: "S", align: "end", cell: (p) => p.stats.season.assists },
  {
    header: "P",
    align: "end",
    cell: (p) => p.stats.season.goals + p.stats.season.assists
  }
];

/** Sivu 2 = SOPIMUS (Y.MHM record 37: `SVU SRA MUUTA`). */
const contractColumns: readonly ColumnSpec[] = [
  {
    header: "SVU",
    align: "end",
    cell: (p) => p.contract.duration
  },
  {
    header: "Palkka",
    align: "end",
    cell: (p) =>
      p.contract.type === "regular" ? p.contract.salary.toLocaleString() : "—"
  },
  {
    header: "Pykälä",
    cell: (p) => contractClauseLabel(p.contract)
  },
  {
    header: "Lähtee",
    cell: (p) => plannedDepartureLabel(p.plannedDeparture) ?? "—"
  }
];

/** Sivu 3 = ERIKOISUUS (Y.MHM record 38: `ERIK`). */
const specialtyColumns: readonly ColumnSpec[] = [
  { header: "Erikoisuus", cell: (p) => specialtyLabel(p) }
];

/**
 * Sivu 4 = RUNKOSARJA (Y.MHM record 39: `M + S = P`, regular-season
 * stats only). QB only shows it `IF kr > 68` (playoffs in progress).
 *
 * TODO: we don't yet split season stats into runkosarja vs playoffs
 * (QB `rug(xx, pv)` / `rua(xx, pv)` carry the regular-season subset).
 * For now we just repeat the season totals and tag the column header.
 */
const runkosarjaColumns: readonly ColumnSpec[] = [
  {
    header: "M (TODO)",
    align: "end",
    cell: (p) => p.stats.season.goals
  },
  {
    header: "S (TODO)",
    align: "end",
    cell: (p) => p.stats.season.assists
  },
  {
    header: "P (TODO)",
    align: "end",
    cell: (p) => p.stats.season.goals + p.stats.season.assists
  }
];

const PlayersTable: FC<{
  players: readonly HiredPlayer[];
  pageColumns: readonly ColumnSpec[];
}> = ({ players, pageColumns }) => {
  const columns = [...commonColumns, ...pageColumns];

  return (
    <Table>
      <thead>
        <tr>
          {columns.map((c, i) => (
            <Th key={i} align={c.align}>
              {c.header}
            </Th>
          ))}
          <Th>Toiminnot</Th>
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <tr key={player.id}>
            {columns.map((c, i) => (
              <Td key={i} align={c.align}>
                {c.cell(player)}
              </Td>
            ))}
            <Td>
              <PlayerActions player={player} />
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const PlayersHeader: FC<{
  team: HumanTeam;
  players: readonly HiredPlayer[];
}> = ({ team, players }) => {
  // QB `avg(1)` = mean skill, `avg(2)` = mean age, `avg(3)` = mean
  // charisma (`ILEX5.BAS:6660`-ish, also see ketjuchk in SUBS.md).
  const avgSkill = mean(players.map((p) => p.skill));
  const avgAge = mean(players.map((p) => p.age));
  const avgCharisma = mean(players.map((p) => p.charisma));

  return (
    <Cluster gap="lg" as="header">
      <span>
        <strong>P-RINKI:</strong> {team.tier}
      </span>
      <span title="TODO: pelbudget(pv) puuttuu mallista">
        <strong>P.B:</strong> — / O
      </span>
      <span>
        <strong>K-IK:</strong> {fmt1(avgAge)}
      </span>
      <span>
        <strong>K-TA:</strong> {fmt1(avgSkill)}
      </span>
      <span>
        <strong>K-KA:</strong> {fmt1(avgCharisma)}
      </span>
      <span>
        <strong>Pelaajia:</strong> {players.length}
      </span>
    </Cluster>
  );
};

const Players: FC = () => {
  const manager = useGameContext(activeManager);
  const team = useGameContext(managersTeam(manager.id));
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  useHotkeys([["q", () => navigate("/kokoonpano")]]);

  if (team.kind !== "human") {
    return null;
  }

  const sortedPlayers = playerSorter(values(team.players));

  const tabs: TabItem[] = [
    {
      title: "Tilastot",
      content: () => (
        <PlayersTable players={sortedPlayers} pageColumns={statsColumns} />
      )
    },
    {
      title: "Sopimus",
      content: () => (
        <PlayersTable players={sortedPlayers} pageColumns={contractColumns} />
      )
    },
    {
      title: "Erikoisuus",
      content: () => (
        <PlayersTable players={sortedPlayers} pageColumns={specialtyColumns} />
      )
    },
    {
      title: "Runkosarja",
      content: () => (
        <PlayersTable players={sortedPlayers} pageColumns={runkosarjaColumns} />
      )
    }
  ];

  return (
    <AdvancedHeaderedPage
      escTo="/"
      stickyMenu={<StickyMenu back />}
      managerInfo={<ManagerInfo details />}
    >
      <Stack gap="lg">
        <Heading level={2}>Pelaajat</Heading>
        <PlayersHeader team={team} players={sortedPlayers} />

        <Tabs items={tabs} selected={tab} onSelect={setTab} />

        {/* TODO: A-juniorit (jel/lpj) — QB toggles via TAB in
            `katsopel`. Junior data model not yet ported. */}
        <Paragraph>
          <em>
            Huom: A-juniorit, kapteenin nimitys, sopimusneuvottelut sekä
            xavier-toiminnot (CCCP / karisma / vapautus / zombipulveri)
            puuttuvat vielä TS-portista — toimintopainikkeet ovat paikoillaan,
            mutta disabloitu.
          </em>
        </Paragraph>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default Players;
