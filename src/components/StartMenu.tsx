import title from "@/assets/mhm_pics/MHM2000.png";
import { AppMachineContext } from "@/context/app-machine-context";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import Stack from "@/components/ui/Stack";
import Heading from "@/components/ui/Heading";
import Centerer from "@/components/Centerer";
import Box from "@/components/ui/Box";
import SlotMenu from "@/components/start-menu/SlotMenu";
import { CreatingGame } from "@/components/start-menu/CreatingGame";

const StartMenu = () => {
  const inMenu = AppMachineContext.useSelector((state) => state.matches("menu"));
  const creating = AppMachineContext.useSelector((state) =>
    state.matches("creatingGame")
  );
  const loading = AppMachineContext.useSelector((state) =>
    state.matches("loading")
  );

  return (
    <Centerer>
      <Stack gap="lg">
        <Box>
          <Stack align="center" gap="md">
            <ResponsiveImage src={title} alt="MHM 2000" />
            <Box textAlign="center">
              <Stack gap="sm">
                <Heading level={1}>MHM 2000</Heading>
              </Stack>
            </Box>
          </Stack>
        </Box>

        {inMenu && <SlotMenu />}
        {creating && <CreatingGame />}
        {loading && (
          <Box textAlign="center">
            <Heading level={2}>Ladataan...</Heading>
          </Box>
        )}
      </Stack>
    </Centerer>
  );
};

export default StartMenu;
