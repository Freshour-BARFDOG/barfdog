import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";
import s from 'src/pages/order/orderCompleted/index.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { postObjData, getDataSSR ,postDataSSR} from '/src/pages/api/reqData';
import { useEffect } from "react";
import { useRouter } from "next/router";

function OrderCompletedPage(props) {
  const router = useRouter();
  const { imp_success } = router.query;
  // console.log(router.query);
  

  // 모바일 결제 실패했을때 결제실패 페이지로 이동
  useEffect(() => {
    (async ()=>{
      if(imp_success == 'false'){
        await router.push(`/order/orderFailed`);
      }
    })();
  }, []);

  return (
    <>
      <MetaTitle title="일반상품 주문완료" />
      <Layout>
        <Wrapper>

          <section className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/survey/survey_loading_left.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/survey/survey_loading_right.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/survey/survey_loading_left.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </section>

          <section className={s.text_box}>
            <div className={s.row_1}>
              주문완료
            </div>
            <div className={s.row_2}>
              <em>주문이 완료</em>되었습니다. 감사합니다!
            </div>
          </section>

          <section className={s.order_box}>
          <div className={s.grid_box}>
            <div className={s.row_3}>
              배송 상품
            </div>
            <div className={s.row_4}>
              {props.orderItemValue}
            </div>
            <div className={s.row_3}>
              배송 주소
            </div>
            <div className={s.row_4}>
              {props.address}
            </div>
            <div className={s.row_3}>
              발송예정일
            </div>
            <div className={s.row_4}>
              {props.arrivalDate || '1 ~ 2일 내 발송'}
            </div>
          </div>
          </section>

          <section className={s.btn_box}>
            <div className={s.flex_box}>
              <Link href={'/'}>
                <button className={s.left_btn}>
                  홈으로
                </button>
              </Link>
              <Link href={`/mypage/orderHistory/single/${props.orderIdx}`}>
                <button className={s.right_btn}>
                  주문내역 확인
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

  const { orderIdx , imp_uid, merchant_uid, imp_success,error_msg} = query;
  
  // console.log(query);
  let orderItemValue = null;
  let address = null;
  let arrivalDate = null;

  if(imp_success == 'true'){
    console.log(merchant_uid);
    console.log(imp_success);
    const r = await postDataSSR(req,`/api/orders/${orderIdx}/general/success`, {
      impUid : imp_uid,
      merchantUid : merchant_uid
    });

    console.log(r);
  
    // const getApiUrl = `/api/orders/${orderIdx}/general`; // API 검색어: 일반 주문 하나 조회
    //
    // let res = await getDataSSR(req, getApiUrl);
    // const data = res?.data;
    // const itemList = data.orderItemDtoList;
    //
    // if (data) {
    //   orderItemValue = `${itemList[0].itemName} ${itemList.length > 1 ? `외 ${itemList.length-1}개` : null}`;
    //   address = `${data.orderDto.street} ${data.orderDto.detailAddress}`;
    // }

  } else if(imp_success == 'false'){
      if(error_msg.includes('결제포기')){
        const cancel = await postDataSSR(`/api/orders/${orderIdx}/general/cancel`);
        console.log(cancel);

      }else{
        // 모바일 결제 실패
        const fail = await postDataSSR(req,`/api/orders/${orderIdx}/general/fail`);
        console.log(fail); 
        if (typeof window !== "undefined"){
          // 임시로 넣은 코드 :  결제취소시 , 전역에 import 결제 html이 잔류하여, 없애기위한 용도
          // window.location.href= '/';
        }
      }
  }

  const getApiUrl = `/api/orders/${orderIdx}/general`;
  let res = await getDataSSR(req, getApiUrl);
  console.log(res);
  const data = res?.data || null;
  if (data) {
    const itemList = data.orderItemDtoList || [];
    orderItemValue = `${itemList[0].itemName} ${itemList.length > 1 ? `외 ${itemList.length-1}개` : ''}`;
    address = `${data.orderDto.street} ${data.orderDto.detailAddress}`;
    arrivalDate = data.orderDto.arrivalDate;
  }
  
  return { props: { orderIdx, orderItemValue, address, arrivalDate } };
}