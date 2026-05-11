import { useState } from "react";
import { useMachine } from "@xstate/react";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import ManagerInfo from "./ManagerInfo";
import Stack from "@/components/ui/Stack";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import RadioGroup from "@/components/ui/RadioGroup";
import Input from "@/components/ui/form/Input";
import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";
import { activeManager } from "@/machines/selectors";
import { getEffective } from "@/services/effects";
import { currency } from "@/services/format";
import {
  arenaDesignMachine,
  planCost,
  planFreePoints,
  canConfirm,
  valuePointsMin,
  valuePointsMax,
  type ArenaDesignContext
} from "@/machines/arenaDesign";
import {
  builders,
  architects,
  downPayment,
  constructionRounds,
  displaySeatCount,
  type BuildRank,
  type ProjectKind
} from "@/services/arena";
import type { ArenaLevel } from "@/data/mhm2000/teams";

// ─── Arena info sub-component ─────────────────────────────────────────────────

const ArenaInfo = () => {
  const manager = useGameContext(activeManager);
  const teams = useGameContext((ctx) => ctx.teams);
  const team = getEffective(teams[manager.team!]);

  const { arena, arenaFund } = team;

  return (
    <Stack gap="sm">
      <Heading level={3}>{arena.name ?? "Nimetön areena"}</Heading>
      <Paragraph size="sm">Viihtyisyystaso: {arena.level} / 6</Paragraph>
      <Paragraph size="sm">Tilapisteet: {arena.valuePoints}</Paragraph>
      <Paragraph size="sm">
        Seisomapaikat: {displaySeatCount(arena.standingCount)} &middot;{" "}
        Istumapaikat: {displaySeatCount(arena.seatedCount)}
        {arena.hasBoxes ? " · Aitiot: kyllä" : ""}
      </Paragraph>
      <Paragraph size="sm">Rakennuspotti: {currency(arenaFund)}</Paragraph>
      <Paragraph size="sm">Saldo: {currency(manager.balance)}</Paragraph>
    </Stack>
  );
};

// ─── Fund transfer sub-component ──────────────────────────────────────────────

