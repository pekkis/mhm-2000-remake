import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import Calendar from "./ui/Calendar";
import { CRISIS_MORALE_MAX } from "../data/constants";
import Button from "./form/Button";
import { useDispatch, useSelector } from "react-redux";
import { activeManager } from "../services/selectors";
import { MHMState } from "../ducks";
import { closeMenu } from "../ducks/ui";
import { saveGame, quitToMainMenu } from "../ducks/game";

const ActionMenu: FunctionComponent = () => {
  // const team = getEffective(teams.get(manager.get("team")));

  const dispatch = useDispatch();
  const manager = useSelector(activeManager);
  const turn = useSelector((state: MHMState) => state.game.turn);
  const teams = useSelector((state: MHMState) => state.team.teams);

  if (!manager.team) {
    throw new Error("Invalid team for manager");
  }

  const team = teams[manager.team];

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link onClick={() => dispatch(closeMenu())} to="/">
              Päävalikko
            </Link>
          </li>

          {team.morale <= CRISIS_MORALE_MAX && (
            <Calendar when={c => c.crisisMeeting}>
              <li>
                <Link
                  onClick={() => dispatch(closeMenu())}
                  to="/kriisipalaveri"
                >
                  Kriisipalaveri
                </Link>
              </li>
            </Calendar>
          )}
          <Calendar when={c => c.transferMarket}>
            <li>
              <Link
                onClick={() => dispatch(closeMenu())}
                to="/pelaajamarkkinat"
              >
                Pelaajamarkkinat
              </Link>
            </li>
          </Calendar>
          <li>
            <Link onClick={() => dispatch(closeMenu())} to="/sarjataulukot">
              Sarjataulukot
            </Link>
          </li>
          <li>
            <Link onClick={() => dispatch(closeMenu())} to="/strategia">
              Strategia
            </Link>
          </li>
          <li>
            <Link onClick={() => dispatch(closeMenu())} to="/areena">
              Areena
            </Link>
          </li>

          <li>
            <Link
              onClick={() => dispatch(closeMenu())}
              to="/erikoistoimenpiteet"
            >
              Erikoistoimenpiteet
            </Link>
          </li>

          <Calendar when={c => c.pranks}>
            <li>
              <Link onClick={() => dispatch(closeMenu())} to="/jaynat">
                Jäynät
              </Link>
            </li>
          </Calendar>

          <li>
            <Link onClick={() => dispatch(closeMenu())} to="/tilastot">
              Tilastot
            </Link>
          </li>

          <Calendar
            when={(turn, calendar, competitions) => {
              return (
                turn.gamedays.includes("phl") && competitions.phl.phase === 0
              );
            }}
          >
            <li>
              <Link onClick={() => dispatch(closeMenu())} to="/veikkaus">
                Veikkaus
              </Link>
            </li>
          </Calendar>

          <li>
            <Link onClick={() => dispatch(closeMenu())} to="/debug">
              Devausmenukka
            </Link>
          </li>
        </ul>
      </nav>
      <Button
        block
        disabled={turn.phase !== "action"}
        type="button"
        onClick={() => {
          dispatch(saveGame());
          dispatch(closeMenu());
        }}
      >
        Tallenna
      </Button>

      <Button
        block
        type="button"
        onClick={() => {
          dispatch(quitToMainMenu());
          dispatch(closeMenu());
        }}
      >
        Lopeta!
      </Button>
    </div>
  );
};

export default ActionMenu;
