import React from "react";
import strategies from "../data/strategies";
import Button from "./form/Button";

const SelectStrategy = props => {
  const { player, selectStrategy } = props;

  return (
    <section>
      <h2>Valitse harjoittelustrategia</h2>

      <p>
        On kesä, ja aika määrätä mihin joukkue ajoittaa huippukuntonsa! Tarjolla
        on kolme vaihtoehtoa:
      </p>

      {strategies.map(strategy => {
        return (
          <div key={strategy.id}>
            <h3>{strategy.name}</h3>

            <p>{strategy.description}</p>

            <p>
              <Button
                block
                onClick={() => {
                  selectStrategy(player.get("id"), strategy.id);
                }}
              >
                Valitse strategia "{strategy.name}"
              </Button>
            </p>
          </div>
        );
      })}
    </section>
  );
};

export default SelectStrategy;
