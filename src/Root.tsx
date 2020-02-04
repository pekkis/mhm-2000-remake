import React, { FunctionComponent } from "react";
import App from "./components/App";
import { Provider } from "react-redux";
import { useHistory } from "react-router-dom";
import typography from "./services/typography";
import { TypographyStyle } from "react-typography";
import ErrorBoundary from "react-error-boundary";
import ErrorView from "./components/error/Error";
import { Global } from "@emotion/core";

import { ThemeProvider } from "emotion-theming";
import theme from "./themes/white";
import { SagaMiddleware, Saga } from "redux-saga";
import { Store } from "redux";

interface Props {
  sagaMiddleware: SagaMiddleware;
  rootSaga: Saga<any[]>;
  store: Store;
}

const Root: FunctionComponent<Props> = props => {
  const history = useHistory();
  const { rootSaga, sagaMiddleware, store } = props;

  sagaMiddleware.run(rootSaga, {
    context: {
      history
    }
  });

  return (
    <>
      <TypographyStyle typography={typography} />
      {/*<GoogleFont typography={typography} />*/}
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <>
            <Global
              styles={theme => ({
                html: {
                  backgroundColor: theme.colors.white,
                  color: theme.colors.black
                },

                body: {
                  padding: 0
                },

                form: {
                  margin: 0,
                  padding: 0
                },

                p: {
                  margin: "1em 0"
                }
              })}
            />
            <ErrorBoundary FallbackComponent={ErrorView}>
              <App />
            </ErrorBoundary>
          </>
        </ThemeProvider>
      </Provider>
    </>
  );
};

export default Root;
