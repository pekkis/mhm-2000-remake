import type { FC, HTMLAttributes, ReactNode } from "react";
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
import {
  teams as managedTeams,
  type ManagedTeamDefinition,
  type LeagueTier
} from "@/data/mhm2000/teams";
import {
  tiersForExperience,
  type CustomTeamOverride
} from "@/machines/new-game";
import competitions from "@/data/competitions";
import {
  TEAM_HEADLINE,
  TEAM_GROUP_LABELS,
  TEAM_CUSTOM_LABEL,
  TEAM_FIELD_CITY,
  TEAM_FIELD_ARENA,
  TEAM_FIELD_AMENITY
} from "@/data/mhm2000/wizard-strings";
import { getMaterialTier } from "@/services/levels";
import type { CompetitionId } from "@/types/competitions";

// QB `omajoukkue` field-length caps. Mirror the original input limits so
// the rendered name/city/arena fit on the legacy-styled UI.
const MAX_TEAM_NAME_LENGTH = 10;
const MAX_CITY_NAME_LENGTH = 12;
const MAX_ARENA_NAME_LENGTH = 26;

/**
 * Bridge between `CompetitionId` (used by the calendar / competition
 * machinery) and `LeagueTier` (used by `ManagedTeamDefinition.league`).
 * MHM 2000 spells the second tier `divisioona`; the competition module
 * spells the corresponding id `division`. The other two match.
 */
const competitionIdToLeague: Partial<Record<CompetitionId, LeagueTier>> = {
  phl: "phl",
  division: "divisioona",
  mutasarja: "mutasarja"
};

/**
 * Sorted list of `(competitionId, league)` pairs in the canonical
 * weight-ascending order from `competitions.ts` — i.e. the order the
 * QB UI prints columns top-to-bottom (PHL, Divisioona, Mutasarja).
 * Light-only competitions (cup, ehl, tournaments, practice) drop out
 * because no managed team carries that league tag.
 */
const groupedCompetitionOrder: { id: CompetitionId; league: LeagueTier }[] =
  Object.values(competitions)
    .toSorted((a, b) => a.data.weight - b.data.weight)
    .flatMap((c) => {
      const league = competitionIdToLeague[c.data.id];
      return league ? [{ id: c.data.id, league }] : [];
    });

// Local plain card wrapper. Reusing the design-system <Box> would
// require running every prop through sprinkles, which doesn't compose
// with the inline style we need for the role="button" affordance.
const Box: FC<HTMLAttributes<HTMLDivElement> & { children?: ReactNode }> = ({
  children,
  style,
  ...rest
}) => (
  <div
    {...rest}
    style={{
      padding: "0.5rem 0.75rem",
      borderRadius: "0.25rem",
      background: "rgba(127,127,127,0.08)",
      ...style
    }}
  >
    {children}
  </div>
);

const TeamCard: FC<{
  team: ManagedTeamDefinition;
  onPick: () => void;
  selected?: boolean;
}> = ({ team, onPick, selected }) => {
  const arenaTotal = team.arena.standingCount + team.arena.seatedCount;
  return (
    <Box
      role="button"
      onClick={onPick}
      style={{
        cursor: "pointer",
        border: selected ? "2px solid currentColor" : undefined
      }}
    >
      <Stack gap="xs">
        <strong>
          {team.name} — {team.city}
        </strong>
        <span>{getMaterialTier(team.tier)}</span>
        <span>
          {team.arena.name} — {TEAM_FIELD_AMENITY} {team.arena.level}/6
        </span>
        <span>
          Paikkoja: {arenaTotal} (seisoma {team.arena.standingCount} / istuma{" "}
          {team.arena.seatedCount}){team.arena.hasBoxes ? ", VIP-aitiot" : ""}
        </span>
      </Stack>
    </Box>
  );
};

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

  const groups = groupedCompetitionOrder
    .filter((g) => tiers.includes(g.league))
    .map((g) => ({
      ...g,
      label: TEAM_GROUP_LABELS[g.league] ?? g.league.toUpperCase(),
      teams: managedTeams.filter(
        (t) => t.league === g.league && !takenTeams.has(t.id)
      )
    }));

  const submitNormal = (team: number) => {
    actor.send({ type: "SET_TEAM", team });
  };

  const submitCustom = () => {
    if (displaceTeam === undefined) {
      return;
    }
    const override: CustomTeamOverride = {
      name: customName.trim().slice(0, MAX_TEAM_NAME_LENGTH) || "OMA JOUKKUE",
      city: customCity.trim().slice(0, MAX_CITY_NAME_LENGTH) || "Hirvikoski",
      arena:
        customArena.trim().slice(0, MAX_ARENA_NAME_LENGTH) || "MHM 2000 Areena"
    };
    actor.send({ type: "SET_TEAM", team: displaceTeam, customTeam: override });
  };

  if (customMode) {
    // Flatten the same competition grouping for the displace-team picker.
    const flatEligible = groups.flatMap((g) => g.teams);
    return (
      <Stack gap="md">
        <Heading level={2}>{TEAM_CUSTOM_LABEL}</Heading>
        <Paragraph>
          Valitse joukkue, jonka tilalle uusi joukkue rakennetaan.
        </Paragraph>
        <Cluster gap="sm">
          {flatEligible.map((t) => (
            <Button
              key={t.id}
              secondary={displaceTeam !== t.id}
              onClick={() => setDisplaceTeam(t.id)}
            >
              {t.name} ({TEAM_GROUP_LABELS[t.league]})
            </Button>
          ))}
        </Cluster>
        <Field>
          <Label>Joukkueen nimi (max {MAX_TEAM_NAME_LENGTH} merkkiä)</Label>
          <Input
            block
            value={customName}
            maxLength={MAX_TEAM_NAME_LENGTH}
            onChange={(e) => setCustomName(e.target.value)}
          />
        </Field>
        <Field>
          <Label>
            {TEAM_FIELD_CITY} (max {MAX_CITY_NAME_LENGTH} merkkiä)
          </Label>
          <Input
            block
            value={customCity}
            maxLength={MAX_CITY_NAME_LENGTH}
            onChange={(e) => setCustomCity(e.target.value)}
          />
        </Field>
        <Field>
          <Label>
            {TEAM_FIELD_ARENA} (max {MAX_ARENA_NAME_LENGTH} merkkiä)
          </Label>
          <Input
            block
            value={customArena}
            maxLength={MAX_ARENA_NAME_LENGTH}
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
      <Heading level={2}>{TEAM_HEADLINE}</Heading>
      <Stack gap="lg">
        {groups.map((group) => (
          <Stack key={group.id} gap="sm">
            <Heading level={3}>{group.label}</Heading>
            {group.teams.length === 0 ? (
              <Paragraph>(ei vapaita joukkueita)</Paragraph>
            ) : (
              <Stack gap="xs">
                {group.teams.map((t) => (
                  <TeamCard
                    key={t.id}
                    team={t}
                    onPick={() => submitNormal(t.id)}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        ))}
      </Stack>
      <Cluster gap="sm">
        <Button onClick={() => setCustomMode(true)}>{TEAM_CUSTOM_LABEL}</Button>
        <Button secondary onClick={() => actor.send({ type: "BACK" })}>
          Edellinen
        </Button>
      </Cluster>
    </Stack>
  );
};

export default StepTeam;
