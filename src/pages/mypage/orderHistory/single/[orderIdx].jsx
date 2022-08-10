import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Styles from 'src/pages/mypage/orderHistory/ordersheet.module.scss';
import Image from 'next/image';
import {getDataSSR} from '/src/pages/api/reqData';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import transformPhoneNumber from '/util/func/transformPhoneNumber';
import popupWindow from '/util/func/popupWindow';


function SingleItem_OrderHistoryPage(props) {

  const data = props.data;
  // console.log(data);
  return (
    <>
      <MetaTitle title="마이페이지 주문내역 일반상품" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={Styles.title}>주문상세정보</section>

            <section className={Styles.body}>
              <div className={Styles.flex_box}>
                <div className={Styles.body_title}>주문상품</div>
                <div className={Styles.btn}>주문취소</div>
              </div>

              <hr  className={Styles.line1} />

              <section className={Styles.body_content_4}>
              <div className={Styles.grid_title}>
                    <div className={Styles.col_1}>상품 정보</div>
                    <div className={Styles.col_2}>수량</div>
                    <div className={Styles.col_3}>총 주문금액</div>
                    <div className={Styles.col_4}>쿠폰할인</div>
                    <div className={Styles.col_5}>주문상태</div>
                  </div>
                <div className={Styles.grid_box2}>
                  
                </div>

                <hr />

                <div className={Styles.grid_box2}>
                  <div className={Styles.col_6}>
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/mypage/order_history/subscribe_order_detail_1.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>

                    <div className={Styles.inner_text}>
                      <p>
                        바프독 레시피 올인원 패키지 강아지 생식 닭 칠면......
                      </p>
                      <div className={Styles.mid_text}>
                        세트1) 스타터4+터키비프2+덕램2+램비프2 (+2900원) / 1개
                      </div>
                      <div>세트2) 스타터5+터키브프5팩 / 2개</div>
                    </div>
                  </div>
                  <ul className={Styles.col_9}>
                    <div className={Styles.col_2}>3개</div>
                    <div className={Styles.col_3}>86,900원</div>
                  </ul>
                  <div className={Styles.col_7}>-8,690원</div>
                  <div className={Styles.col_5}>결제완료</div>
                </div>

                <hr className={Styles.line2} />

                <div className={Styles.grid_box2}>
                  <div className={Styles.col_6}>
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/mypage/order_history/subscribe_order_detail_1.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>

                    <div className={Styles.inner_text}>
                      <p>바프레드</p>
                    </div>
                  </div>
                  <ul className={Styles.col_9}>
                    <div className={Styles.col_2}>1개</div>
                    <div className={Styles.col_3}>86,900원</div>
                  </ul>
                  <div className={Styles.col_8}>0원</div>
                  <div className={Styles.col_5}>결제완료</div>
                </div>

                <hr className={Styles.line2} />
                {/* TODO 서버에서 받은 아이템 리스트 */}
                {
                data?.orderItemDtoList.map((item,i) => (
                <>
                <div className={Styles.grid_box2}>
                  <div className={Styles.col_6} key={i}>
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={item.thumbnailUrl}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>

                    <div className={Styles.inner_text}>
                      <p>{item.itemName}</p>
                    </div>
                  </div>
                  <ul className={Styles.col_9}>
                    <div className={Styles.col_2}>{item.amount}개</div>
                    <div className={Styles.col_3}>{transformLocalCurrency(item.finalPrice)}원</div>
                  </ul>
                  
                  { item.discountAmount > 0 ?
                  <div className={Styles.col_7}>-${transformLocalCurrency(item.discountAmount)}원</div>
                  : <div className={Styles.col_8}>0원</div>
                  }
                  
                  <div className={Styles.col_5}>결제완료</div>
                </div>
                { i !== (data?.orderItemDtoList.length - 1) ? <hr className={Styles.line2} />:null}
                </>
                ))
                }
              </section>
            </section>

            {/* 주문상품 결제정보 배송정보 */}
            <section className={Styles.body}>
              <div className={Styles.body_title}>주문정보</div>

              <hr />

              <div className={Styles.body_content_2}>
                <div className={Styles.grid_box}>
                  <div>주문번호</div>
                  <div>{data?.orderDto.merchantUid}</div>

                  <div>주문(결제)일시</div>
                  <div>{data?.orderDto.paymentDate}</div>
                  <div>배송정보</div>
                  <div>정기 구독 배송</div>
                </div>
              </div>
            </section>

            <section className={Styles.body}>
              <div className={Styles.body_title}>배송조회</div>

              <hr />

              {/* 주문상품 결제정보 배송정보 */}
              <div className={Styles.body_content_3}>
                {false && <p>배송중 상태에서 조회가 가능합니다.</p>}
                {true && (
                  <div className={Styles.deliveryTracking}>
                    {/* <span className={Styles.deliverytitle}>CJ대한통운</span>
                    <span data-delivery-trackingNumber={""}>
                      운송장번호<em>510017079554</em>
                    </span>
                    <span data-delivery-title={"배송상태"}>배송 중</span>
                    <button className={Styles.btn}>배송조회</button> */}
                    
                    <ul className={Styles.content_grid}>
                      <li>
                        <span>CJ대한통운</span>
                        <span data-delivery-tracking-number={""}>운송장번호</span>
                        <span>{data?.orderDto.deliveryNumber}</span>
                      </li>
                      <li data-delivery-title={"배송상태"}>배송중</li>
                      <li>
                        <button onClick={()=>popupWindow(`http://nexs.cjgls.com/web/service02_01.jsp?slipno=${data?.orderDto.deliveryNumber}`)}>
                          배송조회
                        </button>
                      </li>
                    </ul>

                  </div>
                )}
              </div>
            </section>

            {/* 주문상품 결제정보 배송정보 */}
            <section className={Styles.body}>
              <div className={Styles.body_title}>결제정보</div>

              <hr />

              <div className={Styles.body_content_2}>
                <div className={Styles.grid_box}>
                  <div>주문금액</div>
                  <div>{transformLocalCurrency( data?.orderDto.orderPrice )}원</div>
                  
                  <div>배송비</div>
                  <div>{transformLocalCurrency( data?.orderDto.deliveryPrice )}원</div>
                  
                  <div>할인금액</div>
                  <div>{transformLocalCurrency( data?.orderDto.discountTotal )}원</div>

                  <div>적립금 사용</div>
                  <div>{transformLocalCurrency( data?.orderDto.discountReward )}원</div>

                  <div>쿠폰사용</div>
                  <div>{transformLocalCurrency( data?.orderDto.discountCoupon )}원</div>

                  <div>결제 금액</div>
                  <div>{transformLocalCurrency( data?.orderDto.paymentPrice )}원</div>

                  <div>적립예정금액</div>
                  <div>{transformLocalCurrency( data?.savedRewardTotal )}원</div>

                  <div>결제방법</div>
                  <div>정기구독 카드결제</div>
                </div>
              </div>
            </section>

            <section className={Styles.body}>
              <div className={Styles.body_title}>배송정보</div>

              <hr />

              <div className={Styles.body_content_2}>
                <div className={Styles.grid_box}>
                  <div>받는 분</div>
                  <div>{data?.orderDto.name}</div>

                  <div>핸드폰</div>
                  <div>{data?.orderDto.phone.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/\-{1,2}$/g, "")}</div>

                  <div>배송방법</div>
                  <div>택배배송</div>

                  <div>배송주소</div>
                  <div>{data?.orderDto.street} {data?.orderDto.detailAddress}</div>
                  <div>배송요청사항</div>
                  <div>{data?.orderDto.request}</div>
                </div>
              </div>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default SingleItem_OrderHistoryPage;

