import Styles from '../../pages/shop/single.module.scss';
import React from 'react';

export const ShopReturnExchageGuideBox = () => {
  return (
    <section className={Styles.tab_slide_box}>
      <div className={Styles.flex_box}>
        <div className={Styles.title}>바프독 반품/교환 안내</div>
      </div>
      
      <div className={Styles.flex_box2}>
        <div className={Styles.left}>판매자 지정 택배사</div>
        <div className={Styles.right}>CJ 대한통운</div>
      </div>
      
      <div className={Styles.flex_box2}>
        <div className={Styles.left}>반품 배송비</div>
        <div className={Styles.right}>편도 3,000원 (최소 배송비 무료인 경우 6,000원 부과)</div>
      </div>
      
      <div className={Styles.flex_box2}>
        <div className={Styles.left}>
          반품/교환 사유에 따른
          <br/>
          요청 가능 기간
        </div>
        <div className={Styles.right}>
          선식품, 맞춤제작식품: 불가 / 일반상품: 7일
          <br/>
          단, 주문이 생산되기 전 컷오프(다음 주문의 배송 전 금요일 24시) 전 까지 고객님이 직접 취소
          가능.
          <br/>
          (바프독은 항상 금 , 토, 일, 월요일에 생산되어 수요일 일괄 발송 됩니다)
        </div>
      </div>
      
      <div className={Styles.flex_box2}>
        <div className={Styles.left}>반품/교환 불가능 사유</div>
        <div className={Styles.right}>
          - 반품요청기간이 지난 경우
          <br/>
          - 구매자의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우
          <br/>
          - 구매자의 책임 있는 사유로 포장이 훼손되어 상품 가치가 현저히 상실된 경우
          <br/>
          - 구매자의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우
          <br/>
          - 시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우
          <br/>
          - 고객의 요청 사항에 맞춰 제작에 들어가는 맞춤 제작 식품의 경우
          <br/>- 고객의 부주의 혹은 잘못된 보관 방법으로 인한 상품 변질된 경우
        </div>
      </div>
      
      <div className={Styles.flex_box2}>
        <div className={Styles.left}>판매자 정보</div>
        <div className={Styles.right}>
          상호명 &#58; 프레쉬아워 &#47; 대표자 &#58; 임경호
          <br/>
          사업자등록번호 &#58; 4861801232
          <br/>
          통신판매업번호 &#58; 2020-충북충주-0634
          <br/>
          사업장 소재지 &#58; 충청북도 충주시 번영대로 214 1층 프레쉬아워 (우 &#58; 27352)
          <br/>
          고객센터 &#58; 043-855-4995
        </div>
      </div>
    </section>
  );
};