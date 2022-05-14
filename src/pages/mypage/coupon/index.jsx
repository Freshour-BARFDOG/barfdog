import React, { useState } from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import styled from "styled-components";
import Modal_useCoupon from "@src/components/modal/modal_mypage_coupon";


const Temp_button = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #000;
  border-radius: 100px;
  color: #fff;
  font-size: 15px;
  padding: 5px 26px;
  font-weight: 500;
  cursor: pointer;
`;

function CouponPage() {
  const [isActiveModal, setIsActiveModal] = useState(false);

  const onActiveModalHandler = () => {
    setIsActiveModal(true);
  }




  return (
    <>
      <MetaTitle title="마이페이지 쿠폰" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <h1 style={{marginBottom:"20px"}}>마이페이지 쿠폰</h1>
            <hr />
            <section className="temp_section" style={{ padding: "10vh 0 " }}>
              <Temp_button onClick={onActiveModalHandler}>
                쿠폰 사용
              </Temp_button>
            </section>
            <hr />
          </MypageWrapper>
        </Wrapper>
      </Layout>
      {isActiveModal && (
        <Modal_useCoupon
          isActiveModal={isActiveModal}
          setIsActiveModal={setIsActiveModal}
        />
      )}
    </>
  );
}

export default CouponPage;
