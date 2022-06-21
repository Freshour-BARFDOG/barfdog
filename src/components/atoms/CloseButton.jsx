import React from 'react';
import styled from 'styled-components';
import rem from "@util/func/rem";
import { useModalContext } from "@store/modal-context";


const Button = styled.button`
  width: ${(props) => props.style?.width || rem(16)};
  height: ${(props) => props.style?.height || rem(16)};
  display: inline-block;
  position: relative;
  cursor: pointer;

  &:before,
  &:after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: ${rem(1)};
    background-color: ${(props) => props.lineColor || `var(--color-line-01)`};
  }
  &:before {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &:after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;



function CloseButton({ className, style, onClick, lineColor, ...props }) {
  const mct = useModalContext();
  const onClickHandler = () => mct.onHide();

  return (
    <Button
      type="button"
      style={style}
      className={className}
      onClick={onClick || onClickHandler}
      lineColor={lineColor}
      {...props}
    />
  );
}

export default CloseButton;