const FundTransfer = () => {
  const manager = useGameContext(activeManager);
  const gameActor = GameMachineContext.useActorRef();
  const [amount, setAmount] = useState("");

  const parsed = Math.max(0, Math.floor(Number(amount) || 0));
  const maxTransfer = Math.max(0, manager.balance);

  return (
    <Stack gap="sm">
      <Heading level={4}>Siirrä rahaa pottiin</Heading>
      <Stack direction="row" gap="sm" align="center">
        <Input
          type="number"
          min={0}
          max={maxTransfer}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Summa (€)"
          style={{ maxWidth: "12rem" }}
        />
        <Button
          disabled={parsed <= 0 || parsed > maxTransfer}
          onClick={() => {
            gameActor.send({
              type: "TRANSFER_TO_ARENA_FUND",
              payload: { manager: manager.id, amount: parsed }
            });
            setAmount("");
          }}
        >
          Siirrä
        </Button>
        {maxTransfer > 0 && (
          <Button
            secondary
            terse
            onClick={() => setAmount(String(maxTransfer))}
          >
            Kaikki ({currency(maxTransfer)})
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

// ─── Project status sub-component ─────────────────────────────────────────────

const ProjectStatus = () => {
  const manager = useGameContext(activeManager);
  const teams = useGameContext((ctx) => ctx.teams);
  const team = getEffective(teams[manager.team!]);

  const project = team.arenaProject;
  if (!project) {return null;}

  return (
    <Stack gap="sm">
      <Heading level={4}>RAKENNUSPROSESSIN TILANNEKATSAUS</Heading>
      {project.kind === "renovate" ? (
        <>
          <Paragraph size="sm">Tyyppi: Peruskorjaus</Paragraph>
          <Paragraph size="sm">
            Kierroksia jäljellä: {project.roundsRemaining}
          </Paragraph>
          <Paragraph size="sm">
            Maksuerä / kierros: {currency(project.roundPayment)}
          </Paragraph>
          <Paragraph size="sm">
            Tavoite: {project.target.valuePoints} tilapistettä (taso{" "}
            {project.target.level})
          </Paragraph>
        </>
      ) : (
        <>
          <Paragraph size="sm">
            Tyyppi: Uudisrakennus — {project.name}
          </Paragraph>
          {project.permitGranted ? (
            <>
              <Paragraph size="sm">Rakennuslupa: MYÖNNETTY</Paragraph>
              <Paragraph size="sm">
                Kierroksia jäljellä: {project.roundsRemaining}
              </Paragraph>
              <Paragraph size="sm">
                Maksuerä / kierros: {currency(project.roundPayment)}
              </Paragraph>
            </>
          ) : (
            <Paragraph size="sm">
              Rakennuslupa: Käsittelyssä (edistyminen: {project.roundsRemaining}{" "}
              / 100)
            </Paragraph>
          )}
          <Paragraph size="sm">
            Tavoite: {project.target.valuePoints} tilapistettä (taso{" "}
            {project.target.level})
          </Paragraph>
        </>
      )}
    </Stack>
  );
};

// ─── Design wizard sub-component ──────────────────────────────────────────────

const builderOptions = builders.map((b) => ({
  value: String(b.rank) as "1" | "2" | "3",
  label: b.name
}));

const architectOptions = architects.map((a) => ({
  value: String(a.rank) as "1" | "2" | "3",
  label: a.name
}));

const levelOptions = ([1, 2, 3, 4, 5, 6] as const).map((l) => ({
  value: String(l) as "1" | "2" | "3" | "4" | "5" | "6",
  label: `Taso ${l}`
}));

const CostSummary = ({ ctx }: { ctx: ArenaDesignContext }) => {
  const cost = planCost(ctx);
  const free = planFreePoints(ctx);
  const dp = downPayment(cost);
  const rounds = constructionRounds(ctx.kind, ctx.builder);
  const canStart = ctx.arenaFund >= dp;

  return (
    <Stack gap="xs">
      <Paragraph size="sm" weight="bold">
        Kokonaishinta: {currency(cost)}
      </Paragraph>
      <Paragraph size="sm">
        Pantti (20 %): {currency(dp)} — Potti: {currency(ctx.arenaFund)}
        {canStart ? "" : " ⚠ EI RIITÄ"}
      </Paragraph>
      <Paragraph size="sm">
        Vapaita tilapisteitä: {free}
        {free < 0 ? " ⚠ YLITYS" : ""}
      </Paragraph>
      <Paragraph size="sm">Rakennusaika: {rounds} kierrosta</Paragraph>
    </Stack>
  );
};

const DesignWizard = ({
  kind,
  onDone
}: {
  kind: ProjectKind;
  onDone: () => void;
}) => {
  const manager = useGameContext(activeManager);
  const teams = useGameContext((ctx) => ctx.teams);
  const team = getEffective(teams[manager.team!]);
  const gameActor = GameMachineContext.useActorRef();

  const [state, send] = useMachine(arenaDesignMachine, {
    input: {
      kind,
      currentArena: team.arena,
      balance: manager.balance,
      arenaFund: team.arenaFund
    }
  });

  const ctx = state.context;
  const minPts = valuePointsMin(ctx);
  const maxPts = valuePointsMax(ctx);
  const minLevel = kind === "renovate" ? team.arena.level : 1;

  // Filter level options for renovation (can't downgrade)
  const availableLevels = levelOptions.filter(
    (o) => Number(o.value) >= minLevel
  );

  const handleConfirm = () => {
    const totalCost = planCost(ctx);
    gameActor.send({
      type: "START_ARENA_PROJECT",
      payload: {
        manager: manager.id,
        kind: ctx.kind,
        target: {
          name: ctx.kind === "build" ? ctx.name : team.arena.name,
          level: ctx.level,
          standingCount: ctx.standingCount,
          seatedCount: ctx.seatedCount,
          hasBoxes: ctx.hasBoxes,
          valuePoints: ctx.valuePoints
        },
        builder: ctx.builder,
        architect: ctx.architect,
        name: ctx.name,
        totalCost
      }
    });
    onDone();
  };

  return (
    <Stack gap="md">
      <Heading level={3}>
        {kind === "renovate" ? "Peruskorjaus" : "Uusi areena"}
      </Heading>

      {/* Arena name (build only) */}
      {kind === "build" && (
        <Stack gap="xs">
          <Heading level={5}>Areenan nimi</Heading>
          <Input
            type="text"
            value={ctx.name}
            onChange={(e) => send({ type: "SET_NAME", value: e.target.value })}
            style={{ maxWidth: "20rem" }}
          />
        </Stack>
      )}

      {/* Tilapisteet */}
      <Stack gap="xs">
        <Heading level={5}>Tilapisteet: {ctx.valuePoints}</Heading>
        <Slider
          min={minPts}
          max={maxPts}
          step={kind === "build" ? 10 : 1}
          value={ctx.valuePoints}
          onValueChange={(v) => send({ type: "SET_VALUE_POINTS", value: v })}
        />
      </Stack>

      {/* Viihtyisyystaso */}
      <Stack gap="xs">
        <Heading level={5}>Viihtyisyystaso</Heading>
        <RadioGroup
          options={availableLevels}
          value={String(ctx.level) as "1" | "2" | "3" | "4" | "5" | "6"}
          onValueChange={(v) =>
            send({ type: "SET_LEVEL", value: Number(v) as ArenaLevel })
          }
        />
      </Stack>

      {/* Seisomapaikat */}
      <Stack gap="xs">
        <Heading level={5}>
          Seisomapaikat: {displaySeatCount(ctx.standingCount)}
        </Heading>
        <Slider
          min={1}
          max={300}
          value={ctx.standingCount}
          onValueChange={(v) => send({ type: "SET_STANDING", value: v })}
        />
      </Stack>

      {/* Istumapaikat */}
      <Stack gap="xs">
        <Heading level={5}>
          Istumapaikat: {displaySeatCount(ctx.seatedCount)}
        </Heading>
        <Slider
          min={1}
          max={300}
          value={ctx.seatedCount}
          onValueChange={(v) => send({ type: "SET_SEATED", value: v })}
        />
      </Stack>

      {/* Aitiot (boxes) — only available at level 4+ */}
      {ctx.level >= 4 && (
        <Stack gap="xs">
          <Heading level={5}>Aitiot</Heading>
          <Stack direction="row" gap="sm">
            <Button
              secondary={!ctx.hasBoxes}
              terse
              onClick={() => send({ type: "SET_BOXES", value: true })}
              disabled={
                kind === "renovate" && team.arena.hasBoxes && ctx.hasBoxes
              }
            >
              Kyllä
            </Button>
            <Button
              secondary={ctx.hasBoxes}
              terse
              onClick={() => send({ type: "SET_BOXES", value: false })}
              disabled={kind === "renovate" && team.arena.hasBoxes}
            >
              Ei
            </Button>
          </Stack>
        </Stack>
      )}

      {/* Architect (build only) */}
      {kind === "build" && (
        <Stack gap="xs">
          <Heading level={5}>Arkkitehti</Heading>
          <RadioGroup
            options={architectOptions}
            value={String(ctx.architect) as "1" | "2" | "3"}
            onValueChange={(v) =>
              send({ type: "SET_ARCHITECT", value: Number(v) as BuildRank })
            }
          />
        </Stack>
      )}

      {/* Builder */}
      <Stack gap="xs">
        <Heading level={5}>Rakennuttaja</Heading>
        <RadioGroup
          options={builderOptions}
          value={String(ctx.builder) as "1" | "2" | "3"}
          onValueChange={(v) =>
            send({ type: "SET_BUILDER", value: Number(v) as BuildRank })
          }
        />
      </Stack>

      {/* Cost summary */}
      <CostSummary ctx={ctx} />

      {/* Actions */}
      <Stack direction="row" gap="sm">
        <Button disabled={!canConfirm(ctx)} onClick={handleConfirm}>
          Aloita projekti
        </Button>
        <Button secondary onClick={onDone}>
          Peruuta
        </Button>
      </Stack>
    </Stack>
  );
};

// ─── Main Arena page ──────────────────────────────────────────────────────────

const Arenas = () => {
  const manager = useGameContext(activeManager);
  const teams = useGameContext((ctx) => ctx.teams);
  const team = getEffective(teams[manager.team!]);
  const [wizardKind, setWizardKind] = useState<ProjectKind | null>(null);

  const hasProject = team.arenaProject !== undefined;

  return (
    <AdvancedHeaderedPage
      escTo="/"
      stickyMenu={<StickyMenu back />}
      managerInfo={<ManagerInfo details />}
    >
      <Stack gap="lg">
        <Heading level={2}>Areena</Heading>

        <ArenaInfo />

        <FundTransfer />

        <ProjectStatus />

        {/* Wizard or launch buttons */}
        {wizardKind !== null ? (
          <DesignWizard kind={wizardKind} onDone={() => setWizardKind(null)} />
        ) : (
          !hasProject && (
            <Stack direction="row" gap="sm">
              <Button onClick={() => setWizardKind("renovate")}>
                Peruskorjaus
              </Button>
              <Button onClick={() => setWizardKind("build")}>
                Uusi areena
              </Button>
            </Stack>
          )
        )}
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default Arenas;
