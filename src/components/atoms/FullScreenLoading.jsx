import Spinner from '/src/components/atoms/Spinner';
import React from 'react';
import Styled from 'styled-components';
import Image from "next/image";
import RunningDog from '/public/img/barfdog_Loading.gif'
import rem from "/util/func/rem";

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
const ImageWrap = Styled.span`
  width: ${rem(100)};
  aspect-ratio: 267/159;
  position:relative;
`

export const FullScreenLoading = ({opacity}) => {
  return <ScreenLoader backgroundOpacity={opacity}><Spinner style={{width: '50px', height: '50px'}}/></ScreenLoader>
}




export const FullScreenRunningDog = ({opacity}) => {
  return <ScreenLoader backgroundOpacity={opacity}>
    <ImageWrap>
      <Image src={RunningDog} objectFit={'contains'} layout={'fill'}></Image>
    </ImageWrap>
  </ScreenLoader>
}