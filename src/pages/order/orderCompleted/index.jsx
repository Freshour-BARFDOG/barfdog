import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";
import s from 'src/pages/order/orderCompleted/index.module.scss';
import Image from 'next/image';

function OrderCompletedPage() {
  return (
    <>
      <MetaTitle title="주문완료" />
      <Layout>
        <Wrapper>


          <section className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/survey/survey_loading_left.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/survey/survey_loading_right.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/survey/survey_loading_left.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </section>

          <section className={s.text_box}>
            <div className={s.row_1}>
              주문완료
            </div>
            <div className={s.row_2}>
              주문 취소는 다음 배송예정일 전<br className={s.br} /> 금요일 오후 12시까지<br />
              고객님이 직접 취소 가능합니다. 
              <br />
              <br />
              (바프독은 항상 금,토,일요일에 생산되어<br className={s.br} /> 수요일에 주문이 발송 됩니다.)
            </div>
          </section>

          <section className={s.order_box}>
          <div className={s.grid_box}>
            <div className={s.row_3}>
              배송 상품
            </div>
            <div className={s.row_4}>
              스타터 프리미엄 풀 플랜 외 1개
            </div>
            <div className={s.row_3}>
              배송 주소
            </div>
            <div className={s.row_4}>
             충북 충주시 번영대로 208 수빌딩 4층
            </div>
            <div className={s.row_3}>
              발송예정일
            </div>
            <div className={s.row_4}>
             2022-02-16 수요일
            </div>
          </div>
          </section>

          <section className={s.btn_box}>
            <div className={s.flex_box}>
              <button className={s.left_btn}>
                홈으로
              </button>
              <button className={s.right_btn}>
                주문내역 확인
              </button>
            </div>
          </section>





          {/* 기존 코드 */}

          {/* <section className={s.text_box}>
            <div className={s.row_1}>
              견주님,<br />
              바프독과 함께해 주셔서 감사합니다
            </div>
            <div className={s.row_2}>
              바프독은 주문 후 맞춤 생산되어 <span>가장 신선한 상태</span>로 전달됩니다.
            </div>
          </section>
          <section className={s.btn_box}>
            <div className={s.flex_box}>
              <div className={s.left_btn}>
                홈으로
              </div>
              <div className={s.right_btn}>
                주문내역 보기
              </div>
            </div>
          </section> */}

        </Wrapper>
      </Layout>
    </>
  );
}

export default OrderCompletedPage;
