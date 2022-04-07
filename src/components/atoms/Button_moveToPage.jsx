import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import rem from './rem';

const Button = styled.button`
  border-radius:${rem(4)};
  min-width:${rem(120)};
  background-color: var(--color-main);
  color:#fff;
  font-size:${rem(17)};
  font-weight:400;
  padding: ${rem(10)} ${rem(30)};


`



function button_moveToPage({text, path}) {
  const Name = text ? text : "홈으로 돌아가기";
  const Path = path ? path : '/';
  return (
    <Button className='btn_moveToPage'><Link href={Path} passHref><a>{Name}</a></Link></Button>
  )
}

export default button_moveToPage