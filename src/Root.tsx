import React from "react";
import App from "./components/App";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import typography from "./services/typography";
import { GoogleFont, TypographyStyle } from "react-typography";
import { createGlobalStyle } from "styled-components";
import ErrorBoundary from "react-error-boundary";
import ErrorView from "./components/error/Error";

import { ThemeProvider } from "styled-components";
import theme from "./themes/white";

const GlobalStyle = createGlobalStyle`

  html {
    background-color: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.black}
  }

  body {
    padding: 0;
  }

  form {
    margin: 0;
    padding: 0;
  }

  p {
    margin: 1em 0;
  }

`;

const Root = props => {
  const { store } = props;
  return (
    <>
      <TypographyStyle typography={typography} />
      {/*<GoogleFont typography={typography} />*/}
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <>
              <GlobalStyle />
              <ErrorBoundary FallbackComponent={ErrorView}>
                <App />
              </ErrorBoundary>
            </>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </>
  );
};

export default Root;
