import React, { useEffect, useState, useRef } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from '/src/pages/review/review.module.scss';
import Image from 'next/image';
import RatingStars from '/src/components/atoms/RatingStars';
import ArrowLeft from '/public/img/icon/swiper-arrow-large-l.svg';
import ArrowRight from '/public/img/icon/swiper-arrow-large-r.svg';
import Modal_bestReview from '/src/components/modal/Modal_bestReview';
import { slideUp, slideDown } from '/util/func/slideToggle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import axios from 'axios';
import Spinner from '/src/components/atoms/Spinner';
import sorting from '/util/func/sorting';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import { filter_blindingUserName } from '/util/func/filter_blindingUserName';

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
            <Swiper_bestReview items={bestReviewList} />
          </section>

          <section className={s.review_write_ad}>
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
          </section>

          <section className={s.notice_text}>
            <div className={s.notice}>
              상품에 대한 후기를 남기는 공간입니다. <br className={s.notice_br} /> 해당 게시판의
              성격과 다른 글은 사전동의 없이 담당 게시판으로 이동될 수 있습니다.
              <br />
              배송관련, 주문(취소/교환/환불)관련 문의 및 요청사항은 마이페이지 내 1:1 문의에
              남겨주시면 빠른 상담이 가능합니다.
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

function Swiper_bestReview({ items }) {
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isActiveModal, setIsActiveModal] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState({});

  useEffect(() => {
    window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
  }, [isMobile]);

  useEffect(() => {
    const sortedItemList = sorting(items, 'leakedOrder', 'descend');
    setItemList(sortedItemList);
  }, [items]);

  const swiperSettings_review = {
    className: `${s.swiper_review}`,
    slidesPerView: 'auto',
    spaceBetween: 40,
    loop: true,
    breakpoints: {
      300: {
        slidesPerView: 1,
      },
      600: {
        slidesPerView: 2, //레이아웃 2열
      },
      900: {
        slidesPerView: 3,
      },
    },
    pagination: {
      clickable: true,
    },
    navigation: {
      prevEl: navPrevRef.current,
      nextEl: navNextRef.current,
    },
    modules: [Navigation],
  };

  const onClickReviewItemHandler = (e) => {
    const selectedReviewId = Number(e.currentTarget.dataset.id);
    setSelectedItemId(selectedReviewId);
    setIsActiveModal(true);
  };

  // console.log(itemList);
  return (
    <div className={s.swiper_review_outerWrap}>
      <i className={s['swiper-button-prev']} ref={navPrevRef}>
        <svg viewBox="0 0 50 50">
          <ArrowLeft className={s.arrow_left} />
        </svg>
      </i>
      <i className={s['swiper-button-next']} ref={navNextRef}>
        <svg viewBox="0 0 50 50">
          <ArrowRight className={s.arrow_right} />
        </svg>
      </i>
      <Swiper
        {...swiperSettings_review}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navPrevRef.current;
          swiper.params.navigation.nextEl = navNextRef.current;
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {itemList?.length > 0 &&
          itemList?.map((item) => (
            <SwiperSlide
              className={s.slide}
              key={`bestReview-${item.id}`}
              data-id={item.id}
              onClick={onClickReviewItemHandler}
            >
              <div className={s.mid_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    src={item.imageUrl}
                    objectFit="cover"
                    layout="fill"
                    alt="베스트 리뷰 이미지"
                  />
                </div>
              </div>
              <p className={s.content_title}>{item.contents}</p>
              <p>{item.contents}</p>
            </SwiperSlide>
          ))}
      </Swiper>
      {isActiveModal && (
        <Modal_bestReview
          isActiveModal={isActiveModal}
          setIsActiveModal={setIsActiveModal}
          reviewId={selectedItemId}
        />
      )}
    </div>
  );
}

const ReviewBox = () => {
  const searchPageSize = 10;
  const getListApiUrl = '/api/reviews/community';
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState({});

  const pageInterceptor = (res) => {
    // res = DUMMY_REVIEW_LIST_RESPONSE; //  ! TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST
    console.log(res);
    const pageData = res.data.page;
    const newItemList =
      res.data?._embedded?.queryCommunityReviewsDtoList.map((data) => ({
        id: data.reviewDto.id,
        thumbnailUrl: data.reviewDto.thumbnailUrl,
        star: data.reviewDto.star,
        contents: data.reviewDto.contents,
        username: data.reviewDto.username,
        writtenDate: data.reviewDto.writtenDate,
        imgList: data.reviewImageDtoList,
      })) || [];

    setItemList(newItemList);
    // console.log(newItemList);
    let newPageInfo = {
      totalPages: pageData.totalPages,
      size: pageData.size,
      totalItems: pageData.totalElements,
      currentPageIndex: pageData.number,
      newPageNumber: pageData.number + 1,
      newItemList,
    };
    return newPageInfo;
  };

  return (
    <div className={s.tab_slide_box}>
      <div className={s.notice_board}>
        <div className={s.flex_title}>
          <div>No</div>
          <div>상품</div>
          <div>별점</div>
          <div className={s.px16_title_content}>제목</div>
          <div></div>
          <div>등록일</div>
        </div>
        <ul className="reviewBox">
          {isLoading.fetching ? (
            <Spinner />
          ) : itemList?.length > 0 ? (
            itemList?.map((item, index) => (
              <ReviewItem key={`review-${item.id}-${index}`} item={item} />
            ))
          ) : (
            <EmptyContMessage message={'작성된 리뷰가 없습니다.'} />
          )}
        </ul>
      </div>
      <div className={s.pagination_box}>
        <PaginationWithAPI
          apiURL={getListApiUrl}
          size={searchPageSize}
          setItemList={setItemList}
          setIsLoading={setIsLoading}
          pageInterceptor={pageInterceptor}
        />
      </div>
    </div>
  );
};

