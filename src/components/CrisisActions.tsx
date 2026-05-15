import { useSelector } from "@xstate/react";
import type { AnyActorRef } from "xstate";
import Button from "./ui/Button";
import PageLayout from "@/components/page/PageLayout";
import ManagerInfo from "./ManagerInfo";
import StickyMenu from "./StickyMenu";
import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";
import Markdown from "@/components/Markdown";
import Paragraph from "./ui/Paragraph";
import { GameMachineContext } from "@/context/game-machine-context";
import { crisisOptions, type CrisisOption } from "@/data/crisis";
import crisisMeetingTexts from "@/data/mhm2000/crisis-meeting-texts";
import type { CrisisMeetingScene } from "@/game/crisis-meeting";

/** Replace `{key}` placeholders with values from templateVars. */
const renderText = (
  textKey: number,
  templateVars: Record<string, string>
): string => {
  let text = crisisMeetingTexts[textKey] ?? "";
  for (const [key, val] of Object.entries(templateVars)) {
    text = text.replaceAll(`{${key}}`, val);
  }
  return text;
};

const moraleDeltaLabel = (delta: number): string => {
  if (delta > 0) {
    return `Moraali +${delta}`;
  }
  if (delta < 0) {
    return `Moraali ${delta}`;
  }
  return "Ei vaikutusta moraaliin";
};

const SceneView: React.FC<{ scene: CrisisMeetingScene }> = ({ scene }) => (
  <Stack gap="sm">
    <Markdown>{renderText(scene.textKey, scene.templateVars)}</Markdown>
    <Paragraph size="sm" weight="bold">
      {moraleDeltaLabel(scene.moraleDelta)}
      {scene.injury && ` — loukkaantuminen ${scene.injury.rounds} kierrosta`}
    </Paragraph>
  </Stack>
);

const CrisisActions = () => {
  const gameActor = GameMachineContext.useActorRef();
  const crisisActor = gameActor.system.get("crisisMeeting") as AnyActorRef;

  const snap = useSelector(crisisActor, (s) => ({
    state: s.value as "choosing" | "narrating" | "done",
    result: s.context.result as
      | { scenes: CrisisMeetingScene[]; totalMoraleDelta: number }
      | undefined
  }));

  const send = (event: Parameters<typeof crisisActor.send>[0]) =>
    crisisActor.send(event);

  return (
    <PageLayout
      stickyMenu={<StickyMenu />}
      managerInfo={<ManagerInfo details />}
    >
      <Stack gap="lg">
        <Heading level={2}>Kriisipalaveri</Heading>

        {snap.state === "choosing" && (
          <Stack gap="md">
            <Paragraph>
              Valitse kriisipalaverin muoto. Suurempi riski tuo suuremmat
              mahdollisuudet — mutta myös suuremmat tappiot.
            </Paragraph>

            {([1, 2, 3] as CrisisOption[]).map((option) => (
              <Button
                key={option}
                block
                onClick={() => send({ type: "CHOOSE_OPTION", option })}
              >
                {crisisOptions[option].title} —{" "}
                {crisisOptions[option].description}
              </Button>
            ))}

            <Button block secondary onClick={() => send({ type: "CANCEL" })}>
              Peruuta
            </Button>
          </Stack>
        )}

        {snap.state === "narrating" && snap.result && (
          <Stack gap="lg">
            {snap.result.scenes.map((scene, i) => (
              <SceneView key={i} scene={scene} />
            ))}

            <Paragraph weight="bold">
              Yhteenveto: moraali {snap.result.totalMoraleDelta >= 0 ? "+" : ""}
              {snap.result.totalMoraleDelta}
            </Paragraph>

            <Button block onClick={() => send({ type: "ACKNOWLEDGE" })}>
              OK
            </Button>
          </Stack>
        )}
      </Stack>
    </PageLayout>
  );
};

export default CrisisActions;
