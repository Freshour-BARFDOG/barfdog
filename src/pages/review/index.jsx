import React from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from '/src/pages/review/review.module.scss';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import axios from 'axios';
import { ReviewBox } from '/src/components/review/ReviewBox';
import { Swiper_bestReview } from '/src/components/review/Swiper_bestReview';
import Link from 'next/link';

export default function ReviewPage({ bestReviewList }) {
  return (
    <>
      <MetaTitle title="리뷰" />
      <Layout>
        <Wrapper>
          <section className={s.review_title}>
            <div>
              바프독 견주님들의 <br />
              생생한 후기를 확인하세요
            </div>
          </section>

          <section className={s.swiper_box}>
            {bestReviewList.length > 0 && <Swiper_bestReview items={bestReviewList} />}
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
                    리뷰 작성하고 BEST <br />
                    리뷰가 되어보세요!
                  </p>
                  <p className={s.bot_text}>지금 리뷰 작성하고 적립금 받기!</p>
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
              <span></span> 상품에 대한 후기를 남기는 공간입니다. <br className={s.notice_br} /> 해당 게시판의
              성격과 다른 글은 사전동의 없이 담당 게시판으로 이동될 수 있습니다.
              <br />
              <span></span> 배송관련, 주문(취소/교환/환불)관련 문의 및 요청사항은 (모바일)마이페이지 내 1:1 문의, (PC) 우측 상단 고객센터에 남겨주시면 빠른 상담이 가능합니다.
            </div>
          </section>
          <section className={s.review_box}>
            <ReviewBox />
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  let bestReviewList = null;
  const getbestReviewListApiUrl = '/api/reviews/best';
  let res = await axios
    .get(getbestReviewListApiUrl, {
      headers: {
        'content-Type': 'application/json',
      },
    })
    .then((res) => {
      // // console.log(res);
      return res;
    })
    .catch((err) => {
      // // console.log(err.response)
      return err.response;
    });
  // res = DUMMY_BESTREVIEW_RESPONSE; // ! TEST
  // // console.log(res)
  if (res.data) {
    bestReviewList =
      res.data._embedded?.queryBestReviewsDtoList.map((list) => ({
        id: list.id || null,
        imageUrl: list.imageUrl || null,
        leakedOrder: list.leakedOrder || null,
        contents: list.contents || null,
      })) || [];
  }

  return { props: { bestReviewList } };
}




//
//
// const DUMMY_BESTREVIEW_RESPONSE = {
//   data: {
//     _embedded: {
//       queryBestReviewsDtoList: [
//         {
//           id: 34,
//           imageUrl:
//             'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
//           leakedOrder: 4,
//           contents:
//             '열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1',
//         },
//         {
//           id: 35,
//           imageUrl:
//             'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=662&q=80',
//           leakedOrder: 9,
//           contents:
//             '열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2',
//         },
//         {
//           id: 36,
//           imageUrl:
//             'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
//           leakedOrder: 5,
//           contents: '열글자 이상의 내용3',
//         },
//       ],
//     },
//   },
// };
