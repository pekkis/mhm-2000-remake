import React, { FunctionComponent } from "react";
import { Formik } from "formik";
import Button from "../form/Button";
import Input from "../form/Input";
import Select from "../form/Select";
import Label from "../form/Label";
import LabelDiv from "../form/LabelDiv";
import Field from "../form/Field";
import difficultyLevelMap from "../../services/difficulty-levels";
import { map, values as rValues, values } from "ramda";
import { Competition, ForEveryCompetition } from "../../types/base";
import { Team } from "../../types/team";

interface Props {
  manager: {
    name: string;
    arena: string;
    difficulty: string;
    team: string;
  };
  competitions: ForEveryCompetition<Competition>;
  teams: Team[];
  advance: (values: object) => void;
}

interface ManagerInput {
  name: string;
  arena: string;
  difficulty: string;
  team: string;
}

const manager: ManagerInput = {
  name: "Gaylord Lohiposki",
  arena: "Dr. Kobros Areena",
  difficulty: "1",
  team: "1"
};

const ManagerForm: FunctionComponent<Props> = props => {
  const { advance, competitions, teams } = props;

  const difficultyLevels = values(difficultyLevelMap);

  return (
    <div>
      <Formik
        initialValues={manager}
        onSubmit={values => {
          advance(values);
        }}
      >
        {({ handleSubmit, handleChange, values }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Field>
                <Label>Managerin nimi</Label>
                <Input
                  block
                  id="name"
                  value={values.name}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Label>Areenan nimi</Label>
                <Input
                  block
                  id="arena"
                  value={values.arena}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <LabelDiv>Vaikeustaso</LabelDiv>
                {difficultyLevels.map(dl => {
                  return (
                    <div key={dl.value}>
                      <label>
                        <Input
                          type="radio"
                          name="difficulty"
                          value={dl.value}
                          checked={values.difficulty === dl.value.toString()}
                          onChange={handleChange}
                        />{" "}
                        {dl.name} ({dl.description})
                      </label>
                    </div>
                  );
                })}
              </Field>

              <Field>
                <LabelDiv>Joukkue</LabelDiv>

                <Select name="team" value={values.team} onChange={handleChange}>
                  {map((c: Competition) => {
                    return (
                      <optgroup key={c.id} label={c.name}>
                        {c.teams
                          .map(t => teams[t])
                          .map(t => {
                            return (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            );
                          })}
                      </optgroup>
                    );
                  }, rValues(competitions))}
                </Select>
              </Field>

              <Field>
                <Button block type="submit">
                  Eteenpäin
                </Button>
              </Field>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ManagerForm;
