import React, { useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './card.module.scss';
import Image from 'next/image';
import { getDataSSR, postObjData } from '/src/pages/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import {subscribePlanType} from "/store/TYPE/subscribePlanType";
import transformDate from "/util/func/transformDate";
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import { useEffect } from 'react';


export default function MypageCardPage({ data }) {
  
  // !  CARD NAME => '알수없음' 조건 ?
  const [cardList, setCardList] = useState(data || []);
  console.log(data);

  useEffect(() => {
    // console.log(router);
    // console.log(router.query.subscribeId);

    const jquery = document.createElement('script');
    jquery.src = 'https://code.jquery.com/jquery-1.12.4.min.js';

    const iamport = document.createElement('script');
    iamport.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';

    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };

  }, []);

  const onChangeCard = async(id) => {
    // alert('card 변경 로직 시작');
   /* 1. 가맹점 식별하기 */
    const IMP = window.IMP;
    IMP.init(process.env.NEXT_PUBLIC_IAMPORT_CODE);

    const randomStr= new Date().getTime().toString(36);
    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: 'kcp_billing', // PG사
      pay_method: 'card', // 결제수단
      amount:0,
      customer_uid : `customer_Uid_${randomStr}`,   
      };
    IMP.request_pay(data, callback);
    
    /* 4. 결제 창 호출하기 */
    async function callback(response) {
      console.log(response);
      const { success,customer_uid, imp_uid, merchant_uid,card_name,card_number, error_msg } = response;
      
    /* 3. 콜백 함수 정의하기 */
    if (success) {
      // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
      // TODO: 결제 정보 전달 
      const r = await postObjData(`/api/cards/subscribes/${id}`, {
        customerUid : customer_uid,
        cardName : card_name,
        cardNumber :card_number
      });
      console.log(r);
      if(r.isDone){
        alert('카드변경 성공');
      }
    } else {
        alert('카드변경 실패');
    } 
    }
  }


  return (
    <>
      <MetaTitle title="마이페이지 카드관리" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>카드관리</section>

            <section className={s.body}>
              <div className={s.table_box}>
                <div className={s.grid_title_box}>
                  <div className={s.col_1}>카드명</div>
                  <div>구독중인 플랜</div>
                  <div>다음 결제일</div>
                  <div>다음 결제 금액</div>
                  <div></div>
                </div>

                <section className={s.line_box}>
                  <hr className={s.line} />
                </section>
                {cardList.length === 0 ? (
                  <EmptyContMessage message={'구독 중인 카드가 없습니다.'} />
                ) : (
                  <ul className={'card-list-container'}>
                    {cardList.map((card, index) => (
                      <li key={`subscribe-card-${index}`} className={s.grid_body_box}>
                        <div className={s.col_1}>
                          <div className={`${s.image} img-wrap`}>
                            <Image
                              src={require('public/img/pages/card/card_card.png')}
                              objectFit="cover"
                              layout="fill"
                              alt="카드 이미지"
                            />
                          </div>
                          <span>{card.subscribeCardDto.cardName}&nbsp;{card.subscribeCardDto.cardNumber.slice(-4)}</span>
                        </div>
                        <div className={s.col_2}>({card.subscribeCardDto.dogName}) {subscribePlanType[card.subscribeCardDto.plan].KOR} / {card.recipeNameList.join(', ')}</div>

                        <div>
                          <span className={s.col_1_m}>다음 결제일</span>
                          {transformDate(card.subscribeCardDto.nextPaymentDate, null, {seperator:'.'})}
                        </div>

                        <div>
                          <span className={s.col_1_m}>다음 결제금액</span>
                          {transformLocalCurrency(card.subscribeCardDto.nextPaymentPrice)}원
                        </div>
                        <div className={s.btn_box}>
                          <button className={s.btn} type={'button'} onClick={()=>onChangeCard(card.subscribeCardDto.subscribeId)}>카드변경</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
            <section className={s.second_body}>
              <div className={s.text}>정기구독 결제 카드가 여기에 표시됩니다.</div>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}


export async function getServerSideProps({ req }) {
  const getApiUrl = '/api/cards';
  const res = DUMMY_RESPONSE  // ! TSET
  // const res =await getDataSSR(req, getApiUrl);
  let DATA = null;
  const embeddedData = res?.data._embedded;
  if (embeddedData) {
    const dataList = embeddedData?.querySubscribeCardsDtoList || [];
    if (!dataList.length) return;
    DATA = dataList.map((data) => ({
      subscribeCardDto: {
        subscribeId: data.subscribeCardDto.subscribeId,
        cardId: data.subscribeCardDto.cardId,
        cardName: data.subscribeCardDto.cardName,
        cardNumber: data.subscribeCardDto.cardNumber,
        dogName: data.subscribeCardDto.dogName,
        plan: data.subscribeCardDto.plan,
        nextPaymentDate: data.subscribeCardDto.nextPaymentDate,
        nextPaymentPrice: data.subscribeCardDto.nextPaymentPrice,
      },
      recipeNameList: data.recipeNameList,
    }));
  }
  return { props: { data: DATA } };
}




let DUMMY_RESPONSE = {
  data: {
    "_embedded" : {
      "querySubscribeCardsDtoList" : [ {
        "subscribeCardDto" : {
          "subscribeId" : 121,
          "cardId" : 120,
          "cardName" : "카드이름1",
          "cardNumber" : "카드번호1",
          "dogName" : "김바프",
          "plan" : "FULL",
          "nextPaymentDate" : "2022-07-28T10:51:47.551",
          "nextPaymentPrice" : 120000
        },
        "recipeNameList" : [ "스타트" ],
        "_links" : {
          "change_card" : {
            "href" : "http://localhost:8080/api/cards/subscribe/121"
          }
        }
      }, {
        "subscribeCardDto" : {
          "subscribeId" : 132,
          "cardId" : 131,
          "cardName" : "카드이름2",
          "cardNumber" : "카드번호2",
          "dogName" : "김바프2",
          "plan" : "TOPPING",
          "nextPaymentDate" : "2022-07-28T10:51:47.623",
          "nextPaymentPrice" : 120000
        },
        "recipeNameList" : [ "스타트", "터키비프" ],
        "_links" : {
          "change_card" : {
            "href" : "http://localhost:8080/api/cards/subscribe/132"
          }
        }
      }, {
        "subscribeCardDto" : {
          "subscribeId" : 143,
          "cardId" : 142,
          "cardName" : "카드이름3",
          "cardNumber" : "카드번호3",
          "dogName" : "김바프3",
          "plan" : "HALF",
          "nextPaymentDate" : "2022-07-28T10:51:47.66",
          "nextPaymentPrice" : 120000
        },
        "recipeNameList" : [ "스타트", "터키비프" ],
        "_links" : {
          "change_card" : {
            "href" : "http://localhost:8080/api/cards/subscribe/143"
          }
        }
      } ]
    },
    "_links" : {
      "self" : {
        "href" : "http://localhost:8080/api/cards"
      },
      "profile" : {
        "href" : "/docs/index.html#resources-query-subscribeCards"
      }
    }
  }
  
}