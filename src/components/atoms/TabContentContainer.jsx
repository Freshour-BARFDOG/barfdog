import React from 'react'
import styledComponents from 'styled-components';

const Container = styledComponents.div`
  display:none;
  animation: show var(--ani-default);
  &.active{display:block;}
`; 

export default function TabContentContainer ({ children }) {
  return <div className="tabContentContainer">{children}</div>;
};

export const LeftContainer = ({ activeMenu, children }) => {
  return (
    <Container
      className={activeMenu === "left" ? "active" : ""}
      data-title="content-left-container"
    >
      {children}
    </Container>
  );
};

export const RightContainer = ({ activeMenu, children }) => {
  return (
    <Container
      className={activeMenu === "right" ? 'active' : ""}
      data-title="content-right-container"
    >
      {children}
    </Container>
  );
};
