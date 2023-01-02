import s from './review.module.scss';
import React, { useEffect, useState } from 'react';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import ReviewList from './ReviewList';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import Checkbox from '/src/components/atoms/Checkbox';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTerm from '/src/components/admin/form/searchBar/SearchTerm';
import SearchRadio from '/src/components/admin/form/searchBar/SearchRadio';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import { global_reviewStateType } from '/store/TYPE/reviewStateType';
import { valid_isTheSameArray } from '/util/func/validation/validationPackage';
import ToolTip from '/src/components/atoms/Tooltip';
import {postObjData, putObjData} from '/src/pages/api/reqData';
import { transformToday } from '/util/func/transformDate';
import {global_searchDateType} from "/store/TYPE/searchDateType";
import {MirroredTextOnHoverEvent} from "../../../../../util/func/mirroredTextOnHoverEvent";

const initialSearchValue = {
  from: global_searchDateType.oldestDate,
  to: transformToday(),
  status: 'ALL', // [ALL,REQUEST,RETURN,APPROVAL,ADMIN]
};

const onSetSearchQueryHandler = (searchObj) => {
  let query;
  const defaultQuery = 'order=desc';
  const queryArr = [defaultQuery];
  for (const key in searchObj) {
    const val = searchObj[key];
    queryArr.push(`${key}=${val}`);
  }
  query = `${queryArr.join('&')}`;
  return query;
};

