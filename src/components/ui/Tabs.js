import React from "react";
import styled from "styled-components";
import Tab from "./Tab";

const TabsList = styled.ul`
  background-color: rgba(33, 33, 33, 0.3);
  padding: 1em;
  display: flex;
  flex-basis: 100%;
  align-items: center;
  align-content: stretch;

  list-style-position: inside;
  list-style-type: none;
  margin: 1em 0;
  padding: 0;
  ${Tab} + ${Tab} {
    margin-left: 1em;
  }
`;

const TabContent = styled.div`
  padding: 0;
`;

const Tabs = props => {
  const { className, children, selected, onSelect } = props;

  const childrenArray = React.Children.toArray(children);

  console.log(props);

  console.log(childrenArray[selected]);

  return (
    <div className={className}>
      <TabsList>
        {childrenArray.map((child, key) =>
          React.cloneElement(child, {
            isSelected: key === selected,
            onSelect: () => onSelect(key)
          })
        )}
      </TabsList>

      <TabContent>{childrenArray[selected].props.children}</TabContent>
    </div>
  );
};

export default styled(Tabs)`
  background-color: rgba(255, 255, 255);
`;
