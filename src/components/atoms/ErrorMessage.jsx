import React from 'react';
import styled from 'styled-components';
import rem from '/util/func/rem';


const ErrorMessageWrap = styled.pre`
  font-size: ${(props) => props.fontSize ? props.fontSize : rem(13)} !important;
  color: ${(props) => props.valid ? `var(--color-checked)` : props.style?.color || `var(--color-main)`};
  display:inline-block;
  cursor: default;
`;



function ErrorMessage({ children, fontSize, valid, ...props }) {
  return <ErrorMessageWrap className='errorMSG' fontSize={fontSize} valid={valid} {...props}>{children}</ErrorMessageWrap>;
}

export default ErrorMessage;