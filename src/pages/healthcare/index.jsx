import React from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from '/src/pages/healthcare/healthcare.module.scss';
import Image from 'next/image';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import 'swiper/css/effect-fade';
// import axios from 'axios';
import Link from 'next/link';

export default function HealthcarePage() {
  return (
    <>
      <MetaTitle title="건강케어" />
      <Layout>
        <Wrapper>
          <section className={s.review_title}>
            <div>반려견 장내 미생물 진단분석 서비스</div>
          </section>

          <section className={s.swiper_box}>
            {/* {bestReviewList.length > 0 && (
              <Swiper_bestReview items={bestReviewList} />
            )} */}
          </section>

          <section className={s.review_write_ad}>
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
                        간단한 배변 채취로 장내 환경 및 질병 유발 유해균 파악이
                        가능합니다!
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
          </section>

          <section className={s.notice_text}>
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
          <section className={s.review_box}></section>
        </Wrapper>
      </Layout>
    </>
  );
}
