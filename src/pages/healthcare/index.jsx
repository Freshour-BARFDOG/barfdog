import React from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from '/src/pages/healthcare/healthcare.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import VetImg from '/public/img/healthcare/vet.jpg';
import SubscribeImg from '/public/img/healthcare/subscribe.jpg';
import KitImg from '/public/img/healthcare/kit.png';

export default function HealthcarePage() {
  return (
    <>
      <MetaTitle title="건강케어" />
      <Layout>
        <Wrapper>
          {/* <section className={s.review_title}>
            <div>건강케어 서비스</div>
          </section> */}

          <section className={s.body_container}>
            <ul>
              <li>
                <div className={s.box_wrap}>
                  <div className={s.img_wrap_sub}>
                    <Image src={SubscribeImg} alt="SubscribeImg" />
                  </div>
                  <div className={s.box_title}>
                    <p>AI 추천 식단</p>

                    <Link href="/surveyGuide">
                      <a className={s.menu_sub_title}>바로가기</a>
                    </Link>
                  </div>
                </div>
                <div className={s.box_text}>
                  반려견에게 가장 적합한 영양소를 제공하기 위해, AI가 반려동물의
                  나이, 견종, 건강 상태 등을 고려하여 최적화된 한 끼 맞춤형
                  식단을 추천합니다
                </div>
              </li>

              <li>
                <div className={s.box_wrap}>
                  <div className={s.img_wrap}>
                    <Image src={KitImg} alt="KitImg" />
                  </div>
                  <div className={s.box_title}>
                    <p>진단 기기</p>
                    <Link href="/healthcare/kit">
                      <a className={s.menu_sub_title}>바로가기</a>
                    </Link>
                  </div>
                </div>
                <div className={s.box_text}>
                  반려견의 변을 분석해 건강 상태를 확인하는 서비스로 이 서비스를
                  통해 반려견의 기본적인 건강 지표를 측정하여 질병의 조기 발견에
                  기여할 수 있습니다
                </div>
              </li>

              <li>
                <div className={s.box_wrap}>
                  <div className={s.img_wrap_vet}>
                    <Image src={VetImg} alt="VetImg" />
                  </div>
                  <div className={s.box_title}>
                    <p>AI 수의사</p>
                    <Link href="/healthcare/vet">
                      <a className={s.menu_sub_title}>바로가기</a>
                    </Link>
                  </div>
                </div>
                <div className={s.box_text}>
                  다년간 쌓아온 바프독의 데이터를 머신러닝하여 반려견의 건강
                  문제에 대한 신속하고 정확한 상담을 연중무휴 24시간 제공하는
                  서비스입니다
                </div>
              </li>
            </ul>
          </section>

          {/* <section className={s.review_write_ad}>
            <Link href={'/mypage/review'} passHref>
              <a>
                <div className={s.red_box}>
                  <div className={s.content_box}>
                    <div className={`${s.image_left} img-wrap`}>
                      <Image
                        src={require('/public/img/pages/review/review_redbox_left.png')}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>

                    <div className={s.text_box}>
                      <p className={s.top_text}>
                        건강케어건강케어건강케어건강케어 간단한 배변 채취로 장내
                        환경 및 질병 유발 유해균 파악이 가능합니다!
                      </p>
                      <p className={s.bot_text}>곧 만나요 !</p>
                    </div>
                    <div className={`${s.image_right} img-wrap`}>
                      <Image
                        src={require('/public/img/pages/review/review_redbox_right.png')}
                        objectFit="contain"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </section> */}

          {/* <section className={s.notice_text}>
            <div className={s.notice}>
              <span></span> 상품에 대한 후기를 남기는 공간입니다.{' '}
              <br className={s.notice_br} /> 해당 게시판의 성격과 다른 글은
              사전동의 없이 담당 게시판으로 이동될 수 있습니다.
              <br />
              <span></span> 배송관련, 주문(취소/교환/환불)관련 문의 및
              요청사항은 (모바일)마이페이지 내 1:1 문의, (PC) 우측 상단
              고객센터에 남겨주시면 빠른 상담이 가능합니다.
            </div>
          </section>
          <section className={s.review_box}></section> */}
        </Wrapper>
      </Layout>
    </>
  );
}
