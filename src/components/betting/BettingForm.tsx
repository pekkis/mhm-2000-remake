import type { FC } from "react";
import { useForm, Controller } from "react-hook-form";
import Slider from "@/components/ui/form/Slider";
import { currency } from "@/services/format";
import Button from "@/components/ui/Button";
import TeamName from "@/components/team/Name";
import type { Team } from "@/state/game";
import type { Manager } from "@/state/game";
import type { Competition } from "@/types/competitions";
import { entries } from "remeda";
import Stack from "@/components/ui/Stack";
import Box from "@/components/ui/Box";

type BettingFormValues = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
  amount: number;
};

type BettingFormProps = {
  manager: Manager;
  competition: Competition;
  teams: Team[];
  bet: (coupon: string[], amount: number) => void;
  turn?: unknown;
};

const BettingForm: FC<BettingFormProps> = ({ competition, teams, bet }) => {
  const group = competition.phases[0].groups[0];
  const round = group.round;
  const pairings = group.schedule[round];

  const { register, handleSubmit, control, watch } = useForm<BettingFormValues>(
    {
      defaultValues: {
        "0": "",
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        amount: 10000
      }
    }
  );

  const values = watch();

  const onSubmit = (data: BettingFormValues) => {
    const coupon = [
      data["0"],
      data["1"],
      data["2"],
      data["3"],
      data["4"],
      data["5"]
    ];
    bet(coupon, data.amount);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <Stack gap="sm">
          {pairings.map((pairing, i) => {
            const name = i.toString() as keyof BettingFormValues;
            return (
              <div key={i}>
                <div>
                  <TeamName team={teams[group.teams[pairing.home]]} /> -{" "}
                  <TeamName team={teams[group.teams[pairing.away]]} />
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="1"
                      {...register(name, { required: true })}
                    />{" "}
                    1
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="x"
                      {...register(name, { required: true })}
                    />{" "}
                    x
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="2"
                      {...register(name, { required: true })}
                    />{" "}
                    2
                  </label>
                </div>
              </div>
            );
          })}
        </Stack>

        <Stack direction="row">
          <Box flex="1">
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <Slider
                  min={10000}
                  max={1000000}
                  step={10000}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Box>
          <Box>
            <strong>{currency(values.amount)}</strong>
          </Box>
        </Stack>

        <Button
          disabled={entries(values).some(
            ([k, v]) => k !== "amount" && v === ""
          )}
          block
          type="submit"
        >
          Veikkaa
        </Button>
      </Stack>{" "}
    </form>
  );
};

export default BettingForm;
