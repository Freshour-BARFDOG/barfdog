import Arrow from '/public/img/icon/pagination-arrow.svg';
import DoubleArrow from '/public/img/icon/pagination-double-arrow.svg';
import { useEffect, useState } from 'react';
import s from './pagination.module.scss';
import { useRouter } from 'next/router';
import { getData, postObjData } from '/src/pages/api/reqData';
import { searchQueryType } from '/store/TYPE/searchQueryType';
import { convertSearchQueryStrings } from '/util/func/convertSearchQueryStrings';
import { getCookie } from '@util/func/cookie';

const Pagination = ({
  apiURL,
  size = 10,
  theme = 'square',
  setItemList,
  queryItemList,
  setIsLoading,
  urlQuery,
  setPageData,
  routerDisabled = false,
  pageInterceptor,
  setCurrentPage,
  isSubmitted,
  setIsSubmitted,
  option = { apiMethod: 'GET', body: null, initialize: false },
  onSearch,
}) => {
  const router = useRouter();
  const pageFromQuery = Number(router.query.page) || 1;
  const ButtonCounts = 5; // UI상으로 노출시킬 연속된 페이지네이션 수;
  const [pageInfo, setPageInfo] = useState({});
  const [curPage, setCurPage] = useState(
    option.initialize === true ? 1 : pageFromQuery,
  );

  const [queryObject, setQueryObject] = useState(Object.fromEntries(new URLSearchParams(urlQuery)));

  // itemType, sortBy 등 urlQuery 변경 감지 및 page = 1 추가 적용
  useEffect(() => {
    const searchParams = new URLSearchParams(urlQuery);
    searchParams.set('page', '1');
    setQueryObject(Object.fromEntries(searchParams.entries()));
  }, [urlQuery]);

// queryObject 변경 → fetch 실행
  useEffect(() => {
    fetchData(apiURL, option.apiMethod, option.body);
    if (isSubmitted) setIsSubmitted(false);
  }, [
    apiURL,
    option.apiMethod,
    option.body,
    isSubmitted,
    queryObject,
  ]);

  // Page 1 적용: 페이지 초기화
  useEffect(() => {
    if (queryObject.page === undefined) return;
    setCurPage(Number(queryObject.page))
  }, [queryObject.page])

  useEffect(() => {
    if (option.initialize === true) {
      setCurPage(1);
    }
  }, [option.initialize]);

  useEffect(() => {
    setCurrentPage && setCurrentPage(curPage);
  }, [curPage]);

  // Page 1 제거: 페이지 변경시 queryString 의 page 제거
  const changedQueryParams = () => {
    const searchParams = new URLSearchParams(urlQuery);
    searchParams.delete('page');
    setQueryObject(Object.fromEntries(searchParams.entries()))
  }

  const fetchData = async (url, method, query) => {
    try {
      if (setIsLoading && typeof setIsLoading === 'function') {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
      }
      const calcedPageIndex = (queryObject.page ? queryObject.page - 1 : curPage - 1).toString();
      const defQuery = `?${searchQueryType.PAGE}=${calcedPageIndex}&${searchQueryType.SIZE}=${size}`;

      // URLQuery 재구성 - page 쿼리 중복 방지를 위함
      const { page, ...queryWithoutPage } = queryObject;
      const newUrlQuery = new URLSearchParams(queryWithoutPage).toString();

      let urlQueries = urlQuery ? `${defQuery}&${newUrlQuery}` : defQuery;
      let res;
      if (method === 'GET') {
        //res = await getData(`${url}${urlQueries}`);
        if (getCookie('alliance') === 'cb') {
          res = await getData(`${url}${urlQueries}&alliance=cb`);
        } else {
          res = await getData(`${url}${urlQueries}`);
        }
      } else if (method === 'POST' && option.body) {
        const body = option.body;
        res = await postObjData(`${url}${defQuery}`, body);
        const result = getUrlQueryFromBody(body);
        urlQueries = `${urlQueries}&${result}`;
        res = res.data;
      }
      // console.log(res.data);
      const pageData = res?.data?.page;
      const hasItems = pageData?.totalElements !== 0;
      const hasInterceptor =
        pageInterceptor && typeof pageInterceptor === 'function';
      if (hasInterceptor || (pageData && hasItems)) {
        const newPageInfoFromInterceptor =
          hasInterceptor && (await pageInterceptor(res));
        const newPageInfo = newPageInfoFromInterceptor || {
          totalPages: pageData.totalPages,
          size: pageData.size,
          totalItems: pageData.totalElements,
          currentPageIndex: pageData.number,
          newPageNumber: pageData.number + 1,
          newItemList: res?.data?._embedded[queryItemList] || [],
        };

        setPageInfo(newPageInfo);
        setItemList(newPageInfo.newItemList || []);
        if (setPageData && typeof setPageData === 'function') {
          setPageData(newPageInfo);
        }

        if (routerDisabled === false) {
          const convertedSearchQueryStrings = convertSearchQueryStrings(urlQueries);
          router.push(`${convertedSearchQueryStrings}`, undefined, { shallow: false });
        }
      } else {
        setItemList([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (setIsLoading && typeof setIsLoading === 'function') {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: false,
        }));
      }
    }
  };


  const Num = ({ pagenum }) => {
    const calcedPageNum = pagenum + 1;
    const onChangeCurPage = (e) => {
      const targetPage = Number(e.currentTarget.dataset.page);
      setCurPage(targetPage);
      changedQueryParams();
    };

    return (
      <li data-theme={theme}>
        <span
          className={s['btn-page']}
          data-cur-page={curPage === calcedPageNum}
          data-page={calcedPageNum}
          onClick={onChangeCurPage}
        >
          {calcedPageNum}
        </span>
      </li>
    );
  };

  const PaginationLeftTail = ({ pagenum }) => {
    return (
      <>
        <Num pagenum={pagenum} />
        <li>
          <span className={`${s['btn-page']} ${s['dots']}`}>...</span>
        </li>
      </>
    );
  };
  const PaginationRightTail = ({ pagenum }) => {
    return (
      <>
        <li>
          <span className={`${s['btn-page']} ${s['dots']}`}>...</span>
        </li>
        <Num pagenum={pagenum} />
      </>
    );
  };

  const Paginations = [];
  const leftSideNumber = curPage - 2;
  const rightSideNumber = curPage + 2;
  const fistPageindex = 0;
  const lastPageNum = pageInfo.totalPages;
  const calcedLastPageNumber = lastPageNum - 1;
  const numberOfPages =
    pageInfo.totalPages || Math.ceil(pageInfo.totalItems / size);

  if (numberOfPages > ButtonCounts) {
    if (leftSideNumber <= 0) {
      for (let i = 0; i < ButtonCounts; i++) {
        Paginations.push(<Num pagenum={i} key={i} setCurPage={setCurPage} />);
      }
      Paginations.push(
        <PaginationRightTail
          pagenum={calcedLastPageNumber}
          key={calcedLastPageNumber}
        />,
      );
    } else if (leftSideNumber > 0 && rightSideNumber < lastPageNum) {
      for (let i = leftSideNumber - 1; i < rightSideNumber; i++) {
        Paginations.push(<Num pagenum={i} key={i} setCurPage={setCurPage} />);
      }

      if (numberOfPages > ButtonCounts) {
        Paginations.push(
          <PaginationRightTail
            pagenum={calcedLastPageNumber}
            key={calcedLastPageNumber}
          />,
        );
      }
    } else if (curPage <= lastPageNum) {
      Paginations.push(
        <PaginationLeftTail pagenum={fistPageindex} key={fistPageindex} />,
      );
      for (let i = lastPageNum - ButtonCounts; i < lastPageNum; i++) {
        Paginations.push(<Num pagenum={i} key={i} setCurPage={setCurPage} />);
      }
    }
  } else if (numberOfPages <= ButtonCounts) {
    for (let i = 0; i < lastPageNum; i++) {
      Paginations.push(<Num pagenum={i} key={i} setCurPage={setCurPage} />);
    }
  }

  const onPrevPage = () => {
    if (curPage <= 1) return;
    const prevPage = curPage - 1;
    changedQueryParams();
    setCurPage(prevPage);
  };
  const onNextPage = () => {
    if (curPage >= lastPageNum) return;
    const NextPage = curPage + 1;
    changedQueryParams();
    setCurPage(NextPage);
  };

  const onFirstPage = () => {
    const firstPage = 1;
    changedQueryParams();
    setCurPage(firstPage);
  };

  const onLastPage = () => {
    const lastPage = numberOfPages;
    changedQueryParams();
    setCurPage(lastPage);
  };

  const hasMultiPages = pageInfo.totalPages > 1;

  return (
    <>
      {pageInfo.totalItems > 0 && (
        <div
          className={`${s['pagination']} ${
            hasMultiPages ? s.multiPages : s.singlePage
          }`}
          page-counter-per-gourp={size}
          data-cur-page={curPage}
        >
          {hasMultiPages && (
            <>
              <span
                className={`${s['arrow']} ${s['first-page']}`}
                onClick={onFirstPage}
              >
                <DoubleArrow />
              </span>
              <span
                className={`${s['arrow']} ${s['prev-page']}`}
                onClick={onPrevPage}
              >
                <Arrow />
              </span>
            </>
          )}

          <ul className={s.pages}>{Paginations}</ul>

          {hasMultiPages && (
            <>
              <span
                className={`${s['arrow']} ${s['next-page']}`}
                onClick={onNextPage}
              >
                <Arrow />
              </span>
              <span
                className={`${s['arrow']} ${s['last-page']}`}
                onClick={onLastPage}
              >
                <DoubleArrow />
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
};
export default Pagination;

const getUrlQueryFromBody = (bodyObj) => {
  const tempArr = [];
  for (const key in bodyObj) {
    const val = bodyObj[key];
    tempArr.push(`${key}=${val || ''}`);
  }
  return tempArr.join('&');
};
