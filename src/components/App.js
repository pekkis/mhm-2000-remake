import React from "react";
import StartMenu from "./containers/StartMenuContainer";
import Game from "./containers/GameContainer";
import * as Sentry from "@sentry/browser";

class App extends React.Component {
  state = {
    hasError: false
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    Sentry.withScope(scope => {
      Object.keys(info).forEach(key => {
        scope.setExtra(key, info[key]);
      });
      Sentry.captureException(error);
    });
  }

  render() {
    const { hasError } = this.state;
    const { started } = this.props;

    if (hasError) {
      return (
        <div>
          <h1>Jokin meni pieleen. Voi örr!</h1>

          <p>Syynä lienee tieteelle tuntematon bugi.</p>

          <p>
            Virhe on toivottavasti jo lähetetty palvelimelle turvaan ja Pekkis
            näkee sen! Toivottavasti olit tallentanut, koska tästä ei toivuta!
          </p>
        </div>
      );
    }

    switch (true) {
      case !started:
        return <StartMenu />;

      default:
        return <Game />;
    }
  }
}

export default App;
