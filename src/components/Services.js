import React from "react";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import ManagerInfo from "./manager/ManagerInfo";
import ButtonRow from "./form/ButtonRow";
import Button from "./form/Button";
import arenas from "../data/arenas";
import styled, { css } from "styled-components";
import { currency } from "../services/format";
import Toggle from "react-toggle";
import Markdown from "react-markdown";

import services from "../data/services";

const ServicesList = styled.div`
  margin: 1em 0;
`;

const Services = props => {
  const { manager, teams, toggleService, basePrices } = props;

  return (
    <HeaderedPage>
      <Header back>
        <h2>Erikoistoimenpiteet</h2>
      </Header>

      <ManagerInfo manager={manager} teams={teams} />

      <ServicesList>
        {services
          .map((service, key) => {
            const basePrice = basePrices.get(key);
            return (
              <div key={key}>
                <div>
                  <Toggle
                    id={key}
                    checked={manager.getIn(["services", key])}
                    onChange={() => {
                      toggleService(manager.get("id"), key);
                    }}
                  />
                  <label htmlFor={key}>
                    <strong>{service.get("name")}</strong>
                  </label>
                </div>

                <Markdown
                  source={service.get("description")(
                    service.get("price")(basePrice, manager)
                  )}
                />
              </div>
            );
          })
          .toList()}
      </ServicesList>
    </HeaderedPage>
  );
};

export default Services;
