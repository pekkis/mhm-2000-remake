import type { FC } from "react";
import { useState } from "react";
import { useSelector } from "@xstate/react";
import Stack from "@/components/ui/Stack";
import Cluster from "@/components/ui/Cluster";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/form/Field";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/Input";
import type { WizardStepProps } from "@/components/start-menu/wizard/types";
import { teams as managedTeams } from "@/data/mhm2000/teams";
import {
  tiersForExperience,
  type CustomTeamOverride
} from "@/machines/new-game";

const tierLabel = {
  phl: "PHL",
  divisioona: "Divisioona",
  mutasarja: "Mutasarja"
} as const;

const StepTeam: FC<WizardStepProps> = ({ actor }) => {
  const experience = useSelector(actor, (s) => s.context.current.experience);
  // Block other humans from picking the same team.
  const takenTeams = useSelector(
    actor,
    (s) => new Set(s.context.drafts.map((d) => d.team))
  );
  const tiers = experience ? tiersForExperience(experience) : [];

  const [customMode, setCustomMode] = useState(false);
  const [displaceTeam, setDisplaceTeam] = useState<number | undefined>();
  const [customName, setCustomName] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [customArena, setCustomArena] = useState("MHM 2000 Areena");

  const eligible = managedTeams.filter(
    (t) => tiers.includes(t.league) && !takenTeams.has(t.id)
  );

  const submitNormal = (team: number) => {
    actor.send({ type: "SET_TEAM", team });
  };

  const submitCustom = () => {
    if (displaceTeam === undefined) {
      return;
    }
    const override: CustomTeamOverride = {
      name: customName.trim().slice(0, 10) || "OMA JOUKKUE",
      city: customCity.trim().slice(0, 12) || "Hirvikoski",
      arena: customArena.trim().slice(0, 26) || "MHM 2000 Areena"
    };
    actor.send({ type: "SET_TEAM", team: displaceTeam, customTeam: override });
  };

  if (customMode) {
    return (
      <Stack gap="md">
        <Heading level={2}>OMA JOUKKUE</Heading>
        <Paragraph>
          Valitse joukkue, jonka tilalle uusi joukkue rakennetaan.
        </Paragraph>
        <Cluster gap="sm">
          {eligible.map((t) => (
            <Button
              key={t.id}
              secondary={displaceTeam !== t.id}
              onClick={() => setDisplaceTeam(t.id)}
            >
              {t.name} ({tierLabel[t.league]})
            </Button>
          ))}
        </Cluster>
        <Field>
          <Label>Joukkueen nimi (max 10 merkkiä)</Label>
          <Input
            block
            value={customName}
            maxLength={10}
            onChange={(e) => setCustomName(e.target.value)}
          />
        </Field>
        <Field>
          <Label>Kotikaupunki (max 12 merkkiä)</Label>
          <Input
            block
            value={customCity}
            maxLength={12}
            onChange={(e) => setCustomCity(e.target.value)}
          />
        </Field>
        <Field>
          <Label>Areenan nimi (max 26 merkkiä)</Label>
          <Input
            block
            value={customArena}
            maxLength={26}
            onChange={(e) => setCustomArena(e.target.value)}
          />
        </Field>
        <Cluster gap="sm">
          <Button onClick={submitCustom} disabled={displaceTeam === undefined}>
            Vahvista
          </Button>
          <Button secondary onClick={() => setCustomMode(false)}>
            Takaisin listaan
          </Button>
        </Cluster>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <Heading level={2}>Joukkue</Heading>
      <Paragraph>
        Sallitut tasot: {tiers.map((t) => tierLabel[t]).join(", ")}
      </Paragraph>
      <Cluster gap="sm">
        {eligible.map((t) => (
          <Button key={t.id} secondary onClick={() => submitNormal(t.id)}>
            {t.name} ({tierLabel[t.league]})
          </Button>
        ))}
      </Cluster>
      <Cluster gap="sm">
        <Button onClick={() => setCustomMode(true)}>OMA JOUKKUE</Button>
        <Button secondary onClick={() => actor.send({ type: "BACK" })}>
          Edellinen
        </Button>
      </Cluster>
    </Stack>
  );
};

export default StepTeam;
