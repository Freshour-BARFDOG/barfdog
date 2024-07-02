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
import { deleteData, postObjData, putObjData } from '/src/pages/api/reqData';
import { transformToday } from '/util/func/transformDate';
import { global_searchDateType } from '/store/TYPE/searchDateType';
import { MirrorTextOnHoverEvent } from '/util/func/MirrorTextOnHoverEvent';
import { useModalContext } from '../../../../../store/modal-context';
import Modal_global_alert from '../../../../components/modal/Modal_global_alert';
import BestReviewList from '../bestReview/BestReviewList';

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

  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const initialSearchQuery = onSetSearchQueryHandler(initialSearchValue);
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [selectedItemList, setSelectedItemList] = useState([]);
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [onSearch, setOnSearch] = useState(false);

  useEffect(() => {
    MirrorTextOnHoverEvent(window);
  }, [itemList]);

  const pageInterceptor = (res) => {
    // res = DUMMY_REVIEW_RESPONSE; // ! TEST
    let newPageInfo = {
      totalPages: 0,
      size: 0,
      totalItems: 0,
      currentPageIndex: 0,
      newPageNumber: 0,
      newItemList: [],
    };
    if (res.data?._embedded) {
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
    setOnSearch(!onSearch);
  };

  const onAllSelectItemsList = (checked) => {
    if (checked) {
      setSelectedItemList(itemList.map((item) => item.id)); // 모두 선택
    } else {
      setSelectedItemList([]); //초기화
    }
  };

  const valid_allCheckboxesChecked = () => {
    if (
      !Array.isArray(itemList) ||
      !Array.isArray(selectedItemList) ||
      itemList.length === 0
    )
      return;
    const allSelectedList = itemList.map((item) => item.id);
    return valid_isTheSameArray(allSelectedList, selectedItemList);
  };

  const onApprovalReview = async () => {
    if (
      !confirm(
        `선택된 ${setSelectedItemList.length}개의 리뷰를 승인처리 하시겠습니까?`,
      )
    )
      return;

    try {
      setIsLoading({ approval: true });
      const body = {
        reviewIdList: selectedItemList,
      };
      const apiUrl = '/api/admin/reviews/approval';
      const res = await putObjData(apiUrl, body);
      // console.log(res);
      if (res.isDone) {
        alert('선택된 리뷰가 승인처리 되었습니다.');
        setSelectedItemList([]); // 초기화 시킴
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading({ approval: false });
  };

  const onSetBestReview = async () => {
    console.log(selectedItemList);

    if (!selectedItemList.length) return;
    if (
      !confirm(
        `선택된 ${selectedItemList.length}개의 리뷰를 베스트리뷰로 등록하시겠습니까?`,
      )
    )
      return;

    // 제목 등록되어 있는지 확인
    const itemsWithEmptyTitle = selectedItemList.filter((selectedId) => {
      const item = itemList.find((item) => item.id === selectedId);
      return item && !item.titleByAdmin;
    });

    console.log(itemsWithEmptyTitle);

    if (itemsWithEmptyTitle.length > 0) {
      if (alert(`리뷰 제목을 등록해주세요.`)) return;
      return;
    }

    try {
      setIsLoading({ bestReview: true });
      const body = {
        reviewIdList: selectedItemList,
      };
      const apiUrl = '/api/admin/reviews/best';
      const res = await postObjData(apiUrl, body);
      // console.log(res);
      if (res.isDone) {
        alert(
          `${selectedItemList.length}개의 리뷰가 베스트리뷰로 등록되었습니다.`,
        );
        setSelectedItemList([]); // 초기화 시킴
        // window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading({ bestReview: false });
  };

  const onDeleteItem = async (apiUrl, targetId) => {
    // console.log(apiUrl, targetId);
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: {
          [targetId]: true,
        },
      }));
      const res = await deleteData(apiUrl);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow('리뷰가 삭제되었습니다.', onSuccessCallback);
      } else {
        const serverErrorMessage = res.error;
        mct.alertShow(serverErrorMessage || '삭제에 실패하였습니다.');
      }
    } catch (err) {
      mct.alertShow('삭제 요청 중 에러가 발생하였습니다.');
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: {
          [targetId]: false,
        },
      }));
    }
  };
  const onSuccessCallback = () => {
    window.location.reload();
  };
  const onClickModalButton = () => {
    mct.alertHide();
  };

  //* 제목 등록
  const onPostTitleItem = async (apiUrl, body) => {
    console.log(apiUrl, body);
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        post: {
          [body.id]: true,
        },
      }));
      const res = await postObjData(apiUrl, body);
      console.log(res);
      if (res.isDone) {
        // 다시 조회
        setOnSearch(!onSearch);
        // mct.alertShow('제목이 등록되었습니다.', onSuccessCallback);
      } else {
        const serverErrorMessage = res.error;
        mct.alertShow(serverErrorMessage || '제목 등록에 실패하였습니다.');
      }
    } catch (err) {
      mct.alertShow('등록 요청 중 에러가 발생하였습니다.');
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        post: {
          [body.id]: false,
        },
      }));
    }
  };

  console.log(itemList);

  return (
    <>
      <MetaTitle title="리뷰" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">리뷰</h1>
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
                <button
                  className="admin_btn line basic_m"
                  onClick={onApprovalReview}
                >
                  {isLoading.approval ? <Spinner /> : '리뷰 승인'}
                </button>
                <button
                  className="admin_btn line basic_m autoWidth"
                  onClick={onSetBestReview}
                >
                  {isLoading.bestReview ? <Spinner /> : '베스트 리뷰 선정'}
                </button>
              </div>
            </div>
            <div className={`${s.cont_viewer}  ${s.fullWidth}`}>
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
                  <li className={s.table_th}>제목</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length ? (
                  <ReviewList
                    items={itemList}
                    onDeleteItem={onDeleteItem}
                    onPostTitleItem={onPostTitleItem}
                    isLoading={isLoading}
                    setSelectedItems={setSelectedItemList}
                    selectedItems={selectedItemList}
                  />
                ) : isLoading.fetching ? (
                  <AmdinErrorMessage loading={<Spinner />} />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
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
                onSearch={onSearch}
              />
            </div>
          </section>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && (
        <Modal_global_alert onClick={onClickModalButton} background />
      )}
    </>
  );
}

