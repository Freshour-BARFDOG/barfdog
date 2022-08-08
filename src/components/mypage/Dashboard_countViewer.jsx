import React from 'react'
import styled from "styled-components";
import rem from '@util/func/rem';

const Viewer = styled.li`
  border-left: 1px solid var(--color-line);
  padding: ${rem(24)};
  box-sizing: border-box;
  text-align: center;
`;

const Title = styled.h5`
  font-size: ${rem(14)};
  font-weight: 500;
  margin-bottom: ${rem(16)};
`;


const Counter = styled.i`
  font-size: ${rem(24)};
`;


function Dashboard_countViewer({title, counter, unit}) {
  return (
    <Viewer>
      <Title>{title}</Title>
      <Counter>
        {counter || 0} {unit}
      </Counter>
    </Viewer>
  );
}

export default Dashboard_countViewer;