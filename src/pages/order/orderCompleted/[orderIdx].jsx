import React, { useEffect, useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '@src/components/atoms/MetaTitle';
import s from 'src/pages/order/orderCompleted/index.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { getDataSSR } from '/src/pages/api/reqData';
import useNaverAnalytics from "../../../../util/hook/useNaverAnalytics";

function OrderCompletedPage(props) {
  const [orderPrice, setOrderPrice] = useState(0);
  const { triggerConversion } = useNaverAnalytics();

  useEffect(() => {
    // Naver Analytics Script
    triggerConversion('1', props.orderPrice);
  }, [props.orderPrice]);

  return (
    <>
      <MetaTitle title="일반상품 주문완료" />
      <Layout>
        <Wrapper>
          <section className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require('public/img/order/order_left.png')}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require('public/img/order/order_center.png')}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require('public/img/order/order_right.png')}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </section>

          <section className={s.text_box}>
            <div className={s.row_1}>주문완료</div>
            <div className={s.row_2}>
              <em>주문이 완료</em>되었습니다. 감사합니다!
            </div>
          </section>

          <section className={s.order_box}>
            <div className={s.grid_box}>
              <div className={s.row_3}>배송 상품</div>
              <div className={s.row_4}>{props.orderItemValue}</div>
              <div className={s.row_3}>배송 주소</div>
              <div className={s.row_4}>{props.address}</div>
              <div className={s.row_3}>발송예정일</div>
              <div className={s.row_4}>
                {props.arrivalDate || '1 ~ 2일 내 발송'}
              </div>
            </div>
          </section>

          <section className={s.btn_box}>
            <div className={s.flex_box}>
              <Link href={'/'}>
                <button className={s.left_btn}>홈으로</button>
              </Link>
              <Link href={`/mypage/orderHistory/single/${props.orderIdx}`}>
                <button className={s.right_btn}>주문내역 확인</button>
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

  const { orderIdx } = query;

  // console.log(query);
  let orderItemValue = null;
  let address = null;
  let arrivalDate = null;
  let orderPrice = null;

  const getApiUrl = `/api/orders/${orderIdx}/general`;
  let res = await getDataSSR(req, getApiUrl);
  const data = res?.data || null;
  // console.log(data);
  if (data) {
    const itemList = data.orderItemDtoList || [];
    orderItemValue = `${itemList[0].itemName} ${
      itemList.length > 1 ? `외 ${itemList.length - 1}개` : ''
    }`;
    address = `${data.orderDto.street} ${data.orderDto.detailAddress}`;
    arrivalDate = data.orderDto.arrivalDate;
    orderPrice = data.orderDto.orderPrice;
  }

  return {
    props: { orderIdx, orderItemValue, address, arrivalDate, orderPrice },
  };
}
