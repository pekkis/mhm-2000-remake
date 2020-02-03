import React, { FunctionComponent } from "react";
import { Formik, Field, Form } from "formik";
import Button from "../form/Button";
import Input from "../form/Input";
import Select from "../form/Select";
import Fieldset from "../form/Fieldset";
import Label from "../form/Label";
import LabelDiv from "../form/LabelDiv";
import UIField from "../form/Field";
import difficultyLevelMap from "../../services/difficulty-levels";
import { map, values as rValues, values, sum } from "ramda";
import { Competition, ForEveryCompetition, MapOf } from "../../types/base";
import { Team, TeamOrganization } from "../../types/team";
import { teamListByIds, nameToId } from "../../services/team";
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
import { ManagerAbilities, HumanManager } from "../../types/manager";
import { number } from "prop-types";
import Markdown from "../Markdown";
import { weightedOrganizationLevelList } from "../../services/organization";
import Currency from "../ui/Currency";
import { budgetOrganization } from "../../ducks/manager";

const organizationBudgetSchema = Yup.object().shape({
  coaching: Yup.number().required(),
  goalieCoaching: Yup.number().required(),
  juniorAcademy: Yup.number().required(),
  care: Yup.number().required(),
  benefits: Yup.number().required()
});

interface Props {
  manager: HumanManager;
  team: Team;
  dispatch: Dispatch;
}

const OrganizationBudgetForm: FunctionComponent<Props> = props => {
  const { manager, team, dispatch } = props;

  return (
    <div>
      <Formik
        isInitialValid={true}
        validationSchema={organizationBudgetSchema}
        initialValues={team.organization}
        onSubmit={(values: TeamOrganization) => {
          console.log(values);
          dispatch(budgetOrganization(manager.id, values));
        }}
      >
        {({ handleChange, values, isValid, errors, setFieldValue }) => {
          return (
            <Form>
              {weightedOrganizationLevelList.map(aspect => {
                return (
                  <UIField key={aspect.id}>
                    <LabelDiv>{aspect.name}</LabelDiv>
                    <Field
                      name={aspect.id}
                      component="input"
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                    />{" "}
                    {values[aspect.id]} ->{" "}
                    <Currency value={aspect.prices[values[aspect.id] - 1]} />{" "}
                    {aspect.unit}
                    <div>
                      <Markdown
                        source={aspect.descriptions[values[aspect.id] - 1]}
                      />
                    </div>
                  </UIField>
                );
              })}

              <UIField>
                <Button disabled={!isValid} block type="submit">
                  Budjetoi
                </Button>
              </UIField>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default OrganizationBudgetForm;
