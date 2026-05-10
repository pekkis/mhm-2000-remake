import type { FC } from "react";
import { useForm, Controller } from "react-hook-form";
import Slider from "@/components/ui/Slider";
import { currency } from "@/services/format";
import odds from "@/data/championship-betting";
import Button from "@/components/ui/Button";
import type { Team } from "@/state/game";
import type { Manager } from "@/state/game";
import type { Competition } from "@/types/competitions";
import Box from "@/components/ui/Box";
import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";

type ChampionshipBettingFormValues = {
  team: string;
  amount: number;
};

type ChampionshipBettingFormProps = {
  manager: Manager;
  competition: Competition;
  teams: Team[];
  betChampion: (
    managerId: string,
    teamId: number,
    amount: number,
    odds: number
  ) => void;
};

const BettingForm: FC<ChampionshipBettingFormProps> = ({
  manager,
  competition,
  teams,
  betChampion
}) => {
  const teamsAndOdds = odds(competition, teams);

  const { register, handleSubmit, control, watch } =
    useForm<ChampionshipBettingFormValues>({
      defaultValues: {
        team: "",
        amount: 10000
      }
    });

  const values = watch();

  const onSubmit = (data: ChampionshipBettingFormValues) => {
    const teamId = parseInt(data.team, 10);
    betChampion(
      manager.id,
      teamId,
      data.amount,
      teamsAndOdds.find((t) => t.id === teamId)!.odds
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Heading level={3}>Valitse ehdokkaasi</Heading>

        <Box>
          {teamsAndOdds.map((team) => {
            return (
              <div key={team.id}>
                <label>
                  <input
                    type="radio"
                    value={team.id.toString()}
                    {...register("team", { required: true })}
                  />
                  {team.name} ({team.odds})
                </label>
              </div>
            );
          })}
        </Box>

        <Heading level={3}>Valitse panos</Heading>

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
                  onValueChange={field.onChange}
                />
              )}
            />
          </Box>

          <Box>
            <strong>{currency(values.amount)}</strong>
          </Box>
        </Stack>

        <Button disabled={values.team === ""} block type="submit">
          Veikkaa mestaria
        </Button>
      </Stack>
    </form>
  );
};

export default BettingForm;
