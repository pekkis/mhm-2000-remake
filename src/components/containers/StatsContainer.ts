import { connect } from "react-redux";
import Stats from "../Stats";
import { MHMState } from "../../ducks";

export default connect((state: MHMState) => ({
  manager: state.manager.getIn(["managers", state.manager.get("active")]),
  teams: state.game.get("teams"),
  competitions: state.game.get("competitions"),
  stats: state.stats,
  countries: state.country.countries
}))(Stats);
