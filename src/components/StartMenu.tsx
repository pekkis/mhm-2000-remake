import Cluster from "@/components/ui/Cluster";
import Button from "@/components/ui/Button";
import Box from "./ui/Box";
import title from "@/assets/mhm_pics/MHM2000.png";
import { AppMachineContext } from "@/context/app-machine-context";
import { Starting } from "@/components/start-menu/Starting";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import Stack from "@/components/ui/Stack";
import Heading from "@/components/ui/Heading";
import Centerer from "@/components/Centerer";

const StartMenu = () => {
  const starting = AppMachineContext.useSelector((state) =>
    state.matches("starting")
  );

  const app = AppMachineContext.useActorRef();

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

        {!starting && (
          <Box>
            <Cluster justify="center" gap="md">
              <Button
                onClick={() => {
                  app.send({ type: "START_GAME" });
                }}
              >
                Uusi peli
              </Button>
              <Button
                onClick={() => {
                  app.send({ type: "LOAD_GAME" });
                }}
              >
                Lataa peli
              </Button>
            </Cluster>
            <h3>Alkuperäinen suunnittelu & ohjelmointi</h3>
            <ul>
              <li>Mikko Forsström</li>
            </ul>
            <h3>Remaken suunnittelu & ohjelmointi</h3>
            <ul>
              <li>Mikko Forsström</li>
              <li>Jean-Claude van Copilot</li>
            </ul>
            <h3>Grafiikka</h3>
            <ul>
              <li>Santtu Huotilainen</li>
              <li>Mikko Forsström</li>
              <li>Jean-Claude van Copilot</li>
            </ul>
            <h3>Alkuperäinen laadunvalvonta</h3>
            <ul>
              <li>Aki Haviala</li>
              <li>Sami Kytömäki</li>
              <li>Markus Lummi</li>
              <li>Matias Lofman</li>
              <li>Jussi Myllykoski</li>
              <li>Lauri Pihlman</li>
              <li>Toni Syvänen</li>
            </ul>
            <h3>Remaken laadunvalvonta</h3>
            <ul>
              <li>Erno Vanhala</li>
            </ul>
          </Box>
        )}

        {starting && <Starting />}
      </Stack>
    </Centerer>
  );
};

export default StartMenu;