const ReviewItem = ({ item }) => {
  const [visible, setVisible] = useState(false);
  const boxRef = useRef(null);
  const onClickHandler = (e) => {
    visible ? setVisible(false) : setVisible(true);
  };

  useEffect(() => {
    const selectedElem = boxRef.current;
    if (!selectedElem) return;
    visible ? slideDown(selectedElem) : slideUp(selectedElem);
  }, [visible]);

  return (
    <li>
      <figure className={s.grid_box} onClick={onClickHandler}>
        <span className={s.grid_num}>{item.id}</span>
        <div className={s.mid_box}>
          <i className={`${s.image_product} img-wrap`}>
            {item.thumbnailUrl && (
              <Image src={item.thumbnailUrl} objectFit="contain" layout="fill" alt="리뷰 썸네일" />
            )}
          </i>
        </div>
        <i className={s.star_box}>
          <RatingStars count={item.star} margin={0} disabled />
        </i>
        <p className={s.content}>
          <i className={`${s.image} img-wrap`}>
            <Image
              src={require('/public/img/shop/single/shop_main_slide_picture.png')}
              objectFit="contain"
              layout="fill"
              alt="카드 이미지"
            />
          </i>
          {item.contents}
        </p>
        <span className={s.grid_name}>{filter_blindingUserName(item?.username)}</span>
        <span className={s.grid_date}>{item.writtenDate}</span>
      </figure>
      <div className={s.text_box} ref={boxRef}>
        <p className={s.text}>{item.contents}</p>
        <div className={s.images}>
          {item.imgList?.map((imgData, index) => (
            <figure
              className={`${s['img-wrap']} img-wrap init-next-image`}
              key={`review-detail-images-${index}`}
            >
              <Image src={imgData.url} objectFit="cover" layout="fill" alt={imgData.filename} />
            </figure>
          ))}
        </div>
      </div>
    </li>
  );
};

export async function getServerSideProps(context) {
  let bestReviewList = null;
  const getbestReviewListApiUrl = '/api/reviews/best';
  let res = await axios
    .get(getbestReviewListApiUrl, {
      headers: {
        'content-Type': 'application/json',
      },
    })
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch((err) => {
      // console.log(err.response)
      return err.response;
    });
  // res = DUMMY_REVIEW_RESPONSE; // ! TEST
  // console.log(res)
  if (res.data) {
    bestReviewList =
      res.data?._embedded?.queryBestReviewsDtoList.map((list) => ({
        id: list.id,
        imageUrl: list.imageUrl,
        leakedOrder: list.leakedOrder,
        contents: list.contens,
      })) || [];
  }

  return { props: { bestReviewList } };
}






const DUMMY_BESTREVIEW_RESPONSE = {
  data: {
    _embedded: {
      queryBestReviewsDtoList: [
        {
          id: 34,
          imageUrl:
            'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
          leakedOrder: 4,
          contents:
            '열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1',
        },
        {
          id: 35,
          imageUrl:
            'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=662&q=80',
          leakedOrder: 9,
          contents:
            '열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2',
        },
        {
          id: 36,
          imageUrl:
            'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          leakedOrder: 5,
          contents: '열글자 이상의 내용3',
        },
      ],
    },
  },
};

const DUMMY_REVIEW_LIST_RESPONSE = {
  data: {
    _embedded: {
      queryCommunityReviewsDtoList: [
        {
          reviewDto: {
            id: 343,
            thumbnailUrl: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=989&q=80',
            star: 3,
            contents: '열글자 이상의 구독 리뷰2',
            username: '김회원',
            writtenDate: '2022-08-24',
          },
          reviewImageDtoList: [
            {
              filename: 'filename1.jpg',
              url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=985&q=80',
            },
            {
              filename: 'filename2.jpg',
              url: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
            }
          ],
        },
        {
          reviewDto: {
            id: 341,
            thumbnailUrl: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80',
            star: 3,
            contents: '열글자 이상의 구독 리뷰1',
            username: '김회원',
            writtenDate: '2022-08-24',
          },
          reviewImageDtoList: [
            {
              filename: 'filename1.jpg',
              url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
            },
          ],
        }
      ],
    },
    _links: {
      first: {
        href: 'http://localhost:8080/api/reviews/community?page=0&size=5',
      },
      prev: {
        href: 'http://localhost:8080/api/reviews/community?page=0&size=5',
      },
      self: {
        href: 'http://localhost:8080/api/reviews/community?page=1&size=5',
      },
      next: {
        href: 'http://localhost:8080/api/reviews/community?page=2&size=5',
      },
      last: {
        href: 'http://localhost:8080/api/reviews/community?page=2&size=5',
      },
      profile: {
        href: '/docs/index.html#resources-query-reviews-community',
      },
    },
    page: {
      size: 5,
      totalElements: 14,
      totalPages: 3,
      number: 1,
    },
  },
};
