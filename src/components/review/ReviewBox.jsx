import React, { useState } from 'react';
import s from '../../pages/review/review.module.scss';
import Spinner from '../atoms/Spinner';
import { ReviewItem } from './ReviewItem';
import { EmptyContMessage } from '../atoms/emptyContMessage';
import PaginationWithAPI from '../atoms/PaginationWithAPI';

export const ReviewBox = () => {
  const searchPageSize = 10;
  const getListApiUrl = '/api/reviews/community';
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState({});

  const pageInterceptor = (res) => {
    // res = DUMMY_REVIEW_LIST_RESPONSE; //  ! TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST
    // // console.log( res );
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
    // // console.log(newItemList);
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

//
// const DUMMY_REVIEW_LIST_RESPONSE = {
//   data: {
//     _embedded: {
//       queryCommunityReviewsDtoList: [
//         {
//           reviewDto: {
//             id: 343,
//             thumbnailUrl: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=989&q=80',
//             star: 3,
//             contents: '열글자 이상의 구독 리뷰2',
//             username: '김회원',
//             writtenDate: '2022-08-24',
//           },
//           reviewImageDtoList: [
//             {
//               filename: 'filename1.jpg',
//               url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=985&q=80',
//             },
//             {
//               filename: 'filename2.jpg',
//               url: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
//             }
//           ],
//         },
//         {
//           reviewDto: {
//             id: 341,
//             thumbnailUrl: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80',
//             star: 3,
//             contents: '열글자 이상의 구독 리뷰1',
//             username: '김회원',
//             writtenDate: '2022-08-24',
//           },
//           reviewImageDtoList: [
//             {
//               filename: 'filename1.jpg',
//               url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
//             },
//           ],
//         }
//       ],
//     },
//     _links: {
//       first: {
//         href: 'http://localhost:8080/api/reviews/community?page=0&size=5',
//       },
//       prev: {
//         href: 'http://localhost:8080/api/reviews/community?page=0&size=5',
//       },
//       self: {
//         href: 'http://localhost:8080/api/reviews/community?page=1&size=5',
//       },
//       next: {
//         href: 'http://localhost:8080/api/reviews/community?page=2&size=5',
//       },
//       last: {
//         href: 'http://localhost:8080/api/reviews/community?page=2&size=5',
//       },
//       profile: {
//         href: '/docs/index.html#resources-query-reviews-community',
//       },
//     },
//     page: {
//       size: 5,
//       totalElements: 14,
//       totalPages: 3,
//       number: 1,
//     },
//   },
// };
