import React, {useEffect, useState} from 'react';
import s from './singleItemOptions.module.scss';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import transformLocalCurrency from '/util/func/transformLocalCurrency';

export default function SingleItemOptions({ setFormValues }) {
  const initialValue = {
    0: { name: '', price: 0, remaining: 0 },
  };

  const [options, setOptions] = useState(initialValue);

  // console.log(options);

  useEffect(() => {

    // Object를 배열로 변환하기
    if (setFormValues && typeof setFormValues === 'function') {
      const formValueKey = 'itemOptionSaveDtoList';
      let optionValues =Object.values(options);
      setFormValues((prevState) => {
        return {
          ...prevState,
          [formValueKey]: optionValues,
        };
      });
    }
  }, [options]);


  const onAddOptionHandler = () => {
    const currentItemCount = Object.keys(options).length;
    console.log(currentItemCount)
    const nextOptionIndex = currentItemCount;
    setOptions((prevState) => ({
      ...prevState,
      [nextOptionIndex]: {},
    }));
  };

  const onDeleteItemHandler = (e) => {
    const button = e.currentTarget;
    const tobeDeletedIndex = button.dataset.index;
    let newOptionList = {};
    for (const key in options) {
      const values = options[key];
      if(key !== tobeDeletedIndex) {
        const newKey = key > tobeDeletedIndex ?  Number(key)-1 : key;
        newOptionList = {
          ...newOptionList,
          [newKey]: values
        }
      }
    }
    setOptions(newOptionList);
  };


  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const index = input.dataset.index;
    const id = input.id.split('-')[0];
    const value = input.value;

    const filteredType = input.dataset.filterType;
    let filteredValue = filter_emptyValue(value);

    if (filteredType && filteredType.indexOf('number') >= 0) {
      filteredValue = filter_onlyNumber(filteredValue);
    }

    if (filteredType && filteredType.indexOf('currency') >= 0) {
      filteredValue = transformLocalCurrency(filteredValue);
    }

    setOptions((prevState) => ({
      ...prevState,
      [index]: {
        ...prevState[index],
        [id]: filteredValue,
      },
    }));

  };

  return (
    <>
      <div className="inp_section">
        <div className={`${s.cont_viewer}`}>
          <div className={s.table}>
            <ul className={s.table_header}>
              <li className={s.table_th}>옵션명</li>
              <li className={s.table_th}>옵션가</li>
              <li className={s.table_th}>재고수량</li>
              <li className={s.table_th}>삭제</li>
            </ul>
            <ul className="table_body">
              {Object.keys(options).map((DATA, index) => (
                <li key={`${index}`} className={s.item}>
                  <span>
                    <input
                      id={`name-${index}`}
                      className={s.name}
                      data-index={index}
                      type="text"
                      value={DATA.name || options[`${index}`]?.name || ''}
                      onChange={onInputChangeHandler}
                      placeholder={'옵션명 입력'}
                    />
                  </span>
                  <span>
                    <input
                      id={`price-${index}`}
                      data-index={index}
                      type="text"
                      value={DATA.price || options[`${index}`]?.price || 0}
                      data-filter-type={'number, currency'}
                      onChange={onInputChangeHandler}
                    />
                    <em className="unit">원</em>
                  </span>
                  <span>
                    <input
                      id={`remaining-${index}`}
                      type="text"
                      data-index={index}
                      value={DATA.remaining ||  options[`${index}`]?.remaining || 0}
                      data-filter-type={'number, currency'}
                      onChange={onInputChangeHandler}
                    />
                    <em className="unit">개</em>
                  </span>
                  <span>
                    <button
                      type={'button'}
                      data-index={index}
                      className="admin_btn basic_s solid"
                      onClick={onDeleteItemHandler}
                    >
                      삭제
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={s.btn_section}>
          <button type={'button'} className={'admin_btn line basic_m'} onClick={onAddOptionHandler}>
            옵션추가
          </button>
        </div>
      </div>
    </>
  );
}