// const DUMMY_REVIEW_RESPONSE = {
//   data: {
//     _embedded: {
//       queryAdminReviewsDtoList: [
//         {
//           id: 662,
//           status: 'ADMIN',
//           title: '구독 상품',
//           star: 3,
//           contents: '열글자 이상의 구독 리뷰3',
//           createdDate: '2022-08-21',
//           name: '관리자',
//           email: 'admin@gmail.com',
//           _links: {
//             query_review: {
//               href: 'http://localhost:8080/api/admin/reviews/662',
//             },
//             delete_review: {
//               href: 'http://localhost:8080/api/admin/reviews/662',
//             },
//           },
//         },
//         {
//           id: 663,
//           status: 'RETURN',
//           title: '구독 상품',
//           star: 3,
//           contents: '열글자 이상의 구독 리뷰4',
//           createdDate: '2022-08-20',
//           name: '김회원',
//           email: 'user@gmail.com',
//           _links: {
//             query_review: {
//               href: 'http://localhost:8080/api/admin/reviews/663',
//             },
//             delete_review: {
//               href: 'http://localhost:8080/api/admin/reviews/663',
//             },
//           },
//         },
//         {
//           id: 664,
//           status: 'ADMIN',
//           title: '구독 상품',
//           star: 3,
//           contents: '열글자 이상의 구독 리뷰4',
//           createdDate: '2022-08-20',
//           name: '관리자',
//           email: 'admin@gmail.com',
//           _links: {
//             query_review: {
//               href: 'http://localhost:8080/api/admin/reviews/664',
//             },
//             delete_review: {
//               href: 'http://localhost:8080/api/admin/reviews/664',
//             },
//           },
//         },
//         {
//           id: 666,
//           status: 'ADMIN',
//           title: '구독 상품',
//           star: 3,
//           contents: '열글자 이상의 구독 리뷰5',
//           createdDate: '2022-08-19',
//           name: '관리자',
//           email: 'admin@gmail.com',
//           _links: {
//             query_review: {
//               href: 'http://localhost:8080/api/admin/reviews/666',
//             },
//             delete_review: {
//               href: 'http://localhost:8080/api/admin/reviews/666',
//             },
//           },
//         },
//         {
//           id: 665,
//           status: 'RETURN',
//           title: '구독 상품',
//           star: 3,
//           contents: '열글자 이상의 구독 리뷰5',
//           createdDate: '2022-08-19',
//           name: '김회원',
//           email: 'user@gmail.com',
//           _links: {
//             query_review: {
//               href: 'http://localhost:8080/api/admin/reviews/665',
//             },
//             delete_review: {
//               href: 'http://localhost:8080/api/admin/reviews/665',
//             },
//           },
//         },
//       ],
//     },
//     _links: {
//       first: {
//         href: 'http://localhost:8080/api/admin/reviews?page=0&size=5',
//       },
//       prev: {
//         href: 'http://localhost:8080/api/admin/reviews?page=0&size=5',
//       },
//       self: {
//         href: 'http://localhost:8080/api/admin/reviews?page=1&size=5',
//       },
//       next: {
//         href: 'http://localhost:8080/api/admin/reviews?page=2&size=5',
//       },
//       last: {
//         href: 'http://localhost:8080/api/admin/reviews?page=7&size=5',
//       },
//       approve_reviews: {
//         href: 'http://localhost:8080/api/admin/reviews/approval',
//       },
//       create_best_reviews: {
//         href: 'http://localhost:8080/api/admin/reviews/best',
//       },
//       profile: {
//         href: '/docs/index.html#resources-admin-query-reviews',
//       },
//     },
//     page: {
//       size: 5,
//       totalElements: 40,
//       totalPages: 8,
//       number: 1,
//     },
//   },
// };
