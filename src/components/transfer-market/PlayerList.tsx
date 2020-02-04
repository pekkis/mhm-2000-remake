import React, { FunctionComponent } from "react";
import { Player } from "../../types/player";
import { range } from "ramda";
import Flag from "react-world-flags";
import { Link } from "react-router-dom";

interface Props {
  totalPages: number;
  players: Player[];
  setPage: (pageId: number) => void;
}

const PlayerList: FunctionComponent<Props> = ({
  totalPages,
  players,
  setPage
}) => {
  return (
    <div>
      <h2>Pelaajamarkkinat</h2>

      <div>
        {range(0, totalPages).map(pageId => {
          return (
            <span key={pageId}>
              <button
                onClick={() => {
                  setPage(pageId);
                }}
              >
                {pageId + 1}
              </button>
              <span> | </span>
            </span>
          );
        })}
      </div>

      <table>
        <thead>
          <tr>
            <th>Nimi</th>
            <th>Ikä</th>
            <th>Maa</th>
            <th>PP</th>
            <th>T</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => {
            return (
              <tr key={player.id}>
                <td>
                  <Link to={`/pelaajamarkkinat/${player.id}`}>
                    {player.lastName}, {player.firstName}.
                  </Link>
                </td>
                <td>{player.age}</td>
                <td>
                  <Flag code={player.country} height={16} /> {player.country}
                </td>
                <td>{player.position}</td>
                <td>{player.skill}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerList;
