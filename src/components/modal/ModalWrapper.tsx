import React from 'react';
import styled from "styled-components";
import rem from "@util/func/rem";
import zIndex from "/styles/module/zIndex.module.scss";




const Wrap = styled.div`
  position: fixed;
  // ! z-index: ''; // global zindex에서 관리
  left: 50%;
  top: ${(props) => (props.positionCenter ? "50%" : 0)};
  transform: translate(-50%, ${(props) => (props.positionCenter ? "-50%" : 0)});
  padding: ${rem(32)};
  width: ${rem(360)};
  background-color: #fff;
  box-sizing: border-box;
  border-radius: ${rem(6)};
  box-shadow: 0 0 ${rem(30)} rgba(0, 0, 0, 0.15);

  overflow: hidden;
  transition-property: top, opacity, height;
  transition-duration: 0.3s;
  transition-timing-function: ease-out;
  animation: show var(--ani-default) forwards;

  &.active {
    top: 10vh;
    height: auto;
    opacity: 1;
    pointer-events: all;
    margin: auto;
    //padding: ;
  }
  &.inactive {
    top: 0;
    height: 0;
    opacity: 0;
    margin: 0;
    padding: 0;
    pointer-events: none;
  }

  @media (max-width: ${rem(600)}) {
    width: auto;
  } ;
`;


const ModalBackground = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  cursor: ${(props) => (props.onClick && "pointer")};
`;

interface PropsInterface{
  children: any;
  id?: string;
  className?: string;
  style?: object;
  label?: string;
  background?: boolean;
  onBackgroundClick?: Function
  positionCenter?: boolean;
  animation?: boolean;
}


function ModalWrapper({
  children,
  id,
  className,
  style,
  label,
  background,
  onBackgroundClick,
  positionCenter,
  animation,
  ...props
}:PropsInterface) {
  return (
    <>
      {background && (
        <ModalBackground
          className={`${zIndex["modal-wrapper-background"]}`}
          onClick={onBackgroundClick}
        />
      )}
      {
        <Wrap
          className={`${zIndex["modal-wrapper"]} ${className || ""}`}
          style={style}
          label={label}
          id={id}
          animation={animation}
          positionCenter={positionCenter}
          {...props}
        >
          {children}
        </Wrap>
      }
    </>
  );
}

export default ModalWrapper;
