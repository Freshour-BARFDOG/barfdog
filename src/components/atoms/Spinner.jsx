import React from 'react';
import styledComponents from 'styled-components';
import { ImSpinner2 } from 'react-icons/im';
import { CgSpinner } from 'react-icons/cg';

const Wrap = styledComponents.i`
    display:flex;
    align-items: center;
    justify-content:center;
    pointer-events:none;
    // opacity:0;
    animation: rotate ${(props) => props.speed}s linear infinite ;
    @keyframes rotate {
      from{transform:rotate(0);}
      to{transform:rotate(360deg);}
    }
  `;

const Spinner = ({ style, speed = '0.6', ...props }) => {
  const defaultStyle = {
    ...style,
    width: style?.width || '20',
    height: style?.height || '20',
    color: style?.color || 'var(--color-main)',
  };

  return (
    <Wrap className={'spinner'} speed={speed} {...props}>
      <ImSpinner2 style={defaultStyle} />
    </Wrap>
  );
};

export default Spinner;
