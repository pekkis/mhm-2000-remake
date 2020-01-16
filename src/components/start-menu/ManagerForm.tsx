import React, { FunctionComponent } from "react";
import { Formik } from "formik";
import Button from "../form/Button";
import Input from "../form/Input";
import Select from "../form/Select";
import Label from "../form/Label";
import LabelDiv from "../form/LabelDiv";
import Field from "../form/Field";
import difficultyLevels from "../../services/difficulty-levels";
import { mapObjIndexed, map, values as rValues } from "ramda";
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
}

const ManagerForm: FunctionComponent<Props> = props => {
  const { manager, advance, competitions, teams } = props;

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
                {difficultyLevels
                  .map(dl => {
                    return (
                      <div key={dl.get("value")}>
                        <label>
                          <Input
                            type="radio"
                            name="difficulty"
                            value={dl.get("value")}
                            checked={values.difficulty === dl.get("value")}
                            onChange={handleChange}
                          />{" "}
                          {dl.get("name")} ({dl.get("description")})
                        </label>
                      </div>
                    );
                  })
                  .toList()}
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
