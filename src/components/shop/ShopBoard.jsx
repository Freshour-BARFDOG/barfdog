import React, {useEffect, useState} from 'react';
import Styles from '../../pages/shop/item/[itemId].module.scss';
import Image from 'next/image';
import {ItemQuantityInput} from '../atoms/ItemQuantityInput';

export const ShopBoard = () => {
  const limitedItemQuanity = 2;
  
  const [buyInfo, setBuyInfo] = useState( {
    quantity: 0,
  } );
  useEffect( () => {
    if ( buyInfo.quantity >= limitedItemQuanity )
      alert( `수량제한 ${limitedItemQuanity}개 (최대 구매가능 수량 > 불필요 시 삭제` );
    // component에는 제한기능 넣어두고,사용하는 페이지에서만 해당 기능을 비활성화시키도록 사용하면 됨.
  }, [buyInfo.quantity] );
  
  return (
    <section className={Styles.top}>
      <div className={Styles.inner}>
        <div className={Styles.top_box}>
          <div className={Styles.left_box}>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                priority
                src={require( '/public/img/shop/single/shop_single_top.png' )}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>
          
          <div className={Styles.right_box}>
            <div className={Styles.content_title}>
              강아지 고양이 냄새제거 살균 소독 탈취제 바프레쉬 BARF, FRESH 500ml
            </div>
            
            <div className={Styles.price_box}>
              <span className={Styles.price}>52,500</span>
              <span className={Styles.won}>원</span>
            </div>
            
            <div className={Styles.mid_box}>
              <div>Tip</div>
              
              <div>
                생식을 처음 적응하는 단계에서는 식단에 너무 많은 재료를 넣지 않는 것이 좋습니다.
                아이들이 처음 생식을 먹는 단계에서 소화에 부담없이 적응할 수 있도록 흰살고기
                칠면조와 닭고기를 활용한 완벽한 비율의 스타트 프리미엄을 이용해보세요.
              </div>
              
              <div>배송정보</div>
              
              <div>
                택배배송 3,000원<br className={Styles.del_br}></br>(50,000원 이상 구매 시 무료)
                <br/>
                <div className={Styles.text}>제주 및 도서산간 지역은 배송이 불가능합니다</div>
              </div>
              
              <div>
                <div>수량선택</div>
              </div>
              <ItemQuantityInput
                id={'quantity'}
                value={buyInfo.quantity}
                setFormValues={setBuyInfo}
              />
            </div>
            
            {/* 총 상품금액 */}
            <div className={Styles.total_price}>
              <div>
                <span className={Styles.left_text}>총 상품금액 :</span>
                <span className={Styles.mid_text}>52,500</span>
                <span className={Styles.last_text}>원</span>
              </div>
            </div>
            
            {/* 장바구니 버튼 */}
            <div className={Styles.shop_button_box}>
              <div className={Styles.basket_button}>장바구니</div>
              
              <div className={Styles.buy_button}>구매하기</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};