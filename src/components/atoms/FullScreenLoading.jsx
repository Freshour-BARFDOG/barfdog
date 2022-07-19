import Spinner from '/src/components/atoms/Spinner';
import React from 'react';
import Styled from 'styled-components';

const ScreenLoader = Styled.div`
  position:fixed;
  z-index: 99999;
  display:flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255,255,255, ${props=> props.backgroundOpacity || 0.8});
  
  left:0;
  right:0;
  top:0;
  bottom:0;
`;
export const FullScreenLoading = ({opacity}) => {
  return <ScreenLoader backgroundOpacity={opacity}><Spinner style={{width: '50px', height: '50px'}}/></ScreenLoader>
}