export default function ReviewPage() {
  const searchApiUrl = '/api/admin/reviews'; // 관리자 리뷰 리스트 조회(페이징)
  const searchPageSize = 10;
  const apiDataQueryString = 'queryAdminReviewsDtoList';
  
  const initialSearchQuery = onSetSearchQueryHandler(initialSearchValue);
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [selectedItemList, setSelectedItemList] = useState([]);
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  
  useEffect( () => {
    MirroredTextOnHoverEvent( window );
  }, [itemList] )
  
  
  const pageInterceptor = (res) => {
    // res = DUMMY_REVIEW_RESPONSE; // ! TEST
    // console.log(res)
    let newPageInfo = {
      totalPages: 0,
      size: 0,
      totalItems: 0,
      currentPageIndex: 0,
      newPageNumber: 0,
      newItemList: [],
    };
    if(res.data?._embedded){
      const newItemList = res.data?._embedded.queryAdminReviewsDtoList || [];
      const pageData = res.data.page;
      newPageInfo = {
        totalPages: pageData.totalPages,
        size: pageData.size,
        totalItems: pageData.totalElements,
        currentPageIndex: pageData.number,
        newPageNumber: pageData.number + 1,
        newItemList,
      };
    }
    
    return newPageInfo;
  };

  const onResetSearchValues = () => {
    setSearchValue(initialSearchValue);
  };

  const onSearchHandler = () => {
    const defaultQuery = 'order=desc';
    const queryArr = [defaultQuery];
    for (const key in searchValue) {
      const val = searchValue[key];
      queryArr.push(`${key}=${val}`);
    }

    const query = `${queryArr.join('&')}`;
    setSearchQuery(query);
  };

  const onAllSelectItemsList = (checked) => {
    if (checked) {
      setSelectedItemList(itemList.map((item) => item.id)); // 모두 선택
    } else {
      setSelectedItemList([]); //초기화
    }
  };

  const valid_allCheckboxesChecked = () => {
    if (!Array.isArray(itemList) || !Array.isArray(selectedItemList) || itemList.length === 0)
      return;
    const allSelectedList = itemList.map((item) => item.id);
    return valid_isTheSameArray(allSelectedList, selectedItemList);
  };

  const onApprovalReview = async () => {
    if(!confirm(`선택된 ${setSelectedItemList.length}개의 리뷰를 승인처리 하시겠습니까?`)) return;
    
    try {
      setIsLoading({approval: true});
      const body = {
        reviewIdList: selectedItemList
      }
      const apiUrl = '/api/admin/reviews/approval';
      const res = await putObjData(apiUrl, body);
      console.log(res);
      if (res.isDone) {
        alert('선택된 리뷰가 승인처리 되었습니다.');
        setSelectedItemList([]); // 초기화 시킴
        window.location.reload();
      }
    } catch (err) {
        console.error(err)
    }
    setIsLoading({approval: false})
  };
  
  const onSetBestReview = async () => {
    if(!selectedItemList.length) return;
    if(!confirm(`선택된 ${selectedItemList.length}개의 리뷰를 베스트리뷰로 등록하시겠습니까?`)) return;
    console.log(selectedItemList)
    try {
      setIsLoading({bestReview: true});
      const body = {
        reviewIdList: selectedItemList
      }
      const apiUrl = '/api/admin/reviews/best';
      const res = await postObjData(apiUrl, body);
      console.log(res);
      if (res.isDone) {
        alert(`${selectedItemList.length}개의 리뷰가 베스트리뷰로 등록되었습니다.`);
        setSelectedItemList([]); // 초기화 시킴
        // window.location.reload();
      }
    } catch (err) {
      console.error(err)
    }
    setIsLoading({bestReview: false})
  };
  

  return (
    <>
      <MetaTitle title="리뷰 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">리뷰 관리</h1>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchTerm
                title={'조회기간'}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
              />
              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="처리상태"
                name="status"
                idList={global_reviewStateType.map((state) => state.ENG)}
                labelList={global_reviewStateType.map((state) => state.KOR)}
                value={searchValue.status}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">
                목록
                <ToolTip
                  messagePosition={'left'}
                  message={
                    '1. 체크박스는 리뷰 승인 및 베스트리뷰 선정에 사용됩니다.\n2. 승인된 리뷰'
                  }
                />
              </p>
              <div className="controls cont-left">
                <button className="admin_btn line basic_m" onClick={onApprovalReview}>
                  {isLoading.approval ? <Spinner /> : '리뷰 승인'}
                </button>
                <button className="admin_btn line basic_m autoWidth" onClick={onSetBestReview}>
                  {isLoading.bestReview ? <Spinner /> : '베스트 리뷰 선정'}
                  </button>
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>
                    <Checkbox
                      onClick={onAllSelectItemsList}
                      checked={valid_allCheckboxesChecked() || ''}
                    />
                  </li>
                  <li className={s.table_th}>고유번호</li>
                  <li className={s.table_th}>처리상태</li>
                  <li className={s.table_th}>상품명</li>
                  <li className={`${s.table_th}`}>리뷰내용</li>
                  <li className={s.table_th}>평점</li>
                  <li className={s.table_th}>사용자 이름</li>
                  <li className={s.table_th}>사용자 ID</li>
                  <li className={s.table_th}>작성일</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {isLoading.fetching ? (
                  <Spinner floating={true} />
                ) : itemList.length === 0 ? (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                ) : (
                  <ReviewList
                    items={itemList}
                    setSelectedItems={setSelectedItemList}
                    selectedItems={selectedItemList}
                  />
                )}
              </div>
            </div>
            <div className={s['pagination-section']}>
              <PaginationWithAPI
                apiURL={searchApiUrl}
                urlQuery={searchQuery}
                size={searchPageSize}
                setItemList={setItemList}
                queryItemList={apiDataQueryString}
                setIsLoading={setIsLoading}
                pageInterceptor={pageInterceptor}
              />
            </div>
          </section>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

const DUMMY_REVIEW_RESPONSE = {
  data: {
    _embedded: {
      queryAdminReviewsDtoList: [
        {
          id: 662,
          status: 'ADMIN',
          title: '구독 상품',
          star: 3,
          contents: '열글자 이상의 구독 리뷰3',
          createdDate: '2022-08-21',
          name: '관리자',
          email: 'admin@gmail.com',
          _links: {
            query_review: {
              href: 'http://localhost:8080/api/admin/reviews/662',
            },
            delete_review: {
              href: 'http://localhost:8080/api/admin/reviews/662',
            },
          },
        },
        {
          id: 663,
          status: 'RETURN',
          title: '구독 상품',
          star: 3,
          contents: '열글자 이상의 구독 리뷰4',
          createdDate: '2022-08-20',
          name: '김회원',
          email: 'user@gmail.com',
          _links: {
            query_review: {
              href: 'http://localhost:8080/api/admin/reviews/663',
            },
            delete_review: {
              href: 'http://localhost:8080/api/admin/reviews/663',
            },
          },
        },
        {
          id: 664,
          status: 'ADMIN',
          title: '구독 상품',
          star: 3,
          contents: '열글자 이상의 구독 리뷰4',
          createdDate: '2022-08-20',
          name: '관리자',
          email: 'admin@gmail.com',
          _links: {
            query_review: {
              href: 'http://localhost:8080/api/admin/reviews/664',
            },
            delete_review: {
              href: 'http://localhost:8080/api/admin/reviews/664',
            },
          },
        },
        {
          id: 666,
          status: 'ADMIN',
          title: '구독 상품',
          star: 3,
          contents: '열글자 이상의 구독 리뷰5',
          createdDate: '2022-08-19',
          name: '관리자',
          email: 'admin@gmail.com',
          _links: {
            query_review: {
              href: 'http://localhost:8080/api/admin/reviews/666',
            },
            delete_review: {
              href: 'http://localhost:8080/api/admin/reviews/666',
            },
          },
        },
        {
          id: 665,
          status: 'RETURN',
          title: '구독 상품',
          star: 3,
          contents: '열글자 이상의 구독 리뷰5',
          createdDate: '2022-08-19',
          name: '김회원',
          email: 'user@gmail.com',
          _links: {
            query_review: {
              href: 'http://localhost:8080/api/admin/reviews/665',
            },
            delete_review: {
              href: 'http://localhost:8080/api/admin/reviews/665',
            },
          },
        },
      ],
    },
    _links: {
      first: {
        href: 'http://localhost:8080/api/admin/reviews?page=0&size=5',
      },
      prev: {
        href: 'http://localhost:8080/api/admin/reviews?page=0&size=5',
      },
      self: {
        href: 'http://localhost:8080/api/admin/reviews?page=1&size=5',
      },
      next: {
        href: 'http://localhost:8080/api/admin/reviews?page=2&size=5',
      },
      last: {
        href: 'http://localhost:8080/api/admin/reviews?page=7&size=5',
      },
      approve_reviews: {
        href: 'http://localhost:8080/api/admin/reviews/approval',
      },
      create_best_reviews: {
        href: 'http://localhost:8080/api/admin/reviews/best',
      },
      profile: {
        href: '/docs/index.html#resources-admin-query-reviews',
      },
    },
    page: {
      size: 5,
      totalElements: 40,
      totalPages: 8,
      number: 1,
    },
  },
};
