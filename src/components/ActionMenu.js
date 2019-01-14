import React from "react";
import { Link } from "react-router-dom";
import Calendar from "./ui/containers/CalendarContainer";
import { getEffective } from "../services/effects";

import { CRISIS_MORALE_MAX } from "../data/constants";

import ButtonRow from "./form/ButtonRow";
import Button from "./form/Button";

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

          <li>
            <Link onClick={() => closeMenu()} to="/jaynat">
              Jäynät
            </Link>
          </li>

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
