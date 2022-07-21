import React, { useEffect, useState } from 'react';
import s from './shopOptionBar.module.scss';
import Wrapper from '../common/Wrapper';
import { ItemQuantityInput } from '../atoms/ItemQuantityInput';
import CloseButton from '/src/components/atoms/CloseButton';
import CustomSelect from '/src/components/admin/form/CustomSelect';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import rem from '/util/func/rem';
import sorting from '/util/func/sorting';
import Link from 'next/link';

export const ShopOptionBar = ({ data, formValues, setFormValues }) => {
  // SELECT OPTION
  const defaultOption = { label: '상품선택', value: '' };
  const selectOptions = data.opt.map((option) => ({
    label:
      `${option.name} (재고: ` +
      `${option.remaining > 0 ? transformLocalCurrency(option.remaining) : '없음'})`,
    value: option.id,
    inStock: option.remaining > 0,
  }));
  selectOptions.unshift(defaultOption);

  // SELECTED OPTION LIST INFO
  const initialOptionDataList = data.opt.map((option) => ({
    id: option.id,
    name: option.name,
    optionPrice: option.optionPrice,
    remaining: option.remaining,
    quantity: data.minQuantity,
    optionTotalPrice: option.optionPrice, // 해당 옵션 개수 * 옵션 수량
    selected: false,
  }));

  // STATE
  const [active, setActive] = useState(false); // boolean
  const [optionDataList, setOptionDataList] = useState(initialOptionDataList); // array

  // console.log(optionDataList)
  // CALCULATE TOTAL PRICE
  useEffect(() => {
    const originalItemPrice = formValues.itemPrice;
    const sumItemPrice = originalItemPrice * formValues.itemAmount;

    let sumOptionsPrice = 0;
    const selectedOptionDataList = optionDataList?.filter((option) => option.selected) || [];
    if (selectedOptionDataList.length) {
      sumOptionsPrice = selectedOptionDataList
        .map((option) => option.optionTotalPrice)
        .reduce((acc, cur) => acc + cur);
    }
    const totalPrice = sumItemPrice + sumOptionsPrice;
    setFormValues((prevState) => ({
      ...prevState,
      optionDtoList: selectedOptionDataList.map((option) => ({
        optionId: option.id,
        optionAmount: option.quantity,
      })),
      totalPrice: totalPrice,
    }));
  }, [optionDataList, formValues.itemAmount]);

  const onSelectOptionHandler = (optionId) => {
    setOptionDataList((prevState) => {
      const nextState = prevState?.map((optionObj) =>
        optionObj.id === optionId ? { ...optionObj, selected: true } : optionObj,
      );
      const sorted_nextState = sorting(nextState, 'selected', 'descend');
      return sorted_nextState;
    });
  };

  const onChangeQuantityInputHandler = (optionId, quantity) => {
    // console.log(optionId, quantity);
    setOptionDataList((prevState) => {
      return prevState.map((optionObj) => {
        if (optionObj.id === optionId) {
          const thisOptionPrice = optionObj.optionPrice;
          const totalPrice = thisOptionPrice * quantity;
          return {
            ...optionObj,
            quantity: quantity,
            optionTotalPrice: totalPrice,
          };
        } else {
          return optionObj;
        }
      });
    });
  };

  const onDeleteOption = (e) => {
    const button = e.currentTarget;
    const optionId = Number(button.dataset.id);
    setOptionDataList((prevState) => {
      return prevState.map((optionObj) => {
        if (optionObj.id === optionId) {
          return {
            ...optionObj,
            quantity: 1,
            selected: false,
          };
        } else {
          return optionObj;
        }
      });
    });
  };

  const onActiveShopOptionBar = () => {
    setActive((prevState) => !prevState);
  };

  return (
    <div id={s['shop-optionBar']} className={`${active ? s.active : ''}`}>
      <Wrapper>
        <button
          type={'button'}
          onClick={onActiveShopOptionBar}
          className={s['optionBar-visibility-button']}
        >
          옵션 선택
        </button>
        <div className={s.container}>
          <div className={s.selector}>
            <CustomSelect
              options={selectOptions}
              // value={''}
              setFormValues={onSelectOptionHandler}
              dataType={'number'}
            />
          </div>
          <ul>
            {optionDataList?.length > 0 &&
              optionDataList?.map(
                (option, index) =>
                  option.selected && (
                    <li key={`item-option-${option.id || index}`} className={s.item}>
                      <span className={s.title}>{option.name}</span>
                      <div className={s['input-quantity']}>
                        <ItemQuantityInput
                          id={option.id}
                          style={{ borderColor: '#ddd' }}
                          onChange={onChangeQuantityInputHandler}
                          value={option.quantity}
                          minQuantity={data.minQuantity}
                          maxQuantity={data.maxQuantity}
                        />
                      </div>
                      <span className={s.optionPrice}>
                        {transformLocalCurrency(option.optionTotalPrice || option.optionPrice)}원
                      </span>
                      <span>
                        <CloseButton
                          onClick={onDeleteOption}
                          data-id={option.id}
                          lineColor={'#ababab'}
                          style={{ width: `${rem(18)}`, height: `${rem(18)}` }}
                        />
                      </span>
                    </li>
                  ),
              )}
          </ul>
          <div className={s['price-indicator']}>
            <span className={s.title}>총 상품금액 :</span>
            <span className={s.totalPrice}>
              {transformLocalCurrency(formValues.totalPrice || 0)}
            </span>
            <em className={s.unit}>원</em>
          </div>
          <div className={s['btn-section']}>
            <Link href="/cart" passHref>
              <a className={s.cart}>장바구니</a>
            </Link>
            <Link href="/order/ordersheet" passHref>
              <a className={s.buy}>구매하기</a>
            </Link>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

// 최종가격 => 기본 상품가격 + 옵션 각각에 대하여 계산한 가격
