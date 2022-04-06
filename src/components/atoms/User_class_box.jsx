import React from 'react';
import styled from 'styled-components';
import rem from './rem';



function User_class_box ( {user_class} ) {
  const Span = styled.span`
  font-size:${rem(16)};
  color:#696969;
  padding:${rem(4)} ${rem(18)};
  box-sizing: border-box;
  border-radius: ${rem(30)};
  border: 1px solid #9a9a9a;
  cursor:default;
  `;

  return (
    <>
    <Span id='user_class'>{user_class}</Span>
    </>
  )
}

export default User_class_box;