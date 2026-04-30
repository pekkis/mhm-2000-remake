import type { FC } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Label from "@/components/ui/form/Label";
import LabelDiv from "@/components/ui/form/LabelDiv";
import Field from "@/components/ui/form/Field";
import difficultyLevels from "@/data/difficulty-levels";
import type { Team } from "@/state/game";
import type { Competition } from "@/types/competitions";
import { values } from "remeda";
import Stack from "@/components/ui/Stack";

type FormShape = {
  name: string;
  arena: string;
  difficulty: string;
  team: number;
};

export type ManagerFormValues = {
  name: string;
  arena: string;
  difficulty: number;
  team: number;
};

const defaultValues: FormShape = {
  name: "Gaylord Lohiposki",
  arena: "MasoSports Areena",
  difficulty: "2",
  team: 12
};

type ManagerFormProps = {
  advance: (values: ManagerFormValues) => void;
  competitions: Record<string, Competition>;
  teams: Team[];
};

const ManagerForm: FC<ManagerFormProps> = ({
  advance,
  competitions,
  teams
}) => {
  const { register, handleSubmit } = useForm<FormShape>({
    defaultValues
  });

  return (
    <div>
      <form
        onSubmit={handleSubmit((values) =>
          advance({ ...values, difficulty: parseInt(values.difficulty, 10) })
        )}
      >
        <Stack gap="md">
          <Field>
            <Label>Managerin nimi</Label>
            <Input block id="name" {...register("name")} />
          </Field>

          <Field>
            <Label>Areenan nimi</Label>
            <Input block id="arena" {...register("arena")} />
          </Field>

          <Field>
            <LabelDiv>Vaikeustaso</LabelDiv>
            {difficultyLevels.map((dl) => {
              return (
                <div key={dl.value}>
                  <label>
                    <Input
                      type="radio"
                      value={dl.value}
                      {...register("difficulty")}
                    />{" "}
                    {dl.name} ({dl.description})
                  </label>
                </div>
              );
            })}
          </Field>

          <Field>
            <LabelDiv>Joukkue</LabelDiv>

            <Select {...register("team", { valueAsNumber: true })}>
              {values(competitions).map((c) => {
                return (
                  <optgroup key={c.id} label={c.name}>
                    {c.teams
                      .map((t) => teams[t])
                      .toSorted((a, b) => a.name.localeCompare(b.name))
                      .map((t) => {
                        return (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        );
                      })}
                  </optgroup>
                );
              })}
            </Select>
          </Field>

          <Field>
            <Button block type="submit">
              Eteenpäin
            </Button>
          </Field>
        </Stack>
      </form>
    </div>
  );
};

export default ManagerForm;
