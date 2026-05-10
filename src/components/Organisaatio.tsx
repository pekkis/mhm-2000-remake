import type { FC } from "react";
import { entries } from "remeda";

import {
  teamServiceDefinitions,
  type TeamServiceIdentifier
} from "@/data/mhm2000/team-services";
import { activeManager, activeManagersTeam } from "@/machines/selectors";
import { GameMachineContext } from "@/context/game-machine-context";
import Heading from "./ui/Heading";
import Stack from "./ui/Stack";
import Slider from "./ui/Slider";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import ManagerInfo from "@/components/ManagerInfo";

const ServiceSlider: FC<{
  service: TeamServiceIdentifier;
  value: number;
  onChange: (level: number) => void;
}> = ({ service, value, onChange }) => {
  const def = teamServiceDefinitions[service];
  const maxLevel = def.options.length - 1;

  return (
    <Stack gap="sm">
      <Heading level={3}>{def.name}</Heading>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Slider
          min={0}
          max={maxLevel}
          step={1}
          value={value}
          onValueChange={onChange}
        />
        <span style={{ minInlineSize: "12rem" }}>
          {def.options[value].label}
        </span>
      </div>
      <span style={{ fontSize: "0.85em", opacity: 0.7 }}>
        {def.options[value].costPerMatch > 0
          ? `${def.options[value].costPerMatch} /ottelu`
          : "Ei kustannuksia"}
      </span>
    </Stack>
  );
};

const Organisaatio = () => {
  const manager = GameMachineContext.useSelector((state) =>
    activeManager(state.context)
  );
  const team = GameMachineContext.useSelector((state) =>
    activeManagersTeam(state.context)
  );
  const actor = GameMachineContext.useActorRef();

  return (
    <AdvancedHeaderedPage escTo="/" managerInfo={<ManagerInfo details />}>
      <Stack>
        <Heading level={2}>Organisaatio</Heading>

        <Stack gap="sm">
          <Heading level={3}>Budjetti</Heading>
          <p style={{ opacity: 0.6 }}>TODO: Budjetin yhteenveto</p>
        </Stack>

        <Heading level={2}>Erikoistoimenpiteet</Heading>

        {entries(teamServiceDefinitions).map(([id]) => (
          <ServiceSlider
            key={id}
            service={id}
            value={team.services[id]}
            onChange={(level) =>
              actor.send({
                type: "SET_TEAM_SERVICE",
                payload: {
                  manager: manager.id,
                  service: id,
                  level
                }
              })
            }
          />
        ))}
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default Organisaatio;
