import React, { useEffect, useRef } from 'react';
import s from './searchBar.module.scss';
import siblings from '@util/func/siblings';
import ToolTip from '@src/components/atoms/Tooltip';
import { transformToday } from '/util/func/transformDate';
import {getDiffDate, getDiffDateNumber} from '/util/func/getDiffDate';
import {global_searchDateType} from "/store/TYPE/searchDateType";


//내부에서 from 과 to값을 비교해서, 그차이만큼의 값이랑 button의 inner value의 값이 동일하면 active가 되도록만든다. 


const SearchTerm = ({ searchValue, setSearchValue, title, tooltip }) => {
  const optionalRef = useRef();

  useEffect(() => {
    const diffDate = getDiffDateNumber(searchValue.from, searchValue.to);
    initializeOptionalButtons(diffDate);
  }, [searchValue]);

  const initializeOptionalButtons = (diffDateNum) => {
    const optionalButtons = Array.from(optionalRef.current.children);
    optionalButtons.forEach((t) => {
      const dateValue = t.dataset.value;
      if(Number(dateValue) === diffDateNum){
        t.classList.add(s.active)
      } else {
        t.classList.remove(s.active)
      }
    });
  };

  const onOptionalTermHandler = (e) => {
    const target = e.currentTarget;
    const value = target.dataset.value;
    const to = transformToday();
    const from = value === 'all' ? global_searchDateType.lastTime : getDiffDate(value);
    setSearchValue((prevState) => ({
      ...prevState,
      from,
      to,
    }));
    // target.classList.add(s.active);
    // siblings(target).forEach((t) => t.classList.remove(s.active));
  };

  const onDriectTermHandler = (e) => {
    const dateInput = e.currentTarget;
    const { id, value} = dateInput;

    setSearchValue((prevState) => ({
      ...prevState,
      [id]: value
    }));

    const optionalCategoryList = Array.from(optionalRef.current.children);
    optionalCategoryList.forEach((t) => t.classList.remove(s.active));
  };
  // searcj Value의 from값과

  return (
    <>
      <div className={s['search-row']}>
        <h4 className={s['title']}>
          {title}
          {tooltip && <span className={s['tooltip-wrap']}>{tooltip}</span>}
        </h4>
        <div className={`${s['inp-wrap']} ${s['term']}`}>
          <div ref={optionalRef}>
            <button
              onClick={onOptionalTermHandler}
              data-value={0}
              className={`admin_btn line basic_l`}
            >
              오늘
            </button>
            <button
              onClick={onOptionalTermHandler}
              data-value={-3}
              className="admin_btn line basic_l"
            >
              3일
            </button>
            <button
              onClick={onOptionalTermHandler}
              data-value={-7}
              className="admin_btn line basic_l"
            >
              7일
            </button>
            <button
              onClick={onOptionalTermHandler}
              data-value={-30}
              className="admin_btn line basic_l"
            >
              30일
            </button>
            <button
              onClick={onOptionalTermHandler}
              data-value={-60}
              className="admin_btn line basic_l"
            >
              60일
            </button>
            <button
              onClick={onOptionalTermHandler}
              data-value={-120}
              className="admin_btn line basic_l"
            >
              120일
            </button>
            <button
              onClick={onOptionalTermHandler}
              data-value={global_searchDateType.lastTimeDiffDate}
              className="admin_btn line basic_l"
            >
              전체
            </button>
          </div>
        </div>
        <div className={`${s['inp-wrap']} ${s['term']}`}>
          <div>
            <input
              type="date"
              id="from"
              onChange={onDriectTermHandler}
              onKeyUp={onDriectTermHandler}
              value={searchValue.from || ''}
            />
            <i> ~ </i>
            <input
              type="date"
              id="to"
              onChange={onDriectTermHandler}
              onKeyUp={onDriectTermHandler}
              value={searchValue.to || ''}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchTerm;


