import Arrow from '@public/img/icon/pagination-arrow.svg';
import DoubleArrow from '@public/img/icon/pagination-double-arrow.svg';
import {useEffect, useState} from 'react';
import s from './pagination.module.scss';
import {useRouter} from "next/router";
import {getNewPageInfo} from "/util/func/getNewPageInfo";




const Pagination = ({ apiURL, size=10, theme = 'square', setItemList }) => {
  const router = useRouter();
  const query = router.query;
  const pageFromQuery = Number(query?.page) || 1;
  const ButtonCounts = 5; // UI상으로 노출시킬 연속된 페이지네이션 수
  const [pageInfo, setPageInfo] = useState({});
  const [curPage, setCurPage] = useState(pageFromQuery);


  useEffect(()=>{
    (async ()=>{
      const newPageInfo = await getNewPageInfo(apiURL, curPage, size);
      setPageInfo(newPageInfo);
      setItemList(newPageInfo.newItemList);
      await router.push({
        search: `?page=${newPageInfo.newPageNumber}`
      });
    })();
  }, [curPage]);





  const Num = ({ pagenum }) => {
    const calcedPageNum = pagenum + 1;
    const onChangeCurPage = (e) => {
      const targetPage = Number(e.currentTarget.dataset.page);
      setCurPage(targetPage);
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
  const numberOfPages = pageInfo.totalPages || Math.ceil(pageInfo.totalItems / size);

  if (numberOfPages > ButtonCounts) {
    if (leftSideNumber <= 0) {
      for (let i = 0; i < ButtonCounts; i++) {
        Paginations.push(<Num pagenum={i} key={i} setCurPage={setCurPage} />);
      }
      Paginations.push(
        <PaginationRightTail pagenum={calcedLastPageNumber} key={calcedLastPageNumber} />,
      );
    } else if (leftSideNumber > 0 && rightSideNumber < lastPageNum) {
      for (let i = leftSideNumber - 1; i < rightSideNumber; i++) {
        Paginations.push(<Num pagenum={i} key={i} setCurPage={setCurPage} />);
      }

      if (numberOfPages > ButtonCounts) {
        Paginations.push(
          <PaginationRightTail pagenum={calcedLastPageNumber} key={calcedLastPageNumber} />,
        );
      }
    } else if (curPage <= lastPageNum) {
      Paginations.push(<PaginationLeftTail pagenum={fistPageindex} key={fistPageindex} />);
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
    setCurPage(prevPage);
  };
  const onNextPage = () => {
    if (curPage >= lastPageNum) return;
    const NextPage = curPage + 1;
    setCurPage(NextPage);
  };

  const onFirstPage = () => {
    const firstPage = 1;
    setCurPage(firstPage);
  };

  const onLastPage = () => {
    const lastPage = numberOfPages;
    setCurPage(lastPage);
  };

  const hasMultiPages = pageInfo.totalPages > 1;

  return (
    <>
      {pageInfo.totalItems > 0 && <div
        className={`${s['pagination']} ${hasMultiPages ? s.hasMultiPages : ''}`}
        page-counter-per-gourp={size}
        data-cur-page={curPage}
      >
        {hasMultiPages && <><span className={`${s['arrow']} ${s['first-page']}`} onClick={onFirstPage}>
        <DoubleArrow />
      </span>
          <span className={`${s['arrow']} ${s['prev-page']}`} onClick={onPrevPage}>
        <Arrow />
      </span></>}

        <ul className={s.pages}>
          {Paginations}
        </ul>

        {hasMultiPages && <><span className={`${s['arrow']} ${s['next-page']}`} onClick={onNextPage}>
        <Arrow />
      </span>
          <span className={`${s['arrow']} ${s['last-page']}`} onClick={onLastPage}>
        <DoubleArrow />
      </span></>}

      </div>}
    </>
  );
};
export default Pagination;
