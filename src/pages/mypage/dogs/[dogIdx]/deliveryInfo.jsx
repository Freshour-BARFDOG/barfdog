import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import s from "src/pages/mypage/dogs/[dogIdx]/deliveryInfo.module.scss";
import Image from "next/image";


function MypageSubscribe_DeliveryInfoPage() {

  return (
    <>
      <MetaTitle title={`정기구독 배송안내`} />
      <Layout>
        <Wrapper>
          <section className={s.top_content}>
            <div className={s.top_text_box}>
              <div className={s.title}>정기구독 배송안내</div>
              <div className={s.text_row2}>고객님의 정기구독 발송 예정일은</div>
              <div className={s.text_row2}><span>3월 16일</span> 입니다</div>
              <div className={s.text_row3}>(선택하신 풀 플랜은 하루 2끼 기준, 2주마다 정기 배송됩니다)</div>
            </div>
          </section>

          <section className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/mypage/delivery_schedule.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </section>


          <section className={s.mid_content}>
            <div className={s.mid_content_title}>
              - 주의사항 -
            </div>
            <div className={s.mid_content_box}>
              <div className={s.mid_content_inner_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/mypage/delivery_precautions_1.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
                <div className={s.mid_content_inner_box_text}>
                  냉동보관
                </div>
                <div className={s.mid_content_inner_box_text2}>
                식사는 도착 후 바로 <br />냉동 보관해주세요
                </div>
              </div>

              <div className={s.mid_content_inner_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/mypage/delivery_precautions_2.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>

                <div className={s.mid_content_inner_box_text}>
                  하루 전 해동
                </div>
                <div className={s.mid_content_inner_box_text2}>
                  급여 하루 전 냉장실 해동<br />
                  또는 급여 전 미지근한 물로<br />
                  해동해주세요
                </div>
              </div>

              <div className={s.mid_content_inner_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/mypage/delivery_precautions_3.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
                <div className={s.mid_content_inner_box_text}>
                  재냉동 금지
                </div>
                <div className={s.mid_content_inner_box_text2}>
                  한번 해동된 식사는 <br />
                  재냉동하지 말아주세요
                </div>
              </div>

              <div className={s.mid_content_inner_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/mypage/delivery_precautions_4.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
                <div className={s.mid_content_inner_box_text}>
                  보관시간 
                </div>
                <div className={s.mid_content_inner_box_text2}>
                  30시간 이상 지난제품은<br />
                  급여하지 마시고 폐기해주세요
                </div>
              </div>

              <div className={s.mid_content_inner_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/mypage/delivery_precautions_5.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
                <div className={s.mid_content_inner_box_text}>
                  유통기한
                </div>
                <div className={s.mid_content_inner_box_text2}>
                  유통기한은 제조일로부터<br />
                  3개월입니다
                </div>
              </div>

            </div>
          </section>



          <section className={s.image_box2}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/mypage/delivery_package.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </section>


          <section className={s.btn_section}>
              <div className={s.box_btn}>
                <div className={s.left_btn}>
                  홈으로
                </div>
                <div className={s.right_btn}>
                  주문서로 이동
                </div>
              </div>
            </section>
        </Wrapper>
      </Layout>
    </>
  );
}

export default MypageSubscribe_DeliveryInfoPage;


