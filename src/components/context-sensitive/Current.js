import React from "react";
import { Link } from "react-router-dom";

const Current = props => {
  const { invitations } = props;
  return (
    <div>
      {invitations.filter(i => !i.get("participate")).count() > 0 && (
        <div>
          Pöydälläsi odottaa{" "}
          <Link to="/kutsut">avaamattomia kutsuja joulutauon turnauksiin.</Link>
        </div>
      )}
    </div>
  );
};

export default Current;
