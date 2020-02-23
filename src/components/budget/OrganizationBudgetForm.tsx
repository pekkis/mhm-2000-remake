import { Field, Form, Formik } from "formik";
import React, { FunctionComponent } from "react";
import { Dispatch } from "redux";
import * as Yup from "yup";
import { budgetOrganization } from "../../ducks/manager";
import { weightedOrganizationLevelList } from "../../services/organization";
import { HumanManager } from "../../types/manager";
import { Team, TeamOrganization } from "../../types/team";
import Button from "../form/Button";
import UIField from "../form/Field";
import LabelDiv from "../form/LabelDiv";
import Markdown from "../Markdown";
import Currency from "../ui/Currency";

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
