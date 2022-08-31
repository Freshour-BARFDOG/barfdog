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
  
  // 모바일 결제 실패했을때 결제실패 페이지로 이동
  useEffect(() => {
    if(imp_success == 'false'){
      router.push(`/order/orderFailed`);    
    }
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
              주문 취소는 다음 배송예정일 전<br className={s.br} /> 금요일 오후 12시까지<br />
              고객님이 직접 취소 가능합니다. 
              <br />
              <br />
              (바프독은 항상 금,토,일요일에 생산되어<br className={s.br} /> 수요일에 주문이 발송 됩니다.)
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
              협의필요
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
          {/* 기존 코드 */}

          {/* <section className={s.text_box}>
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
              <div className={s.left_btn}>
                홈으로
              </div>
              <div className={s.right_btn}>
                주문내역 보기
              </div>
            </div>
          </section> */}

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
     // 모바일 결제 실패
     const fail = await postDataSSR(req,`/api/orders/${orderIdx}/general/fail`);
     console.log(fail); 
     if (typeof window !== "undefined"){
      // 임시로 넣은 코드 :  결제취소시 , 전역에 import 결제 html이 잔류하여, 없애기위한 용도
      // window.location.href= '/';
    }
    
  }
  
  const getApiUrl = `/api/orders/${orderIdx}/general`;
  let res = await getDataSSR(req, getApiUrl);
  const data = res?.data || null;
  if (data) {
    const itemList = data.orderItemDtoList || [];
    orderItemValue = `${itemList[0].itemName} ${itemList.length > 1 ? `외 ${itemList.length-1}개` : ''}`;
    address = `${data.orderDto.street} ${data.orderDto.detailAddress}`;
  }
  
  return { props: { orderIdx, orderItemValue, address } };
}