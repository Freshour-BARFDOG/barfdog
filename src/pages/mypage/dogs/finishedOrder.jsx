import React from 'react';
import LayoutWithoutFooter from '/src/components/common/LayoutWithoutFooter';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './dogs.module.scss';
import { useRouter } from 'next/router';

function Mypage() {
  const router = useRouter();
  const query = router.query;
  const username = query.username;

  return (
    <>
      <MetaTitle title={`정기구독 주문완료`} />
      <LayoutWithoutFooter>
        <Wrapper>
          <div className={s.text_box}>
            <div className={s.maintext}>
              {username}견주님, <br />
              바프독과 함께해 주셔서 감사합니다.
            </div>

            <div className={s.subtext}>
              바프독은 배송 전 제조한 제품을 <br />{' '}
              <span>가장 신선한 상태</span>로 배송해드립니다
            </div>
          </div>

          <section className={s.btn_box}>
            <button className={s.link_home}>홈으로</button>

            <button className={s.link_orderlist}>주문내역 보기</button>
          </section>
        </Wrapper>
      </LayoutWithoutFooter>
    </>
  );
}

export default Mypage;
