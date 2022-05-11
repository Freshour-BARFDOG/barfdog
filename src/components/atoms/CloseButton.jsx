import React from 'react';
import styled from 'styled-components';
import rem from "@src/components/atoms/rem";
import { useModalContext } from "@store/modal-context";


const Button = styled.button`
  width: ${rem(16)};
  height: ${rem(16)};
  display: inline-block;
  position: relative;
  cursor:pointer;

  &:before,
  &:after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: ${rem(1)};
    background-color: var(--color-line-01);
  }
  &:before {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &:after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;



function CloseButton({className}) {

  const mct = useModalContext();
  const onClickHandler = () => mct.onHide();

  return <Button type="button" className={className} onClick={onClickHandler} />;
}

export default CloseButton;