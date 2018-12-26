import React from "react";
import App from "./components/containers/AppContainer";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import typography from "./services/typography";
import { GoogleFont, TypographyStyle } from "react-typography";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    padding: 1em;
  }
`;

const Root = props => {
  const { store } = props;
  return (
    <>
      <TypographyStyle typography={typography} />
      <GoogleFont typography={typography} />
      <GlobalStyle />
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </>
  );
};

export default Root;
