import React, { forwardRef } from 'react';
import styled from 'styled-components';
import rem from '@util/func/rem';

const Container = styled.div`
  overflow-y: scroll;
  height: ${(props) => props.height && rem(props.height)};
  min-height: 0;
  &::-webkit-scrollbar {
    width: ${(props) =>
      props.scrollBarWidth ? rem(props.scrollBarWidth) : rem(12)};
    height: 0;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #fff;
    border: ${rem(1)} solid #ababab;
    border-radius: ${rem(12)};
  }
  &::-webkit-scrollbar-track {
    background-color: #ddd;
    border-radius: ${rem(12)};
  }
`;

function ScrollContainer(
  { height, style, className, children, scrollBarWidth, ...props },
  ref,
) {
  // * forwardRef((props,ref)=> {return <Conponent/>})

  return (
    <Container
      height={height}
      scrollBarWidth={scrollBarWidth}
      style={style}
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </Container>
  );
}

export default forwardRef(ScrollContainer);
