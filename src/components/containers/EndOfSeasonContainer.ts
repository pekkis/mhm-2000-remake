import { connect } from "react-redux";
import EndOfSeason from "../EndOfSeason";
import { advance } from "../../ducks/game";
import { resolveEvent } from "../../ducks/event";
import { saveGame, quitToMainMenu } from "../../ducks/meta";
import { interestingCompetitions } from "../../data/selectors";
export default connect(
  state => ({
    turn: state.game.get("turn"),
    manager: state.manager.getIn(["managers", state.manager.get("active")]),
    managers: state.manager.get("managers"),
    teams: state.game.get("teams"),
    competitions: state.game.get("competitions"),
    events: state.event.get("events"),
    news: state.news.get("news"),
    interestingCompetitions: interestingCompetitions(
      state.manager.get("active")
    )(state),
    announcements: state.news.get("announcements")
  }),
  { advance, resolveEvent, saveGame, quitToMainMenu }
)(EndOfSeason);
