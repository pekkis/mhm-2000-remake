import React, { FunctionComponent } from "react";

interface Props {}

const ErrorView: FunctionComponent<Props> = props => {
  return (
    <div>
      <div>
        <h1>Jokin meni pieleen. Voi örr!</h1>

        <p>Syynä lienee tieteelle tuntematon bugi.</p>

        <p>
          Virhe on toivottavasti jo lähetetty palvelimelle turvaan ja Pekkis
          näkee sen! Toivottavasti olit tallentanut, koska tästä ei toivuta!
        </p>
      </div>
    </div>
  );
};

export default ErrorView;
