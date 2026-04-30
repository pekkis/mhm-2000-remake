import Cluster from "@/components/ui/Cluster";
import Button from "@/components/ui/Button";
import Box from "./ui/Box";
import title from "./start-menu/title.png";
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
            <ResponsiveImage
              src={title}
              alt="MHM 97, maailman paras jääkiekkomanagerisimulaatio"
            />
            <Box textAlign="center">
              <Stack gap="sm">
                <Heading level={1}>MHM 97</Heading>
                <Heading level={2} size="md">
                  maailman paras jääkiekkomanagerisimulaatio
                </Heading>
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
              <li>Teemu Nevalainen</li>
              <li>Mikko Forsström</li>
            </ul>
            <h3>Laadunvalvonta</h3>
            <ul>
              <li>Teemu Nevalainen</li>
              <li>Sami Helen</li>
              <li>A-P Nevalainen</li>
              <li>Antti Kettunen</li>
            </ul>
            <h3>v1.2 betatestaus</h3>
            <ul>
              <li>Henri Hokkanen</li>
              <li>Jussi Kniivilä </li>
              <li>Tony Herranen</li>
              <li>Antti Laakso</li>
              <li>Markus Lämsä</li>
              <li>Tomi Salmi</li>
              <li>Aleksi Ursin</li>
              <li>Ilmari Sandelin</li>
            </ul>
            <h3>Erityiskiitokset</h3>
            <ul>
              <li>Erno Vanhala</li>
              <li>Sami Ritola</li>
            </ul>
          </Box>
        )}

        {starting && <Starting />}
      </Stack>
    </Centerer>
  );
};

export default StartMenu;
