import React from "react";
import strategies from "../data/strategies";
import Button from "./form/Button";

const SelectStrategy = props => {
  const { manager, selectStrategy } = props;

  return (
    <section>
      <h2>Valitse harjoittelustrategia</h2>

      <p>
        On kesä, ja aika määrätä mihin joukkue ajoittaa huippukuntonsa! Tarjolla
        on kolme vaihtoehtoa:
      </p>

      {strategies.map(strategy => {
        return (
          <div key={strategy.get("id")}>
            <h3>{strategy.get("name")}</h3>

            <p>{strategy.get("description")}</p>

            <p>
              <Button
                block
                onClick={() => {
                  selectStrategy(manager.get("id"), strategy.get("id"));
                }}
              >
                Valitse strategia "{strategy.get("name")}"
              </Button>
            </p>
          </div>
        );
      })}
    </section>
  );
};

export default SelectStrategy;
