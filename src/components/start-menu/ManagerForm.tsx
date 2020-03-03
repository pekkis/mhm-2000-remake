import React, { FunctionComponent } from "react";
import { Formik, Field, Form } from "formik";
import Button from "../form/Button";
import { Input, Box, Slider, Select } from "theme-ui";
import Fieldset from "../form/Fieldset";
import Label from "../form/Label";
import LabelDiv from "../form/LabelDiv";
import UIField from "../form/Field";
import difficultyLevelMap from "../../services/difficulty-levels";
import { map, values as rValues, values, sum } from "ramda";
import { Competition, ForEveryCompetition, MapOf } from "../../types/base";
import { Team } from "../../types/team";
import { teamListByIds, nameToId, getTeamLevelData } from "../../services/team";
import * as Yup from "yup";
import { Dispatch } from "redux";
import { advance } from "../../ducks/game";
import {
  previousExperience,
  weightedManagerAbilityList
} from "../../services/manager";
import { TeamStatistic } from "../../types/stats";
import { AllCountries } from "../../types/country";
import { alphabeticalCountryList } from "../../services/country";
import { ManagerAbilities } from "../../types/manager";
import { number } from "prop-types";
import Markdown from "../Markdown";
import { team } from "../../ducks";

export interface ManagerInput {
  name: string;
  previousExperience: string;
  difficulty: string;
  team: string;
  country: AllCountries;
  abilities: ManagerAbilities;
}

const manager: ManagerInput = {
  name: "Gaylord Lohiposki",
  country: "FI",
  previousExperience: "0",
  difficulty: "3",
  team: nameToId("turmio"),
  abilities: {
    strategy: 0,
    specialTeams: 0,
    negotiation: 0,
    cunning: 0,
    charisma: 0,
    luck: 0
  }
};

const managerFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),

  abilities: Yup.object().shape({
    strategy: Yup.number().required(),
    specialTeams: Yup.number().required(),
    negotiation: Yup.number().required(),
    cunning: Yup.number().required(),
    charisma: Yup.number().required(),
    luck: Yup.number().required()
  }),

  team: Yup.string().required("required"),
  abilitySum: Yup.boolean().test("abilitySum", "Ability sum too big", function(
    item
  ) {
    const abilitySum = sum(rValues(this.parent.abilities));
    return abilitySum === 0;
  })
});

interface Props {
  stats: MapOf<TeamStatistic>;
  competitions: MapOf<Competition>;
  teams: { [key: string]: Team };
  dispatch: Dispatch;
}

const ManagerForm: FunctionComponent<Props> = props => {
  const { competitions, teams, dispatch, stats } = props;

  const difficultyLevels = values(difficultyLevelMap);

  return (
    <div>
      <Formik
        isInitialValid={true}
        validationSchema={managerFormSchema}
        initialValues={manager}
        onSubmit={values => {
          dispatch(advance(values));
        }}
      >
        {({ handleChange, values, isValid, errors, setFieldValue }) => {
          const team = teams[values.team];

          return (
            <Form>
              <UIField>
                <Label>Managerin nimi</Label>
                <Field as={Input} type="text" block name="name" />
              </UIField>

              <UIField>
                <Label>Managerin kotimaa</Label>
                <Field as={Select} name="country">
                  {alphabeticalCountryList.map(c => {
                    return (
                      <option key={c.iso} value={c.iso}>
                        {c.name}
                      </option>
                    );
                  })}
                </Field>
              </UIField>

              <UIField>
                <LabelDiv>Managerina olet...</LabelDiv>

                <Field
                  as={Select}
                  name="previousExperience"
                  onChange={(e, e2, e3) => {
                    handleChange(e);
                    setFieldValue("team", "");
                    console.log("e", e, e2, e3);
                  }}
                >
                  {previousExperience.map((pe, i) => {
                    return (
                      <option key={i} value={i.toString()}>
                        {pe.name}
                      </option>
                    );
                  })}
                </Field>

                <div>
                  Kokemustasolla ei ole minkäänlaista vaikutusta pelin
                  vaikeustasoon, kyse on manageripersoonasi aiemmasta urasta.
                  <strong>Uusi kasvo</strong> merkitsee sitä, että urasi on
                  vasta alkamassa,
                  <strong>elävä legenda</strong> on puolestaan manageroinut jo
                  vuosikymmenien ajan.
                </div>
              </UIField>

              <UIField>
                <LabelDiv>Vaikeustaso</LabelDiv>

                <Field as={Select} name="difficulty">
                  {difficultyLevels.map(dl => {
                    return (
                      <option key={dl.value} value={dl.value}>
                        {dl.name}
                      </option>
                    );
                  })}
                </Field>

                <div>
                  {
                    difficultyLevels[parseInt(values.difficulty, 10) - 1]
                      .description
                  }
                </div>
              </UIField>

              <UIField>
                <LabelDiv>Joukkue</LabelDiv>

                <Field as={Select} name="team">
                  <option value="">Valitse joukkue</option>
                  {map((c: Competition) => {
                    const competitionTeams = teamListByIds(teams, c.teams);

                    return (
                      <optgroup key={c.id} label={c.name}>
                        {competitionTeams.map(t => {
                          const stat = stats[t.id];

                          const avgRanking =
                            sum(stat.ranking) / stat.ranking.length;

                          const isDisabled =
                            previousExperience[
                              parseInt(values.previousExperience, 10)
                            ].minRanking > avgRanking;

                          return (
                            <option
                              key={t.id}
                              value={t.id}
                              disabled={isDisabled}
                            >
                              {t.name}, {t.city}
                            </option>
                          );
                        })}
                      </optgroup>
                    );
                  }, rValues(competitions))}
                </Field>

                {team && (
                  <Box py={3}>
                    <h3>Joukkueen taso</h3>
                    {getTeamLevelData(team.level).description} ({team.level} /
                    58)
                    <h3>Areena ({team.arena.name})</h3>
                    <table>
                      <tbody>
                        <tr>
                          <th>viihtyisyystaso</th>
                          <td>{team.arena.level} / 6</td>
                        </tr>
                        <tr>
                          <th>seisomapaikkoja</th>
                          <td>{team.arena.seats}</td>
                        </tr>
                        <tr>
                          <th>istumapaikkoja</th>
                          <td>{team.arena.seats}</td>
                        </tr>
                        <tr>
                          <th>aitioita</th>
                          <td>{team.arena.boxes ? "kyllä" : "ei"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Box>
                )}
              </UIField>

              <Fieldset>
                <legend>Manageripersoona</legend>

                <p>
                  Jokainen muutos manageripersoonaan tuo siihen omat vahvuutensa
                  ja heikkoutensa, eikä persoonaa voi enää jälkikäteen muuttaa.
                  Valitse siis tarkasti. (-3: surkea, 0: keskinkertainen, 3:
                  loistava)
                </p>

                {weightedManagerAbilityList.map(ability => {
                  return (
                    <UIField key={ability.id}>
                      <LabelDiv>{ability.name}</LabelDiv>
                      <Field
                        name={`abilities.${ability.id}`}
                        as={Slider}
                        type="range"
                        min="-3"
                        max="3"
                        step="1"
                      />{" "}
                      {values.abilities[ability.id]}
                      <div>
                        <Markdown source={ability.description} />
                      </div>
                    </UIField>
                  );
                })}
              </Fieldset>

              <UIField>
                <Button
                  variant="primary"
                  disabled={!isValid}
                  block
                  type="submit"
                >
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
