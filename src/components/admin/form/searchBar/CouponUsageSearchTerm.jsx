import React, { useRef, useCallback } from 'react';
import s from './searchBar.module.scss';
import { transformToday } from '/util/func/transformDate';
import { getDiffDate, getDiffDateNumber } from '/util/func/getDiffDate';
import { global_searchDateType } from '/store/TYPE/searchDateType';

const CouponUsageSearchTerm = ({
  searchValue,
  setSearchValue,
  title,
  tooltip,
}) => {
  const { createdDateFrom, createdDateTo } = searchValue;
  const optionalRef = useRef();
  const diffDate = getDiffDateNumber(createdDateFrom, createdDateTo);

  const onChangeTerm = useCallback((e) => {
    const target = e.currentTarget;
    const diffDate = Number(target.dataset.value);
    const diffDateFromPast = diffDate * -1;

    const to = transformToday();
    const from =
      diffDate === 'all'
        ? global_searchDateType.oldestDate
        : getDiffDate(diffDateFromPast);

    setSearchValue((prevState) => ({
      ...prevState,
      createdDateFrom: from,
      createdDateTo: to,
    }));
  }, []);

  const onDriectTermHandler = useCallback((e) => {
    const dateInput = e.currentTarget;
    const { id, value } = dateInput;

    setSearchValue((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  }, []);

  return (
    <>
      <div className={s['search-row']}>
        <h4 className={s['title']}>
          {title}
          {tooltip && <span className={s['tooltip-wrap']}>{tooltip}</span>}
        </h4>
        <div className={`${s['inp-wrap']} ${s['term']}`}>
          <div>
            {global_searchDateType.BUTTONS.map((btn, i) => (
              <button
                key={`SearchTermButton-${i}`}
                onClick={onChangeTerm}
                data-value={btn.diffDate}
                className={`admin_btn line basic_l ${
                  Math.abs(diffDate) === btn.diffDate ? s.active : ''
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
        <div className={`${s['inp-wrap']} ${s['term']}`}>
          <div>
            <input
              type="date"
              id="createdDateFrom"
              onChange={onDriectTermHandler}
              onKeyUp={onDriectTermHandler}
              value={searchValue.createdDateFrom || ''}
            />
            <i> ~ </i>
            <input
              type="date"
              id="createdDateTo"
              onChange={onDriectTermHandler}
              onKeyUp={onDriectTermHandler}
              value={searchValue.createdDateTo || ''}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponUsageSearchTerm;
