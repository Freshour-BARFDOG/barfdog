import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";
import s from 'src/pages/order/orderCompleted/index.module.scss';
import Image from 'next/image';
import Link from "next/link";
import { postObjData, getDataSSR ,postDataSSR} from '/src/pages/api/reqData';


function OrderCompletedPage(props) {
  return (
    <>
      <MetaTitle title="정기구독 주문완료" />
      <Layout>
        <Wrapper>
          <section className={s.text_box}>
            <div className={s.row_1}>
              견주님,<br />
              바프독과 함께해 주셔서 감사합니다
            </div>
            <div className={s.row_2}>
              바프독은 주문 후 맞춤 생산되어 <span>가장 신선한 상태</span>로 전달됩니다.
            </div>
          </section>
          <section className={s.btn_box}>
            <div className={s.flex_box}>
              <Link href={'/'}>
                <button className={s.left_btn}>
                  홈으로
                </button>
              </Link>
              <Link href={`/mypage/orderHistory/subscribe/${props.orderIdx}`}>
                <button className={s.right_btn}>
                  주문내역 보기
                </button>
              </Link>
            </div>
          </section>

        </Wrapper>
      </Layout>
    </>
  );
}

export default OrderCompletedPage;

export async function getServerSideProps(ctx) {
  const { query, req } = ctx;
  const { params, imp_uid, merchant_uid, imp_success} = query;
  
  console.log(query);
  const [orderIdx,customUid] = params;

  if(imp_success == 'true'){
    console.log(merchant_uid);
    console.log(imp_success);

    const r = await postDataSSR(req,`/api/orders/${orderIdx}/subscribe/success`, {
      impUid : imp_uid,
      merchantUid : merchant_uid,
      customerUid: `customer_Uid_${customUid}`
    });
    
  } else if(imp_success == 'false'){
     // 모바일 결제 실패
     const fail = await postDataSSR(req,`/api/orders/${orderIdx}/subscribe/fail`);
     console.log(fail); 
  }
  return { props: { orderIdx } };
}