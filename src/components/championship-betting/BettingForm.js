import React from "react";
import { Formik } from "formik";
import Slider from "rc-slider";
import { amount as a } from "../../services/format";
import odds from "../../data/championship-betting";
import Button from "../form/Button";

const BettingForm = props => {
  const { manager, competition, teams, betChampion } = props;

  const teamsAndOdds = odds(competition, teams);

  return (
    <Formik
      initialValues={{
        team: "",
        amount: 10000
      }}
      onSubmit={values => {
        betChampion(
          manager.get("id"),
          parseInt(values.team, 10),
          parseInt(values.amount, 10),
          teamsAndOdds.getIn([parseInt(values.team, 10), "odds"])
        );
      }}
    >
      {({ values, setFieldValue, handleChange, handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <h3>Valitse ehdokkaasi</h3>

            {teamsAndOdds
              .map(team => {
                return (
                  <div key={team.get("id")}>
                    <label>
                      <input
                        name="team"
                        type="radio"
                        value={team.get("id").toString()}
                        checked={values.team === team.get("id").toString()}
                        onChange={handleChange}
                      />
                      {team.get("name")} ({team.get("odds")})
                    </label>
                  </div>
                );
              })
              .toList()}

            <h3>Valitse panos</h3>

            <div>
              <Slider
                min={10000}
                max={1000000}
                step={10000}
                value={values.amount}
                onChange={value => {
                  setFieldValue("amount", value);
                }}
              />
              <strong>{a(values.amount)}</strong> pekkaa
            </div>

            <Button disabled={values.team === ""} block type="submit">
              Veikkaa mestaria
            </Button>
          </form>
        );
      }}
    </Formik>
  );
};

export default BettingForm;
