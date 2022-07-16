import React, {useEffect} from 'react';
import s from './payment.module.scss';

export function Payment () {
  useEffect( () => {
    const jquery = document.createElement( 'script' );
    jquery.src = 'https://code.jquery.com/jquery-1.12.4.min.js';
    
    const iamport = document.createElement( 'script' );
    iamport.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';
    
    document.head.appendChild( jquery );
    document.head.appendChild( iamport );
    return () => {
      document.head.removeChild( jquery );
      document.head.removeChild( iamport );
    };
  }, [] );
  
  function onClickPayment () {
    /* 1. 가맹점 식별하기 */
    const IMP = window.IMP;
    IMP.init( process.env.NEXT_PUBLIC_IAMPORT_CODE );
    
    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: 'kcp', // PG사
      pay_method: 'card', // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: 1, // 결제금액
      name: '바프독 아임포트 결제 테스트', // 주문명
      buyer_name: 'username', // 구매자 이름
      buyer_tel: '01000000000', // 구매자 전화번호
      buyer_email: 'a@gmail', // 구매자 이메일
      buyer_addr: '센텀2로', // 구매자 주소
      buyer_postcode: '00000', // 구매자 우편번호
    };
    
    /* 4. 결제 창 호출하기 */
    IMP.request_pay( data, callback );
  }
  
  /* 3. 콜백 함수 정의하기 */
  function callback (response) {
    const {success, merchant_uid, error_msg} = response;
    
    if ( success ) {
      // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
      // TODO: 결제 정보 전달
      alert( '결제 성공' );
    } else {
      alert( `결제 실패: ${error_msg}` );
      window.location.reload();
    }
  }
  
  return (
    <button onClick={onClickPayment} className={s.payment}>
      결제하기
    </button>
  );
}