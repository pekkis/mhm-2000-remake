import React, { FunctionComponent } from "react";
import { Formik, Field, Form } from "formik";
import Button from "../form/Button";
import Input from "../form/Input";
import Select from "../form/Select";
import Label from "../form/Label";
import LabelDiv from "../form/LabelDiv";
import UIField from "../form/Field";
import difficultyLevelMap from "../../services/difficulty-levels";
import { map, values as rValues, values } from "ramda";
import { Competition, ForEveryCompetition } from "../../types/base";
import { Team } from "../../types/team";
import { teamListByIds } from "../../services/team";
import * as Yup from "yup";

interface Props {
  manager: {
    name: string;
    arena: string;
    difficulty: string;
  };
  competitions: ForEveryCompetition<Competition>;
  teams: { [key: string]: Team };
  advance: (values: object) => void;
}

interface ManagerInput {
  name: string;
  arena: string;
  difficulty: string;
  team?: string;
}

const manager: ManagerInput = {
  name: "Gaylord Lohiposki",
  arena: "Dr. Kobros Areena",
  difficulty: "1"
};

const managerFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  team: Yup.string().required("required")
});

const ManagerForm: FunctionComponent<Props> = props => {
  const { competitions, teams } = props;

  const difficultyLevels = values(difficultyLevelMap);

  return (
    <div>
      <Formik
        isInitialValid={false}
        validationSchema={managerFormSchema}
        initialValues={manager}
        onSubmit={values => {
          console.log(values);

          // advance(values);
        }}
      >
        {({ handleChange, values, isValid, errors }) => {
          console.log(isValid, values, errors, "validato");
          return (
            <Form>
              <UIField>
                <Label>Managerin nimi</Label>
                <Field as={Input} type="text" block name="name" />
              </UIField>

              <UIField>
                <Label>Areenan nimi</Label>
                <Field as={Input} block name="arena" onChange={handleChange} />
              </UIField>

              <UIField>
                <LabelDiv>Vaikeustaso</LabelDiv>
                {map(
                  dl => (
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
                  ),
                  difficultyLevels
                )}
              </UIField>

              <UIField>
                <LabelDiv>Joukkue</LabelDiv>

                <Field component="select" name="team">
                  <option>Valitse joukkue</option>
                  {map((c: Competition) => {
                    const competitionTeams = teamListByIds(teams, c.teams);

                    return (
                      <optgroup key={c.id} label={c.name}>
                        {competitionTeams.map(t => {
                          return (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          );
                        })}
                      </optgroup>
                    );
                  }, rValues(competitions))}
                </Field>
              </UIField>

              <UIField>
                <Button disabled={!isValid} block type="submit">
                  Eteenpäin
                </Button>
              </UIField>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ManagerForm;
