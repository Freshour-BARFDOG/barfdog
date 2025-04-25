import Arrow from '/public/img/icon/pagination-arrow.svg';
import DoubleArrow from '/public/img/icon/pagination-double-arrow.svg';
import s from './pagination.module.scss';
import { usePagination } from "/util/hook/usePagination";

const Pagination = ({ size, totalElements, onChange, initialPage = 0 }) => {
  const { currentPage, setCurrentPage, totalPages } = usePagination({
    size, totalElements, onChange, initialPage
  })


  const onChangeCurrentPage = (e) => {
    const targetPage = Number(e.currentTarget.dataset.page);

    setCurrentPage(targetPage-1);
    if (onChange) {
      onChange(targetPage-1);
    }
  };

  let paginationArray = [];
  const Num = ({ pageNum }) => {
    const calcPageNum = pageNum + 1;
    return (
      <li key={pageNum} data-theme='square'>
        <span
          className={s['btn-page']}
          data-cur-page={currentPage === pageNum}
          data-page={calcPageNum}
          onClick={onChangeCurrentPage}
        >
          {calcPageNum}
        </span>
      </li>
    );
  };

  const PaginationLeftTail = ({ pageNum }) => {
    return (
      <>
        <Num pagenum={pageNum} />
        <li>
          <span className={`${s['btn-page']} ${s['dots']}`}>...</span>
        </li>
      </>
    );
  };
  const PaginationRightTail = ({ pageNum }) => {
    return (
      <>
        <li>
          <span className={`${s['btn-page']} ${s['dots']}`}>...</span>
        </li>
        <Num pagenum={pageNum} />
      </>
    );
  };

  const NumberOfPagination = 5;
  const leftSideNumber = currentPage - 2;
  const rightSideNumber = currentPage + 2;
  const firstPageIndex = 0;
  const lastPageNum = totalPages;
  const calcLastPageNumber = lastPageNum - 1;

  if (totalPages > NumberOfPagination) {
    if (leftSideNumber <= 0) {
      for (let i = 0; i < NumberOfPagination; i++) {
        paginationArray.push(<Num pageNum={i} key={i} />);
      }
      paginationArray.push(
        <PaginationRightTail pageNum={calcLastPageNumber} key={calcLastPageNumber} />,
      );
    } else if (leftSideNumber > 0 && rightSideNumber < lastPageNum) {
      for (let i = leftSideNumber - 1; i < rightSideNumber; i++) {
        paginationArray.push(<Num pageNum={i} key={i} />);
      }

      if (totalPages > NumberOfPagination) {
        paginationArray.push(
          <PaginationRightTail pageNum={calcLastPageNumber} key={calcLastPageNumber} />,
        );
      }
    } else if (currentPage <= lastPageNum) {
      paginationArray.push(<PaginationLeftTail pageNum={firstPageIndex} key={firstPageIndex} />);
      for (let i = lastPageNum - NumberOfPagination; i < lastPageNum; i++) {
        paginationArray.push(<Num pageNum={i} key={i} />);
      }
    }
  } else if (totalPages <= NumberOfPagination) {
    for (let i = 0; i < lastPageNum; i++) {
      paginationArray.push(<Num pageNum={i} key={i} />);
    }
  }
  const handleChangeArrow = (type) => {
    let newPage;
    switch (type) {
      case 'prev': {
        newPage = currentPage - 1;
        break;
      }
      case 'next': {
        newPage = currentPage + 1;
        break;
      }
      case 'first': {
        newPage = 0;
        break;
      }
      case 'last': {
        newPage = totalPages - 1;
        break;
      }
      default: break;
    }
    setCurrentPage(newPage);
    if (onChange) {
      onChange(newPage);
    }
  }

  return (
    <div
      className={s['pagination']}
      data-cur-page={currentPage}
    >
      <button className={`${s['arrow']} ${s['first-page']}`} onClick={() => handleChangeArrow('first')} disabled={currentPage === 0}>
        <DoubleArrow />
      </button>
      <button className={`${s['arrow']} ${s['prev-page']}`} onClick={() => handleChangeArrow('prev')} disabled={currentPage === 0}>
        <Arrow />
      </button>
      <ul className={s.pages}>{paginationArray}</ul>
      <button className={`${s['arrow']} ${s['next-page']}`} onClick={() => handleChangeArrow('next')} disabled={currentPage+1 === totalPages}>
        <Arrow />
      </button>
      <button className={`${s['arrow']} ${s['last-page']}`} onClick={() => handleChangeArrow('last')} disabled={currentPage+1 === totalPages}>
        <DoubleArrow />
      </button>
    </div>
  );
};
export default Pagination;
