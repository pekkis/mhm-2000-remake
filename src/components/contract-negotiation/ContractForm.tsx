import React, { FunctionComponent } from "react";
import { Formik, Field, Form } from "formik";
import Button from "../form/Button";
import Input from "../form/Input";
import Select from "../form/Select";
import Fieldset from "../form/Fieldset";
import Label from "../form/Label";
import LabelDiv from "../form/LabelDiv";
import UIField from "../form/Field";
import * as Yup from "yup";
import { Dispatch } from "redux";
import { advance } from "../../ducks/game";
import { Contract, ContractNegotiation } from "../../types/player";
import { range } from "ramda";
import {
  PLAYER_CONTRACT_PROPOSE,
  PlayerContractProposeAction
} from "../../ducks/player";

const contractShema = Yup.object().shape({
  years: Yup.number().required("Required"),
  salary: Yup.number().required("Required"),
  nhlOption: Yup.boolean().required("Required"),
  freeKickOption: Yup.boolean().required("Required")
});

interface Props {
  negotiation: ContractNegotiation;
  dispatch: Dispatch;
}

const ContractForm: FunctionComponent<Props> = props => {
  const { negotiation, dispatch } = props;

  return (
    <div>
      <Formik
        isInitialValid={true}
        validationSchema={contractShema}
        initialValues={negotiation.contract}
        onSubmit={values => {
          console.log(values, "contract väljuus");

          dispatch<PlayerContractProposeAction>({
            type: PLAYER_CONTRACT_PROPOSE,
            payload: {
              negotiationId: negotiation.id,
              contract: values
            }
          });
        }}
      >
        {({ handleChange, values, isValid, errors, setFieldValue }) => {
          return (
            <Form>
              <UIField>
                <Label>Vuosia</Label>
                <Field
                  component="select"
                  type="text"
                  block
                  name="years"
                  disabled={!negotiation.ongoing}
                >
                  {range(1, 5).map(y => {
                    return (
                      <option key={y} value={y}>
                        {y} vuotta
                      </option>
                    );
                  })}
                </Field>
              </UIField>

              <UIField>
                <Label>Palkka</Label>
                <Field
                  as={Input}
                  type="text"
                  name="salary"
                  disabled={!negotiation.ongoing}
                />
              </UIField>

              <UIField>
                <Label>NHL-pykälä</Label>
                <Field
                  as={Input}
                  type="checkbox"
                  name="nhlOption"
                  disabled={!negotiation.ongoing}
                />
              </UIField>

              <UIField>
                <Label>Vapaapotku-pykälä</Label>
                <Field
                  as={Input}
                  type="checkbox"
                  name="freeKickOption"
                  disabled={!negotiation.ongoing}
                />
              </UIField>

              <Button disabled={!negotiation.ongoing} type="submit">
                Ehdota
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ContractForm;
