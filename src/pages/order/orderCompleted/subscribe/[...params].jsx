import React, { useEffect, useState } from 'react';
import LayoutWithoutFooter from '/src/components/common/LayoutWithoutFooter';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '@src/components/atoms/MetaTitle';
import s from 'src/pages/order/orderCompleted/index.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { postObjData, getData, postDataSSR } from '/src/pages/api/reqData';
import axios from 'axios';
import { useRouter } from 'next/router';

function OrderCompletedPage(props) {
  const router = useRouter();
  const { imp_success, error_msg, params } = router.query;
  const [orderIdx] = params;
  const [orderPrice, setOrderPrice] = useState(0);

  useEffect(() => {
    // 결제금액 가져오기
    try {
      (async () => {
        const url = `api/orders/${orderIdx}/subscribe`;
        const res = await getData(url);

        if (res?.status === 200) {
          setOrderPrice(Number(res.data.orderDto.orderPrice));
        }
      })();
    } catch (err) {
      console.error(err);
    }

    // Naver Analytics Script
    const script1 = document.createElement('script');
    script1.src = '//wcs.naver.net/wcslog.js';
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.innerHTML = `
      var _nasa = {};
      if (window.wcs) _nasa["cnv"] = wcs.cnv("1", "${orderPrice}"); // 전환유형, 전환가치
    `;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <>
      <MetaTitle title="정기구독 주문완료" />
      <LayoutWithoutFooter>
        <Wrapper>
          <section className={s.text_box}>
            <div className={s.row_1}>
              견주님,
              <br />
              바프독과 함께해 주셔서 감사합니다
            </div>
            <div className={s.row_2}>
              바프독은 주문 후 맞춤 생산되어 <span>가장 신선한 상태</span>로
              전달됩니다.
            </div>
          </section>
          <section className={s.btn_box}>
            <div className={s.flex_box}>
              <Link href={'/'}>
                <button className={s.left_btn}>홈으로</button>
              </Link>
              <Link href={`/mypage/orderHistory/subscribe/${orderIdx}`}>
                <button className={s.right_btn}>주문내역 보기</button>
              </Link>
            </div>
          </section>
        </Wrapper>
      </LayoutWithoutFooter>
    </>
  );
}

export default OrderCompletedPage;
