import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LayoutWithoutFooter from '/src/components/common/LayoutWithoutFooter';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './review.module.scss';
import Image from 'next/image';
import RatingStars from '/src/components/atoms/RatingStars';
import TabContentContainer, {
  LeftContainer,
  RightContainer,
} from '/src/components/atoms/TabContentContainer';
import Tabmenu_TwoButton from '/src/components/atoms/Tabmenu_TwoButton';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import { global_reviewType } from '/store/TYPE/reviewType';
import transformDate from '/util/func/transformDate';
import { useRouter } from 'next/router';
import { reviewStatus } from '/store/TYPE/reviewStateType';
import Modal_singleReviewImages from '/src/components/modal/Modal_singleReviewImages';
import Modal_confirm from '/src/components/modal/Modal_confirm';
import { deleteObjData } from '/src/pages/api/reqData';

import { userType } from '/store/TYPE/userAuthType';
import userStateSlice, { userStateAction } from '/store/userState-slice';

export default function ReviewPage() {
  const searchWritableReivewApiUrl = '/api/reviews/writeable'; // 작성 가능한 리뷰 리스트 조회(페이징)
  const searchMyReivewApiUrl = '/api/reviews'; // 작성한 리뷰 리스트 조회(페이징)
  const searchPageSize = 10;

  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((s) => s.auth);
  const [isLoading, setIsLoading] = useState({});
  const [activeMenu, setActiveMenu] = useState('left');
  const [writableReviewList, setWritableReviewList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [activeImageModal, setActiveImageModal] = useState(false);
  const [activeDeleteConfirmModal, setActiveDeleteConfirmModal] =
    useState(false);
  const [selectedReivewId, setSelectedReivewId] = useState(null); //

  const onPrevPage = () => {
    router.push('/mypage');
  };

  // // console.log(writableReviewList)
  // // console.log(reviewList)
  const writableReviewListPageInterCeptor = (res) => {
    // res = DUMMY_RESPONSE_DATA_writableReview; // ! TEST
    // console.log(res);
    const pageData = res.data.page;
    let newPageInfo = {
      totalPages: pageData.totalPages,
      size: pageData.size,
      totalItems: pageData.totalElements,
      currentPageIndex: pageData.number,
      newPageNumber: pageData.number + 1,
      newItemList: res.data._embedded.queryWriteableReviewsDtoList || [],
    };
    return newPageInfo;
  };

  const reviewListPageInterCeptor = (res) => {
    // SERVER pagination query가 변경되었을 경우 사용하는 function;
    // res = DUMMY_RESPONSE_DATA_reviewList; // ! TEST
    // console.log(res);
    const pageData = res.data.page;
    let newPageInfo = {
      totalPages: pageData.totalPages,
      size: pageData.size,
      totalItems: pageData.totalElements,
      currentPageIndex: pageData.number,
      newPageNumber: pageData.number + 1,
      newItemList: res.data._embedded.queryReviewsDtoList || [],
    };
    return newPageInfo;
  };

  const createReviewHandler = (e, type = 'create') => {
    // - REDUX 사용 (router.push())
    const button = e.currentTarget;
    const reviewId = Number(button.dataset.reviewId);
    const targetReviewList =
      type === 'create' ? writableReviewList : reviewList;
    const info = targetReviewList.filter((item) => item.id === reviewId)[0];
    const data =
      type === 'create'
        ? {
            itemThumbnailUrl: info.imageUrl, // ! 상품 image Url (** update와 key가 다르므로 주의)
            reviewType: info.reviewType, // 리뷰 타입 (단품 / 구독상품)
            id: info.id, // 주문한 상품의 id 또는 구독 id입
            targetId: info.targetId, // 리뷰대상 (리뷰 대상 id [itemId or recipeId] )
            title: info.title, // 상품 타이틀
            orderedDate: info.orderedDate, // 주문일자
          }
        : {
            // review update > (좌측 상단 item info list) + review ID
            itemThumbnailUrl: info.thumbnailUrl, // ! 상품 image Url (** create와 key가 다르므로 주의)
            reviewType: info.reviewType, ///////////// ! server data 추가 필요
            title: info.title, // 상품 타이틀
            id: info.id, // 주문한 상품의 id 또는 구독 id
          };
    dispatch(userStateAction.setReviewInfo({ data }));
    router.push(`/mypage/review/${type}`);
  };

  const updateReviewHandler = (e) => {
    const type = 'update';
    createReviewHandler(e, type);
    // const reviewId = Number(button.dataset.reviewId);
    // const info = reviewList.filter((item) => item.id === reviewId)[0];
    // dispatch(userStateAction.setReviewInfo({ data }));
    // router.push(`/mypage/review/create`);
  };

  const onShowReviewImageModal = (e) => {
    const selectedReviewId = e.currentTarget.dataset.reviewId;
    setSelectedReivewId(selectedReviewId);
    setActiveImageModal(true);
  };

  const deleteReviewHandler = async (confirm) => {
    if (!confirm) return setActiveDeleteConfirmModal(false);

    setIsLoading((prevState) => ({
      ...prevState,
      fetching: true,
    }));
    try {
      const url = `/api/reviews/${selectedReivewId}`;
      const res = await deleteObjData(url);
      // console.log(res);
      if (res.isDone) {
        alert('리뷰가 삭제되었습니다.');
      } else if (res.status === 403) {
        if (auth.userType === userType.ADMIN) {
          alert(
            '사이트 관리자가 생성한 리뷰는 관리자 페이지에서 삭제할 수 있습니다.',
          );
        } else {
          alert('본인이 작성한 리뷰가 아닐 경우 삭제할 수 없습니다.');
        }
      }
    } catch (err) {
      console.error(err);
    }

    setActiveDeleteConfirmModal(false);
    setIsLoading((prevState) => ({
      ...prevState,
      fetching: false,
    }));
  };

  return (
    <>
      <MetaTitle title="마이페이지 후기" />
      <LayoutWithoutFooter>
        <Wrapper>
          <MypageWrapper>
            <header>
              <div className={s.prev_btn} style={{ cursor: 'pointer' }}>
                <Image
                  src={'/img/order/left_arrow.svg'}
                  alt="left_arrow"
                  width={24}
                  height={24}
                  onClick={onPrevPage}
                />
              </div>
            </header>
            <section className={s.title}>상품 후기</section>
            <Tabmenu_TwoButton
              leftMenuName={'후기 작성'}
              rightMenuName={'작성한 후기'}
              getPositionHandler={setActiveMenu}
            />
            <TabContentContainer>
              {/* writableReviewList */}
              <LeftContainer activeMenu={activeMenu}>
                {isLoading.fetching ? (
                  <Spinner />
                ) : writableReviewList.length === 0 ? (
                  <EmptyContMessage message={'작성가능한 후기가 없습니다.'} />
                ) : (
                  <ul className={'item_wrap'}>
                    {writableReviewList.map((item, index) => (
                      <li
                        key={`writable-reviews-${item.id}-${item.index}`}
                        className={s.content}
                      >
                        <div className={s.flex}>
                          <div className={s.left}>
                            <div className={`${s.image} img-wrap`}>
                              {item.imageUrl && (
                                <Image
                                  src={item.imageUrl}
                                  objectFit="cover"
                                  layout="fill"
                                  alt="카드 이미지"
                                />
                              )}
                            </div>
                            <div className={s.title_text}>
                              <p>{item.title}</p>
                              {/*{item.reviewType === global_reviewType.SUBSCRIBE ? <div className={s.mid_text}>*/}
                              {/*  {global_reviewType.KOR[item.reviewType]} &middot; {item.id} 회차*/}
                              {/*</div> : <div className={s.mid_text}>*/}
                              {/*  {global_reviewType.KOR[item.reviewType]}*/}
                              {/*</div>}*/}
                              <div className={s.mid_text}>
                                {global_reviewType.KOR[item.reviewType]}
                              </div>
                              <div className={s.day_text}>
                                주문일자: {transformDate(item.orderedDate)}
                              </div>
                            </div>
                          </div>
                          <div className={s.right}>
                            <button
                              className={s.btn}
                              data-review-id={item.id}
                              onClick={createReviewHandler}
                            >
                              후기 작성하기
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <section className={s.pagination_box}>
                  <PaginationWithAPI
                    apiURL={searchWritableReivewApiUrl}
                    size={searchPageSize}
                    setItemList={setWritableReviewList}
                    setIsLoading={setIsLoading}
                    pageInterceptor={writableReviewListPageInterCeptor}
                  />
                </section>
              </LeftContainer>

              {/* ReviewList*/}
              <RightContainer activeMenu={activeMenu}>
                <section className={s.content}>
                  {isLoading.fetching ? (
                    <Spinner />
                  ) : reviewList.length === 0 ? (
                    <EmptyContMessage message={'작성한 후기가 없습니다.'} />
                  ) : (
                    <ul className={'item_wrap'}>
                      {reviewList.map((item, index) => (
                        <li
                          key={`review-${item.id}-${index}`}
                          className={s.content}
                        >
                          <article className={s.flex_box5}>
                            <div className={s.left_box}>
                              <div className={s.row_1}>
                                <figure className={s.pic_box}>
                                  <div className={`${s.image} img-wrap`}>
                                    {/* 상품 썸네일 URL */}
                                    {item.thumbnailUrl && (
                                      <Image
                                        priority={false}
                                        src={item.thumbnailUrl}
                                        objectFit="cover"
                                        layout="fill"
                                        alt="상품 이미지"
                                      />
                                    )}
                                  </div>
                                </figure>
                                <h3 className={s.content_inner_title}>
                                  {item.title}
                                </h3>
                                {/*상품명*/}
                                <span className={s.reviewType}>
                                  {item.reviewType}
                                </span>
                              </div>
                              <div className={s.row_2}>
                                <RatingStars
                                  count={item.star}
                                  margin={5}
                                  size={15}
                                  disabled
                                />
                              </div>
                              <figcaption className={s.row_3}>
                                {item.contents}
                              </figcaption>
                              {/*리뷰 '대표이미지' URL */}
                              {item.imageUrl && (
                                <figure className={s.row_4}>
                                  <button
                                    className={s.pic_box}
                                    data-review-id={item.id}
                                    onClick={onShowReviewImageModal}
                                    disabled={item.imageCount <= 1}
                                  >
                                    <Image
                                      priority={false}
                                      src={item.imageUrl}
                                      objectFit="cover"
                                      layout="fill"
                                      alt="카드 이미지"
                                    />
                                    {item.imageCount > 1 && (
                                      <span className={s.imageCount}>
                                        +{item.imageCount}
                                      </span>
                                    )}
                                  </button>
                                </figure>
                              )}
                              <div className={s.row_5}>
                                {transformDate(item.createdDate)}
                              </div>
                              {item.status === reviewStatus.RETURN && (
                                <div className={`${s.returnMessage}`}>
                                  반려사유: {item.returnReason}
                                </div>
                              )}
                            </div>

                            <div className={s.mid_box}>
                              <div className={s.mid_box_text}>
                                {reviewStatus.KOR[item.status]}
                              </div>
                            </div>
                            <div className={s.right_box}>
                              <div className={s.btn_box}>
                                {/*<div className={s.red_btn}>수정</div>*/}
                                <button
                                  className={s.red_btn}
                                  data-review-id={item.id}
                                  onClick={updateReviewHandler}
                                >
                                  수정
                                </button>
                              </div>
                              <div className={s.btn_box}>
                                <button
                                  type={'button'}
                                  className={s.btn2}
                                  data-review-id={item.id}
                                  onClick={() => {
                                    setActiveDeleteConfirmModal(true);
                                    setSelectedReivewId(item.id);
                                  }}
                                >
                                  삭제
                                </button>
                              </div>
                            </div>
                          </article>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
                <section className={s.pagination_box}>
                  <PaginationWithAPI
                    apiURL={searchMyReivewApiUrl}
                    size={searchPageSize}
                    setItemList={setReviewList}
                    setIsLoading={setIsLoading}
                    pageInterceptor={reviewListPageInterCeptor}
                  />
                </section>
              </RightContainer>
            </TabContentContainer>
          </MypageWrapper>
        </Wrapper>
      </LayoutWithoutFooter>
      {activeImageModal && (
        <Modal_singleReviewImages
          isActiveModal={activeImageModal}
          setIsActiveModal={setActiveImageModal}
          reviewId={selectedReivewId}
        />
      )}
      {activeDeleteConfirmModal && (
        <Modal_confirm
          theme={'userPage'}
          isConfirm={deleteReviewHandler}
          positionCenter
          text={'후기를 삭제하시겠습니까?'}
        />
      )}
    </>
  );
}
//

/*
 * imageUrl:'https://images.unsplash.com/photo-1657299156653-d3c0147ba3ee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
 * imageUrl:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80',
 * imageUrl:'https://images.unsplash.com/photo-1563865436874-9aef32095fad?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
 * */
// const DUMMY_RESPONSE_DATA_writableReview = {
//   data: {
//     _embedded: {
//       queryWriteableReviewsDtoList: [
//         {
//           id: 3805,
//           targetId: 13,
//           reviewType: 'SUBSCRIBE',
//           imageUrl:
//             'https://images.unsplash.com/photo-1657299156653-d3c0147ba3ee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
//           title: '구독상품',
//           orderedDate: '2022-07-22 09:56:44.07',
//           _links: {
//             write_review: {
//               href: 'http://localhost:8080/api/reviews',
//             },
//           },
//         },
//         {
//           id: 3801,
//           targetId: 3774,
//           reviewType: 'ITEM',
//           imageUrl:
//             'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80',
//           title: '상품4',
//           orderedDate: '2022-07-22 09:56:44.069',
//           _links: {
//             write_review: {
//               href: 'http://localhost:8080/api/reviews',
//             },
//           },
//         },
//         {
//           id: 3800,
//           targetId: 3773,
//           reviewType: 'ITEM',
//           imageUrl:
//             'https://images.unsplash.com/photo-1563865436874-9aef32095fad?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
//           title: '상품3',
//           orderedDate: '2022-07-22 09:56:44.069',
//           _links: {
//             write_review: {
//               href: 'http://localhost:8080/api/reviews',
//             },
//           },
//         },
//       ],
//     },
//     page: {
//       size: 5,
//       totalElements: 12,
//       totalPages: 3,
//       number: 1,
//     },
//   },
// };
//
// const DUMMY_RESPONSE_DATA_reviewList = {
//   data: {
//     _embedded: {
//       queryReviewsDtoList: [
//         {
//           id: 319,
//           thumbnailUrl:
//             'https://images.unsplash.com/photo-1657299156653-d3c0147ba3ee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
//           title: '구독 상품',
//           star: 5,
//           contents: '열글자 이상의 구독 리뷰9열글자 이상의 구독 리뷰9열글자 이상의 구독 리뷰9',
//           createdDate: '2022-07-22',
//           imageUrl:
//             'https://images.unsplash.com/photo-1560713781-d00f6c18f388?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1981&q=80',
//           imageCount: 1,
//           status: 'RETURN',
//           returnReason: '상품에 맞지 않은 리뷰 내용9',
//           _links: {
//             query_review_images: {
//               href: 'http://localhost:8080/api/reviews/319/images',
//             },
//             query_review: {
//               href: 'http://localhost:8080/api/reviews/319',
//             },
//             delete_review: {
//               href: 'http://localhost:8080/api/reviews/319',
//             },
//             update_review: {
//               href: 'http://localhost:8080/api/reviews/319',
//             },
//           },
//         },
//         {
//           id: 321,
//           thumbnailUrl:
//             'https://images.unsplash.com/photo-1624462966581-bc6d768cbce5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
//           title: '구독 상품',
//           star: 1,
//           contents: '열글자 이상의 구독 리뷰10',
//           createdDate: '2022-07-22',
//           imageUrl:
//             'https://images.unsplash.com/photo-1624462966581-bc6d768cbce5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
//           imageCount: 3,
//           status: 'APPROVAL',
//           returnReason: '',
//           _links: {
//             query_review_images: {
//               href: 'http://localhost:8080/api/reviews/321/images',
//             },
//             query_review: {
//               href: 'http://localhost:8080/api/reviews/321',
//             },
//             delete_review: {
//               href: 'http://localhost:8080/api/reviews/321',
//             },
//             update_review: {
//               href: 'http://localhost:8080/api/reviews/321',
//             },
//           },
//         },
//         {
//           id: 317,
//           thumbnailUrl:
//             'https://images.unsplash.com/photo-1556761223-4c4282c73f77?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1065&q=80',
//           title: '구독 상품',
//           star: 4,
//           contents: '열글자 이상의 구독 리뷰8',
//           createdDate: '2022-07-22',
//           imageUrl:
//             'https://images.unsplash.com/photo-1556761223-4c4282c73f77?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1065&q=80',
//           imageCount: 13,
//           status: 'REQUEST',
//           returnReason: '상품에 맞지 않은 리뷰 내용8',
//           _links: {
//             query_review_images: {
//               href: 'http://localhost:8080/api/reviews/317/images',
//             },
//             query_review: {
//               href: 'http://localhost:8080/api/reviews/317',
//             },
//             delete_review: {
//               href: 'http://localhost:8080/api/reviews/317',
//             },
//             update_review: {
//               href: 'http://localhost:8080/api/reviews/317',
//             },
//           },
//         },
//       ],
//     },
//     page: {
//       size: 5,
//       totalElements: 14,
//       totalPages: 3,
//       number: 1,
//     },
//   },
// };
