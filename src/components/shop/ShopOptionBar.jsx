import React, { useState } from 'react';
import s from './shopOptionBar.module.scss';
import Wrapper from '../common/Wrapper';
import { ItemQuantityInput } from '../atoms/ItemQuantityInput';
import CloseButton from '../atoms/CloseButton';
import CustomSelect from '../admin/form/CustomSelect';
import Styles from '../../pages/shop/single.module.scss';
import { CustomSelectWithCustomOptions } from '../survey/CustomSelectWithCustomOptions';

/*
* "id" : 301,
    "name" : "옵션2",
    "optionPrice" : 2000,
    "remaining" : 999
*
* */

//  "id" : 299,
//     "name" : "옵션1",
//     "optionPrice" : 1000,
//     "remaining" : 999

export const ShopOptionBar = ({ optionInfo, setFormValues }) => {
  const [active, setActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});

  const options = optionInfo.map((info) => ({ label: info.name, value: info.id }));
  const defaultOption = { label: '상품선택', value: null };
  options.unshift(defaultOption);

  const onClickHandler = () => {
    setActive((prevState) => !prevState);
  };
  // 옵션 품절일 경우, 선택 가능한 Select 옵션에서 제외한다

  console.log(optionInfo);

  return (
    <div id={s['shop-optionBar']} className={`${active ? s.active : ''}`}>
      <Wrapper>
        <button
          type={'button'}
          onClick={onClickHandler}
          className={s['optionBar-visibility-button']}
        >
          옵션 선택
        </button>
        <div className={s.container}>
          <div className={s.selector}>
            <CustomSelect
              id={'options'}
              options={options}
              setFormValues={setFormValues}
              id={'option'}
            />
          </div>
          <ul>
            {optionInfo?.map((option, index) => (
              <li key={`item-option-${option.id || index}`} className={s.item}>
                <span className={s.title}>강아지 고양이 냄새제거 살균 소독 탈취제 바프레쉬 BARF, FRESH 500ml</span>
                <div className={s['input-quantity']}>
                  <ItemQuantityInput
                    id={'01'}
                    setFormValues={setFormValues}
                    style={{ borderColor: '#ddd' }}
                  />
                </div>
                <span>52,200원</span>
                <span>
                  <CloseButton onClick={''} lineColor={'#ababab'} style={{width:'18px', height:'18px'}}/>
                </span>
              </li>
            ))}
          </ul>
          <div className={s['price-indicator']}>
            <span className={s.title}>총 상품금액 :</span>
            <span className={s.totalPrice}>52,500</span>
            <em className={s.unit}>원</em>
          </div>
          <div className={s['btn-section']}>
            <button type={'button'} className={s.cart}>
              장바구니
            </button>
            <button type={'button'} className={s.buy}>
              구매하기
            </button>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};
