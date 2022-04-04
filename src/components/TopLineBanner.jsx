import React from 'react';
import styled from "styled-components";
import Wrapper from '/src/components/common/Wrapper';




class TopLineBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "지금 바프독 가입하고 첫 정기구독 50% 할인 받기 > ",
      bgColor: "var(--color-main)",
    };
  }

  render() {

    const Cont = styled.div`
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      color: #fff;
    `;
    function BannerCont({ children, ...rest  }) {
      return <Cont {...rest}>{children}</Cont>

    }

    return (
      <div id="BF_TOP_LINE_BANNER" style={{ background: this.state.bgColor }}>
        <Wrapper>
          <div className="inner">
            <BannerCont>{this.state.text}</BannerCont>
          </div>
        </Wrapper>
      </div>
    );
  }
  
}

export default TopLineBanner