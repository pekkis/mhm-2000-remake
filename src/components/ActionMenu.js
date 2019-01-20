import React from "react";
import { Link } from "react-router-dom";
import Calendar from "./ui/containers/CalendarContainer";
import { getEffective } from "../services/effects";
import { CRISIS_MORALE_MAX } from "../data/constants";
import Button from "./form/Button";
import { List } from "immutable";

const ActionMenu = props => {
  const { manager, teams, closeMenu, saveGame, quitToMainMenu, turn } = props;
  const team = getEffective(teams.get(manager.get("team")));

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link onClick={() => closeMenu()} to="/">
              Päävalikko
            </Link>
          </li>

          {team.get("morale") <= CRISIS_MORALE_MAX && (
            <Calendar when={c => c.get("crisisMeeting")}>
              <li>
                <Link onClick={() => closeMenu()} to="/kriisipalaveri">
                  Kriisipalaveri
                </Link>
              </li>
            </Calendar>
          )}
          <Calendar when={c => c.get("transferMarket")}>
            <li>
              <Link onClick={() => closeMenu()} to="/pelaajamarkkinat">
                Pelaajamarkkinat
              </Link>
            </li>
          </Calendar>
          <li>
            <Link onClick={() => closeMenu()} to="/sarjataulukot">
              Sarjataulukot
            </Link>
          </li>

          <li>
            <Link onClick={() => closeMenu()} to="/areena">
              Areena
            </Link>
          </li>

          <li>
            <Link onClick={() => closeMenu()} to="/erikoistoimenpiteet">
              Erikoistoimenpiteet
            </Link>
          </li>

          <Calendar when={c => c.get("pranks")}>
            <li>
              <Link onClick={() => closeMenu()} to="/jaynat">
                Jäynät
              </Link>
            </li>
          </Calendar>

          <li>
            <Link onClick={() => closeMenu()} to="/tilastot">
              Tilastot
            </Link>
          </li>

          <Calendar
            when={(e, c, s) => {
              return (
                e.get("gamedays", List()).includes("phl") &&
                s.game.getIn(["competitions", "phl", "phase"]) === 0
              );
            }}
          >
            <li>
              <Link onClick={() => closeMenu()} to="/veikkaus">
                Veikkaus
              </Link>
            </li>
          </Calendar>

          <li>
            <Link onClick={() => closeMenu()} to="/debug">
              Devausmenukka
            </Link>
          </li>
        </ul>
      </nav>
      <Button
        block
        disabled={turn.get("phase") !== "action"}
        type="button"
        onClick={() => {
          saveGame();
          closeMenu();
        }}
      >
        Tallenna
      </Button>

      <Button
        block
        type="button"
        onClick={() => {
          quitToMainMenu();
          closeMenu();
        }}
      >
        Lopeta!
      </Button>
    </div>
  );
};

export default ActionMenu;
