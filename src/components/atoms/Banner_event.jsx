import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import rem from './rem';
import isMobile from '/util/func/checkDevice.js';

// * 입력받을 내용: 배너이름 / 노출여부 / 배경색/ 글자색 / 링크주소 PC / 링크주소 Mobile

const Wrap = styled.div`
  background-color: ${(props) => props.bgColor || `var(--color-main)`};
  color: ${(props) => props.bgColor || `#fff`};
  box-sizing: border-box;
`;

const ATag = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${rem(60)};
  color: inherit;
  text-align: center;
  font-size: ${rem(20)};
`;



function Banner_event({Text, isVisible, bgColor, color, link_pc, link_mobile}) {
  const LINK = link_pc ? link_pc : '/';

  const innerText = Text || ( // 어드민에서 입력한 HTML태그를 받는다.
    <p>
      <span>친구초대할 때마다 </span>
      <b>5천원 무한적립!</b>
    </p>
  ); // 태그로 받는다.


  return (
    <Wrap bgColor={bgColor}>
      <Link href={LINK} passHref>
        <ATag>{innerText}</ATag>
      </Link>
    </Wrap>
  );
}

export default Banner_event;