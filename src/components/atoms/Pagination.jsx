import Arrow from '@public/img/icon/pagination-arrow.svg';
import DoubleArrow from '@public/img/icon/pagination-double-arrow.svg';
import { useState } from 'react';
import s from './pagination.module.scss';

const Pagination = ({ itemCountPerGroup, itemTotalCount, theme }) => {
  const [curPage, setCurPage] = useState(1);
  const numberOfPages = Math.ceil(itemTotalCount / itemCountPerGroup);

  const onChangeCurPage = (e) => {
    const targetPage = Number(e.currentTarget.dataset.page);
    setCurPage(targetPage);
  };

  let Paginations = [];
  const Num = ({ pagenum }) => {
    const calcedPageNum = pagenum + 1;
    return (
      <li key={pagenum} data-theme={theme}>
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

  const NumberOfPaginations = 5;
  const leftSideNumber = curPage - 2;
  const rightSideNumber = curPage + 2;
  const fistPageindex = 0;
  const lastPageNum = numberOfPages;
  const calcedLastPageNumber = lastPageNum - 1;

  if (numberOfPages > NumberOfPaginations) {
    if (leftSideNumber <= 0) {
      for (let i = 0; i < NumberOfPaginations; i++) {
        Paginations.push(<Num pagenum={i} key={i} />);
      }
      Paginations.push(
        <PaginationRightTail pagenum={calcedLastPageNumber} key={calcedLastPageNumber} />,
      );
    } else if (leftSideNumber > 0 && rightSideNumber < lastPageNum) {
      for (let i = leftSideNumber - 1; i < rightSideNumber; i++) {
        Paginations.push(<Num pagenum={i} key={i} />);
      }

      if (numberOfPages > NumberOfPaginations) {
        Paginations.push(
          <PaginationRightTail pagenum={calcedLastPageNumber} key={calcedLastPageNumber} />,
        );
      }
    } else if (curPage <= lastPageNum) {
      Paginations.push(<PaginationLeftTail pagenum={fistPageindex} key={fistPageindex} />);
      for (let i = lastPageNum - NumberOfPaginations; i < lastPageNum; i++) {
        Paginations.push(<Num pagenum={i} key={i} />);
      }
    }
  } else if (numberOfPages <= NumberOfPaginations) {
    // console.log();
    for (let i = 0; i < lastPageNum; i++) {
      Paginations.push(<Num pagenum={i} key={i} />);
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

  return (
    <div
      className={s['pagination']}
      // page-counter-per-group={itemCountPerGroup}
      data-cur-page={curPage}
    >
      <span className={`${s['arrow']} ${s['first-page']}`} onClick={onFirstPage}>
        <DoubleArrow />
      </span>
      <span className={`${s['arrow']} ${s['prev-page']}`} onClick={onPrevPage}>
        <Arrow />
      </span>
      <ul className={s.pages}>{Paginations}</ul>
      <span className={`${s['arrow']} ${s['next-page']}`} onClick={onNextPage}>
        <Arrow />
      </span>
      <span className={`${s['arrow']} ${s['last-page']}`} onClick={onLastPage}>
        <DoubleArrow />
      </span>
    </div>
  );
};
export default Pagination;
