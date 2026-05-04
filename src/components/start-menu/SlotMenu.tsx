import type { FC } from "react";
import Stack from "@/components/ui/Stack";
import Cluster from "@/components/ui/Cluster";
import Button from "@/components/ui/Button";
import Box from "@/components/ui/Box";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import { AppMachineContext } from "@/context/app-machine-context";
import type { SlotInfo } from "@/services/persistence";

const slotLabel = (slot: SlotInfo): string => {
  if (slot.status === "empty") {
    return "(tyhjä)";
  }
  const { managers, year } = slot.metadata;
  const head = managers
    .map((m) => `${m.name} · ${m.teamName || "?"} (${m.league.toUpperCase()})`)
    .join(" / ");
  return `${head} — ${year}`;
};

const SlotCard: FC<{ slot: SlotInfo; selected: boolean }> = ({
  slot,
  selected
}) => {
  const app = AppMachineContext.useActorRef();
  const isFull = slot.status === "full";

  return (
    <Box
      p="md"
      radius="md"
      bg={selected ? "accent" : "surface"}
      color={selected ? "accentText" : "text"}
    >
      <Stack gap="sm">
        <Cluster justify="space-between" gap="sm">
          <Heading level={3}>Tallennusruutu {slot.slot}</Heading>
          {selected && <span>◀ valittu</span>}
        </Cluster>
        <Paragraph>{slotLabel(slot)}</Paragraph>
        <Cluster gap="sm">
          <Button
            onClick={() => app.send({ type: "SELECT_SLOT", slot: slot.slot })}
            secondary
          >
            Valitse
          </Button>
          {isFull ? (
            <>
              <Button
                onClick={() => app.send({ type: "LOAD_SLOT", slot: slot.slot })}
              >
                Lataa
              </Button>
              <Button
                onClick={() =>
                  app.send({ type: "REQUEST_CLEAR_SLOT", slot: slot.slot })
                }
                secondary
              >
                Tyhjennä
              </Button>
            </>
          ) : (
            <Button
              onClick={() =>
                app.send({ type: "START_NEW_GAME", slot: slot.slot })
              }
            >
              Uusi peli
            </Button>
          )}
        </Cluster>
      </Stack>
    </Box>
  );
};

const ConfirmClear: FC<{ slot: number }> = ({ slot }) => {
  const app = AppMachineContext.useActorRef();
  return (
    <Box p="md" radius="md" bg="warning">
      <Stack gap="sm">
        <Heading level={3}>Tyhjennetäänkö ruutu {slot}?</Heading>
        <Paragraph>
          Tallennettu peli katoaa lopullisesti. Mahdollisuutta perua ei ole.
        </Paragraph>
        <Cluster gap="sm">
          <Button onClick={() => app.send({ type: "CONFIRM_CLEAR_SLOT" })}>
            Kyllä, tyhjennä
          </Button>
          <Button
            onClick={() => app.send({ type: "CANCEL_CLEAR_SLOT" })}
            secondary
          >
            Peruuta
          </Button>
        </Cluster>
      </Stack>
    </Box>
  );
};

const SlotMenu: FC = () => {
  const slots = AppMachineContext.useSelector((state) => state.context.slots);
  const selectedSlot = AppMachineContext.useSelector(
    (state) => state.context.selectedSlot
  );
  const confirming = AppMachineContext.useSelector((state) =>
    state.matches({ menu: "confirmingClear" })
  );
  const pendingClear = AppMachineContext.useSelector(
    (state) => state.context.pendingClearSlot
  );
  const loading = AppMachineContext.useSelector(
    (state) =>
      state.matches({ menu: "loadingSlots" }) ||
      state.matches({ menu: "clearingSlot" })
  );

  if (loading) {
    return (
      <Box textAlign="center">
        <Heading level={2}>Luetaan tallennuksia...</Heading>
      </Box>
    );
  }

  if (confirming && pendingClear !== undefined) {
    return <ConfirmClear slot={pendingClear} />;
  }

  return (
    <Stack gap="md">
      <Heading level={2}>Tallennusruudut</Heading>
      {slots.map((slot) => (
        <SlotCard
          key={slot.slot}
          slot={slot}
          selected={slot.slot === selectedSlot}
        />
      ))}
    </Stack>
  );
};

export default SlotMenu;
