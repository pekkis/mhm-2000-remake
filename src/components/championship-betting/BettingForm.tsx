import React, { FunctionComponent } from "react";
import { Formik } from "formik";
import { amount as a } from "../../services/format";
// import odds from "../../data/championship-betting";
import Button from "../form/Button";
import { betChampion } from "../../ducks/betting";

interface Props {
  betChampion: typeof betChampion;
}

const BettingForm: FunctionComponent<Props> = props => {
  const { manager, competition, teams, betChampion } = props;

  const teamsAndOdds = odds(competition, teams);

  return (
    <Formik
      initialValues={{
        team: "",
        amount: "10000"
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
              <input
                type="range"
                min={10000}
                max={1000000}
                step={10000}
                value={values.amount}
                onChange={handleChange}
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
