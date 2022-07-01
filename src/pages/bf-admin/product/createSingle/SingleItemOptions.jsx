import React, { useEffect, useState } from 'react';
import s from './singleItemOptions.module.scss';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import compareIdList from "/util/func/compareIdList";

export default function SingleItemOptions({ id, formErrors, setFormValues, mode='create', originDataList=[]  }) {
  
  const [isFirstRendering, setIsFirstRendering] = useState(true);
  const [allIdList, setAllIdList] = useState([]); // for Post update summit event;
  const [options, setOptions] = useState([]);
  
  useEffect(() => {
    // ! important: 데이터fetching없이 useEffect의 dependency가 변화하지 않을 경우, 무한루프 (console로 확인가능)
    if(mode === 'update'){
      const initFullIdList = originDataList.map((data) => data.id);
      setAllIdList(initFullIdList)
      const initOptionList = originDataList.map((data) => ({
        id: data.id,
        name: data.name,
        price: transformLocalCurrency(data.optionPrice),
        remaining: transformLocalCurrency(data.remaining),
      }));
      setOptions(initOptionList);
    }

  }, [originDataList]);
  
  
  
  useEffect(() => {
    if (!setFormValues || typeof setFormValues !== 'function') return console.error('setFormValues타입이 올바르지 않습니다.');
    
    console.log(options);
    
    if (!isFirstRendering) {
      if (mode === 'update') {
        const curIdList = options.map((list) => list.id);
        const originIdList = originDataList.map((list) => list.id);
        const resultIdList = compareIdList(
          allIdList,
          curIdList,
          originIdList,
        );
        // -> 새로 추가한 항목은 undefined임요
        console.log('::: Array CRUD RESULT :::', resultIdList);
        // - 삭제될 옵션: ID list
        // - 신규 옵션: 객체 {name, price, remaining},
        // - 수정 옵션: 객체 {_____id)), name, price, remaining},
        let newOptionObj; // 그대로 집어넣음 되겠는데?
        let isNewOption;
        // options.map(option => option.id ? )
        // 옵션들 각각을 조회해야겠따.
        
        const newOptionArray = [];
        const updatedOptionArray = [];
        options.forEach(option => {
          option.id ? updatedOptionArray.push(option) : newOptionArray.push(option);
        })
        
        // console.log('new: ',newOptionArray,'___updated: ',updatedOptionArray)
        setFormValues((prevState) => ({
          ...prevState,
          [id]: newOptionArray,
          itemOptionUpdateDtoList: updatedOptionArray,
          deleteOptionIdList: resultIdList?.del || [], // array속에 객체리스트로 넣어야함.
        }));
      } else if (mode === 'create'){
        setFormValues((prevState) => ({
          ...prevState,
          [id]: options,
        }));
      }
    }
    
    setIsFirstRendering(false);
  }, [options]);
  
  
  
  
  const onAddOptionHandler = () => {
    const initialValueObj = { name: '', price: 0, remaining: 0 };
    setOptions((prevState) => [...prevState, initialValueObj]);
  };

  const onDeleteItemHandler = (e) => {
    const button = e.currentTarget;
    const tobeDeletedIndex = Number(button.dataset.index);
    let newOptionList = options.filter((option, index) => index !== tobeDeletedIndex);
    setOptions(newOptionList);
  };

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const thisInputIndex = Number(input.dataset.index);
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

    setOptions((prevState) => {
      const nextState = prevState.map((prevObj, index) => {
        if (index === thisInputIndex) {
          return {
            ...prevObj,
            [id]: filteredValue,
          };
        } else {
          return prevObj;
        }
      });
      return nextState;
    });
  };


  return (
    <>
      <div className="inp_section">
        {options.length > 0 && (
          <div key={`${options}`} className={`${s.cont_viewer}`}>
            <div className={s.table}>
              <ul className={s.table_header}>
                <li className={s.table_th}>
                  <span className={' required'}>옵션명</span>
                </li>
                <li className={s.table_th}>옵션가</li>
                <li className={s.table_th}>
                  <span className={' required'}>재고수량</span>
                </li>
                <li className={s.table_th}>삭제</li>
              </ul>
              <ul className="table_body">
                {options.map((DATA, index) => (
                  <li key={`options-${index}`} className={s.item}>
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
                        value={DATA.remaining || options[`${index}`]?.remaining || 0}
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
        )}
        <div className={s.btn_section}>
          <button type={'button'} className={'admin_btn line basic_m'} onClick={onAddOptionHandler}>
            옵션추가
          </button>
        </div>
        {typeof formErrors[id] === 'string' && formErrors[id]  && <ErrorMessage>{formErrors[id]}</ErrorMessage>}
      </div>
    </>
  );
}
