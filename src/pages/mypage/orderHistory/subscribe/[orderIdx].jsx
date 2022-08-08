import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Styles from "src/pages/mypage/orderHistory/ordersheet.module.scss";
import Image from 'next/image';
import {getDataSSR} from '/src/pages/api/reqData';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import popupWindow from '/util/func/popupWindow';


function SubScribe_OrderHistoryPage(props) {
  const data = props.data;

  return (
    <>
      <MetaTitle title="마이페이지 주문내역 정기구독" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
              <section className={Styles.title}>
                주문상세정보
              </section>

              <section className={Styles.body}>
                <div className={Styles.body_title}>
                  주문상품
                </div>
                
                <hr />
                
                <span className={Styles.change}>
                  {data?.orderDto.beforePlan === null 
                    && data?.orderDto.beforeOneMealRecommendGram === null 
                    && data?.orderDto.beforeRecipeName === null 
                    && data?.orderDto.beforeOrderPrice === 0 ? '':'* 구독 정보 변경으로 주문 변경 내용이 있습니다. '}
                </span>

                <div className={Styles.body_content}>

                  <div className={Styles.left_box}>
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={data?.recipeDto.thumbnailUrl}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                  </div>

                  <div className={Styles.right_box}>
                    {/* 2가지로 나눔 */}
                    <div className={Styles.grid_box}>
                      <div>
                        구독정보
                      </div>
                      <div>
                        {data?.recipeNames} ({data?.orderDto.subscribeCount}회차)
                      </div>

                      <div>
                        반려견
                      </div>
                      <div>
                        {data?.orderDto.dogName}
                      </div>

                      <div>
                        급여량  
                      </div>
                      <div>
                        {data?.orderDto.oneMealRecommendGram}g
                      </div>

                      <div>
                        플랜  
                      </div>
                      <div>
                        {/* 풀플랜(28개) */}
                        {data?.orderDto.plan}
                      </div>

                      <div>
                        레시피  
                      </div>
                      <div>
                        {/* 믹스레시피(스타터프리미엄, 덕&amp;램) */}
                        {data?.recipeDto.recipeName}
                      </div>

                      <div>
                        가격
                      </div>
                      <div>
                        {transformLocalCurrency( data?.orderDto.orderPrice )}원
                      </div>

                    </div>
                  </div>
                </div>
              </section>


              {/* 주문상품 결제정보 배송정보 */}
              <section className={Styles.body}>
                <div className={Styles.body_title}>
                  주문정보
                </div>
                
                <hr />

                
                <div className={Styles.body_content_2}>
                  <div className={Styles.grid_box}>
                    <div>
                      주문번호
                    </div>
                    <div>
                      {data?.orderDto.merchantUid}
                    </div>

                    <div>
                      주문(결제)일시
                    </div>
                    <div>
                    {data?.orderDto.orderDate}
                    </div>
                    <div>
                      배송정보
                    </div>
                    <div>
                      정기 구독 배송
                    </div>
                    
                  </div>

                </div>
              </section>

              <section className={Styles.body}>
                <div className={Styles.body_title}>
                      배송조회
                </div>

                <hr />

                {/* 주문상품 결제정보 배송정보 */}
                <div className={Styles.body_content_3}>
                  <p>배송중 상태에서 조회가 가능합니다.</p>

                  <ul className={Styles.content_grid}>
                    <li>
                      <span>CJ대한통운</span>
                      <span>운송장번호</span>
                      <span>{data?.orderDto.deliveryNumber}</span>
                    </li>
                    <li>배송중</li>
                    <li>
                      <button onClick={()=>popupWindow(`http://nexs.cjgls.com/web/service02_01.jsp?slipno=${data?.orderDto.deliveryNumber}`)}>
                        배송조회</button>
                    </li>
                  </ul>
                  
                </div>
              </section>

              {/* 주문상품 결제정보 배송정보 */}
              <section className={Styles.body}>
                <div className={Styles.body_title}>
                  결제정보
                </div>
                
                <hr />

                
                <div className={Styles.body_content_2}>
                  <div className={Styles.grid_box}>
                    <div>
                      주문금액
                    </div>
                    <div>
                      {transformLocalCurrency( data?.orderDto.orderPrice )}원
                    </div>

                    <div>
                      배송비
                    </div>
                    <div>
                      정기구독 무료
                    </div>

                    <div>
                      할인금액
                    </div>
                    <div>
                      {transformLocalCurrency( data?.orderDto.discountTotal )}원   
                    </div>

                    <div>
                      적립금 사용
                    </div>
                    <div>
                      {transformLocalCurrency( data?.orderDto.discountReward )}원
                    </div>

                    <div>
                      쿠폰사용
                    </div>
                    <div>
                      {transformLocalCurrency( data?.orderDto.discountCoupon )}원  
                    </div>

                    <div>
                      결제 금액
                    </div>
                    <div>
                      {transformLocalCurrency( data?.orderDto.paymentPrice )}원
                    </div>
                    {/* TODO: */}
                    <div>
                      적립예정금액
                    </div>
                    <div>
                      3,000원
                    </div>

                    <div>
                      결제방법
                    </div>
                    <div>
                      카드결제
                    </div>
                    
                  </div>

                </div>
              </section>

              <section className={Styles.body}>
                <div className={Styles.body_title}>
                  배송정보
                </div>
                
                <hr />

                
                <div className={Styles.body_content_2}>
                  <div className={Styles.grid_box}>
                    <div>
                      받는 분
                    </div>
                    <div>
                    {data?.orderDto.recipientName}
                    </div>

                    <div>
                      핸드폰
                    </div>
                    <div>
                      {data?.orderDto.recipientPhone.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/\-{1,2}$/g, "")}
                    </div>

                    <div>
                      배송방법
                    </div>
                    <div>
                      택배배송
                    </div>

                    <div>
                      배송주소
                    </div>
                    <div>
                    {data?.orderDto.street} {data?.orderDto.detailAddress}
                    </div>
                    <div>
                      배송요청사항
                    </div>
                    <div>
                    {data?.orderDto.request}
                    </div>

                  </div>

                </div>
              </section>

              
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default SubScribe_OrderHistoryPage;

export async function getServerSideProps(ctx) {
  
  const { query, req } = ctx;
  // console.log(query, req)

  // const { orderIdx } = query;
  const orderIdx = query.orderIdx;

  let DATA = null;
  const getApiUrl = `/api/orders/${orderIdx}/subscribe`;
  
  const res = await getDataSSR(req, getApiUrl);
  console.log('SERVER REPONSE: ',res);
  const data = res?.data;
  console.log(data);
  if (data) {
    DATA = {
      recipeDto:{
        thumbnailUrl: data.recipeDto.thumbnailUrl,
        recipeName: data.recipeDto.recipeName
      },
      recipeNames:data.recipeNames,
      orderDto:{
        subscribeCount: data.orderDto.subscribeCount,
        dogName: data.orderDto.dogName,
        oneMealRecommendGram: data.orderDto.oneMealRecommendGram,
        plan: data.orderDto.plan,

        // paymentDate: data.orderDto.paymentDate,
        orderPrice:data.orderDto.orderPrice,
        beforeSubscribeCount: data.orderDto.beforeSubscribeCount,
        beforePlan: data.orderDto.beforePlan,
        beforeOneMealRecommendGram: data.orderDto.beforeOneMealRecommendGram,
        beforeRecipeName: data.orderDto.beforeRecipeName,
        beforeOrderPrice: data.orderDto.beforeOrderPrice,
        merchantUid: data.orderDto.merchantUid,
        orderType: data.orderDto.orderType,
        orderDate: data.orderDto.orderDate,
        deliveryNumber: data.orderDto.deliveryNumber,
        deliveryStatus: data.orderDto.deliveryStatus,
        deliveryPrice: data.orderDto.deliveryPrice,

        discountTotal: data.orderDto.discountTotal,
        discountReward: data.orderDto.discountReward,
        discountCoupon: data.orderDto.discountCoupon,
        paymentPrice: data.orderDto.paymentPrice,
        paymentMethod: data.orderDto.paymentMethod,
        recipientName: data.orderDto.recipientName,
        recipientPhone: data.orderDto.recipientPhone,
        zipcode: data.orderDto.zipcode,
        street: data.orderDto.street,
        detailAddress: data.orderDto.detailAddress,
        request: data.orderDto.request,
        // package: data.orderDto.package
      },
      // savedRewardTotal:data.savedRewardTotal
    };
    console.log(DATA);
  }
  return { props: { orderIdx, data: DATA } };  

}