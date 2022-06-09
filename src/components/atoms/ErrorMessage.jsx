import React from 'react';
import styled from 'styled-components';
import rem from '@src/components/atoms/rem';


const ErrorMessageWrap = styled.pre`
  font-size: ${(props) => props.fontSize ? props.fontSize : rem(13)} !important;
  color: ${(props) => props.style?.color || `var(--color-main)`};
  display:inline-block;
  cursor: default;
`;



function ErrorMessage({ children, fontSize, style, ...props }) {
  return <ErrorMessageWrap className='errorMSG' fontSize={fontSize} style={style} {...props}>{children}</ErrorMessageWrap>;
}

export default ErrorMessage;