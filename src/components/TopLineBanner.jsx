import React, { useState } from "react";
import styled from "styled-components";
import Wrapper from "/src/components/common/Wrapper";
import Link from "next/link";
import rem from './atoms/rem';


const Atag = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${rem(18)};
  color: #fff;
  padding: ${rem(6)} 0;
  height: ${rem(40)};
  white-space: nowrap;
  box-sizing: border-box;
`;

const TopLineBanner = () => {
  const [text, setText] = useState(
    "지금 바프독 가입하고 첫 정기구독 50% 할인 받기 > "
  );
  const [bgColor, setBgColor] = useState("var(--color-main)");


  return (
    <div id="TOP_LINE_BANNER" style={{ background: bgColor }}>
      <Wrapper>
        <Link href="/account/signup" passHref>
          <Atag>{text}</Atag>
        </Link>
      </Wrapper>
    </div>
  );
};

export default TopLineBanner;
