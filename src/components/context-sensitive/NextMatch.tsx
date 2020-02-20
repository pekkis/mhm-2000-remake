/** @jsx jsx */
import { jsx } from "theme-ui";
import { Box } from "theme-ui";
import { FunctionComponent } from "react";
import { Team } from "../../types/team";
import { MapOf, MatchDescriptor } from "../../types/base";
import { HumanManager } from "../../types/manager";
import competitionMap from "../../services/competitions";
import { intensityMap } from "../../services/intensity";
import { values } from "ramda";
import { useDispatch } from "react-redux";
import {
  ManagerSelectIntensityAction,
  MANAGER_SELECT_INTENSITY
} from "../../ducks/manager";
import { manager } from "../../ducks";

interface Props {
  team: Team;
  teams: MapOf<Team>;
  manager: HumanManager;
  match: MatchDescriptor;
}

const NextMatch: FunctionComponent<Props> = ({ match, team, manager }) => {
  const dispatch = useDispatch();

  const canChooseIntensity = competitionMap[
    match.competition
  ].canChooseIntensity(match.phase, match.group);

  return (
    <Box
      p={1}
      bg="grey"
      my={1}
      sx={{
        borderRadius: "borderRadius"
      }}
    >
      {JSON.stringify(match)}

      {canChooseIntensity && (
        <form>
          <label htmlFor="intensity">valitse intensiteetti</label>
          <select
            name="intensity"
            value={team.intensity}
            onChange={e => {
              dispatch<ManagerSelectIntensityAction>({
                type: MANAGER_SELECT_INTENSITY,
                payload: {
                  manager: manager.id,
                  intensity: parseInt(e.currentTarget.value, 10)
                }
              });
            }}
          >
            {values(intensityMap).map(intensity => {
              return (
                <option key={intensity.id} value={intensity.id}>
                  {intensity.label}
                </option>
              );
            })}
          </select>
        </form>
      )}
    </Box>
  );
};

export default NextMatch;
