import React, { useState, useEffect, useCallback } from 'react';
import s from './inquiry.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import { useModalContext } from '/store/modal-context';
import Link from 'next/link';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import { inquiryStatusType } from '/store/TYPE/inquiry/inquiryStatusType';
import { InquiryItem } from '/src/components/mypage/inquiry/InquiryItem';
import { SearchBox } from '/src/components/mypage/inquiry/SearchBox';
import { searchType } from '/store/TYPE/searchType';
import {getQueryString} from "/util/func/getQueryString";
import enterKey from "/util/func/enterKey";




const titleId = searchType.KEYWORD.NAME;
const categoryId = searchType.CATEGORY.NAME;


const initialSearchValues = {
  [titleId]: '',
  [categoryId]: searchType.CATEGORY.options[0].value,
}

export default function InquiryPage() {

  const searchApiUrl = '/api/questions'; // 친구목록 조회 API url
  const searchPageSize = 10;
  
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState(getQueryString(initialSearchValues));
  
  
  // useEffect (() => {
  //   const queryString = getQueryString(searchValues);
  //     setSearchQuery(queryString);
  // }, [searchValues]);
  //
  const onSearch = useCallback(()=>{
    const queryString = getQueryString(searchValues);
    setSearchQuery(queryString);
  },[searchValues])
 
  
  const pageInterCeptor = useCallback(async (res) => {
    // // console.log(res);
    // res = DUMMY_RESPONSE; // ! TEST
    let newPageInfo = {
      totalPages: 0,
      size: 0,
      totalItems: 0,
      currentPageIndex: 1,
      newPageNumber: 1,
      newItemList: [],
    };
    if (res?.data?._embedded) {
      const pageData = res.data.page;
      const newItemList = res.data._embedded['questionListSideMemberList'];
      newPageInfo = {
        totalPages: pageData.totalPages,
        size: pageData.size,
        totalItems: pageData.totalElements,
        currentPageIndex: pageData.number,
        newPageNumber: pageData.number + 1,
        newItemList: newItemList,
      };
    }

    return newPageInfo;
  }, []);
  
  const onEnterKey = (e)=>{
    enterKey(e, onSearch);
  }

  const onClickModalButton = () => {
    mct.alertHide();
  };

  return (
    <>
      <MetaTitle title="마이페이지 1:1 문의내역" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <div className={s['title-section']}>
              <h1 className={s.inquiry_title}>1:1 문의내역</h1>
              
              <ul>
                <div className={s['desc-box']}>
                  <h3 className={s.subtitle}>문의 답변시간</h3>
                  <p className={s.subtext}>
                    <span className={s.divider}>
                      AM 09:00 - PM 17:30 (점심시간 11:30 - 12:30)
                    </span>
                    <span className={s.divider}>DAY OFF (토/일/공휴일 휴무)</span>
                  </p>
                </div>
                <div className={s['create-btn']}>
                  <Link href={'/mypage/inquiry/create'} passHref>
                    <a className={`custom_btn solid basic_l ${s['inquiry-btn']}`}>
                      문의 작성하기
                    </a>
                  </Link>
                </div>
              </ul>
            </div>

            <section className={s['item-section']}>
              <div className={s.table}>
                <div className={s.thead}>
                  <ul className={s.tr}>
                    <span>답변상태</span>
                    <span>제목</span>
                    <span>작성일</span>
                  </ul>
                </div>
                <div className={s.tbody}>
                  <ul>
                    {itemList?.length > 0 ? (
                      itemList.map((p, i) => (
                        <InquiryItem key={`${p.title}-${i}`} data={p} />
                      ))
                    ) : isLoading.fetching ? (
                      <EmptyContMessage>
                        <Spinner />
                      </EmptyContMessage>
                    ) : (
                      <EmptyContMessage
                        message={'문의내역이 존재하지 않습니다.'}
                      />
                    )}
                  </ul>
                </div>
              </div>
            </section>
            <section className={s['search-section']}>
              <SearchBox
                value={searchValues}
                setValues={setSearchValues}
                onSearch={ onSearch}
                event={{
                  onKeyDown: onEnterKey
                }}
                idMap={{
                  title: titleId,
                  category: categoryId,
                }}
              />
            </section>

            <div className={s.pagination_box}>
              <PaginationWithAPI
                apiURL={searchApiUrl}
                size={searchPageSize}
                setItemList={setItemList}
                urlQuery={searchQuery}
                setIsLoading={setIsLoading}
                pageInterceptor={pageInterCeptor}
              />
            </div>
          </MypageWrapper>
        </Wrapper>
      </Layout>
      {hasAlert && <Modal_global_alert onClick={onClickModalButton} background />}
    </>
  );
}

// const DUMMY_RESPONSE = {
//   data: {
//     _embedded: {
//       itemQueryName: [
//         {
//           id: 1,
//           status: inquiryStatusType.UNANSWERED,
//           title:
//             '문의사항있습니다!문의사항있습니다!문의사항있습니다!문의사항있습니다!문의사항있습니다!문의사항있습니다!문의사항있습니다!문의사항있습니다!문의사항있습니다!문의사항있습니다!문의사항있습니다!문의사항있습니다!문의사항있습니다!',
//           createdDate: '2022-11-17T14:10:40',
//         },
//         {
//           id: 2,
//           status: inquiryStatusType.ANSWERED,
//           title: '문의사항있습니다2',
//           createdDate: '2022-11-17T14:10:40',
//         },
//         {
//           id: 3,
//           status: inquiryStatusType.MULTIPLE_ANSWERED,
//           title: '문의사항있습니다3',
//           createdDate: '2022-11-17T14:10:40',
//         },
//       ],
//     },
//     page: {
//       totalPages: 10,
//       size: 10,
//       totalItems: 30,
//       currentPageIndex: 1,
//       newPageNumber: 1,
//     },
//   },
//   status: 200,
// };
