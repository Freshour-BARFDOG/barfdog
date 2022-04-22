import React from 'react';
import styled from 'styled-components';
import rem from '@src/components/atoms/rem';


const ErrorMessageWrap = styled.span`
  font-size: ${(props) => props.fontSize ? props.fontSize : rem(13)} !important;
  color: var(--color-main);
  display:inline-block;
`;



function ErrorMessage({ children, fontSize }) {
  return <ErrorMessageWrap className='errorMSG' fontSize={fontSize}>{children}</ErrorMessageWrap>;
}

export default ErrorMessage;