export async function getServerSideProps(ctx) {
  
  const { query, req } = ctx;

  const orderIdx = query.orderIdx;

  let DATA = null;
  const getApiUrl = `/api/orders/${orderIdx}/general`;

  const res = await getDataSSR(req, getApiUrl);
  console.log('SERVER REPONSE: ',res);
  const data = res?.data;
  console.log(data);

  if (data) {
    DATA = {
      orderItemDtoList: data.orderItemDtoList?.map((item) => ({
        // orderItemId: item.id,
        thumbnailUrl: item.thumbnailUrl,
        selectOptionDtoList: item.selectOptionDtoList,
        itemName: item.itemName,
        amount: item.amount,
        finalPrice: item.finalPrice,
        discountAmount: item.discountAmount,
        status: item.status,
        saveReward: item.saveReward,
      })),
      orderDto:{
        orderId: data.orderDto.orderId,
        merchantUid: data.orderDto.merchantUid,
        paymentDate: data.orderDto.paymentDate,
        deliveryNumber: data.orderDto.deliveryNumber,
        orderPrice:data.orderDto.orderPrice,
        deliveryPrice: data.orderDto.deliveryPrice,
        discountTotal: data.orderDto.discountTotal,
        discountReward: data.orderDto.discountReward,
        discountCoupon: data.orderDto.discountCoupon,
        paymentPrice: data.orderDto.paymentPrice,
        paymentMethod: data.orderDto.paymentMethod,
        name: data.orderDto.name,
        phone: data.orderDto.phone,
        zipcode: data.orderDto.zipcode,
        street: data.orderDto.street,
        detailAddress: data.orderDto.detailAddress,
        request: data.orderDto.request,
        package: data.orderDto.package
      },
      savedRewardTotal:data.savedRewardTotal
    };
    console.log(DATA);
  }
  return { props: { orderIdx, data: DATA } }; 

}