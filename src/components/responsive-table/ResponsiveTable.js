import React from "react";
import styled from "styled-components";

const TableScroller = styled.div`
  position: relative;
  max-width: 600px;
  overflow: hidden;
  border: none;

  table {
    width: 100%;
    margin: auto;
    border-collapse: separate;
    border-spacing: 0;
  }

  th {
    background-color: rgb(255, 255, 255);
  }

  th,
  td {
    padding: 0.25em 0.5em;
    border: none;
    white-space: nowrap;
    vertical-align: top;
  }
  thead,
  tfoot {
    background: #f9f9f9;
  }

  .clone {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
  .clone th,
  .clone td {
    visibility: hidden;
  }
  .clone td,
  .clone th {
    border-color: transparent;
  }
  .clone tbody th {
    visibility: visible;
    color: red;
  }
  .clone .fixed {
    border: none;
    visibility: visible;
  }
  .clone thead,
  .clone tfoot {
    background: transparent;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow: auto;
`;

const ResponsiveTable = props => {
  const { children } = props;

  const clone = React.cloneElement(children, { isClone: true });

  // console.log("clone", clone);
  // const cteams = competition.get("teams").map(tid => teams.get(tid));
  return (
    <TableScroller>
      <TableWrapper>{children}</TableWrapper>
      {clone}
    </TableScroller>
  );
};

export default ResponsiveTable;
