import React, { useEffect, useState } from 'react';
import s from './modal_member_subscribe.module.scss';
import ModalWrapper from '/src/components/modal/ModalWrapper';
import rem from '/util/func/rem';
import { PopupCloseButton } from '/src/components/popup/PopupCloseButton';
import ScrollContainer from '/src/components/atoms/ScrollContainer';
import transformDate from '/util/func/transformDate';
import transformDecimalNumber from '/util/func/transformDecimalNumber';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { getData } from '../../pages/api/reqData';
import { dogInedibleFoodType } from '../../../store/TYPE/dogInedibleFoodType';
import { dogCautionType } from '../../../store/TYPE/dogCautionType';



const initialSubscribeInfoData = {
  id: null,
  dogName: null,
  accumulatedSubscribe: null,
  plan: null,
  recipeNameList: null,
  amount: null,
  paymentPrice: null,
  subscribeStartDate: null,
  deliveryDate: null,
  inedibleFood: null,
  significant: null,
};

export default function Modal_member_subscribe({ memberId, onClick, setIsLoading }) {
  
  const [subscribeInfoList, setSubscribeInfoList] = useState([initialSubscribeInfoData]);

  const onHideModalHandler = () => {
    if (onClick && typeof onClick === 'function') {
      onClick();
    }
  };
 
  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          subsribeFetching: true,
        }));
        const query = '?page=0&size=100';
        const getSubscribeInfoApiUrl = `/api/admin/members/${memberId}/subscribes${query}`;
        const res = await getData(getSubscribeInfoApiUrl);   // ------- ! 서버에서 받기
        console.log('RESPONSE DATA: ', res);
        // const res = DUMMY_RESPONSE;
        if (res.data) {
          const subscribeList = res.data._embedded.memberSubscribeAdminDtoList;
          const infoList = subscribeList.map((list) => {
            const DATA = list.querySubscribeAdminDto;
            return {
              id: DATA.id,
              dogName: DATA.dogName,
              subscribeCount: (DATA.subscribeCount ? DATA.subscribeCount : '0') + ' 회차', // 구독회차
              plan: DATA.plan, // 플랜
              recipeNameList: list.recipeNames.join(', '), // 레시피
              amount: transformDecimalNumber(DATA.amount, 0) + ' g', // 하루 권장 식사량
              paymentPrice:
                (DATA.paymentPrice ? transformLocalCurrency(DATA.paymentPrice) : '0') + ' 원', // 결제금액
              subscribeStartDate: transformDate(DATA.subscribeStartDate), // 구독 시작일
              deliveryDate: DATA.deliveryDate || '-', // 최근 발송일
              inedibleFood:
                DATA.inedibleFood !== dogInedibleFoodType.NONE && DATA.inedibleFood
                  ? `${DATA.inedibleFood}`
                  : 'N',
              inedibleFoodEtc:
                DATA.inedibleFood !== dogInedibleFoodType.NONE &&
                DATA.inedibleFoodEtc !== dogInedibleFoodType.NONE &&
                DATA.inedibleFoodEtc &&
                DATA.inedibleFoodEtc,
              caution: (DATA.caution !== dogCautionType.NONE && DATA.caution) ? DATA.caution : 'N',
            };
          });
          console.log(infoList);
          setSubscribeInfoList(infoList);
        } else {
          // console.error('구독중인 상품이 없습니다.');
          alert('구독중인 상품이 없습니다.');
        }
      } catch (err) {
        console.error(err);
        console.error(err.response);
        console.error('데이터를 가져올 수 없습니다.');
      }
      setIsLoading((prevState) => ({
        ...prevState,
        subsribeFetching: false,
      }));
    })();
  }, []);

  console.log(subscribeInfoList[0].id);
  return (
    <ModalWrapper
      background
      label="회원정보 조회"
      onBackgroundClick={onHideModalHandler}
      style={{
        padding: 0,
        width: `calc(100% - ${rem(100)})`,
        maxWidth: `${rem(800)}`,
      }}
      positionCenter
    >
      <header className={s.header}>
        <div className={s.row}>
          <div className={s.cont}>
            <h1 className={s['popup-title']}>구독정보</h1>
          </div>
        </div>
      </header>
      <main className={s.body}>
        <section className={s.table}>
          <div className={s['t-header']}>
            <div className={`${s['table-list']} ${s['row']}`}>
              <h4 className={s.title}>
                구독 상품:
                <em className={s['subscribe-count']}>
                  {subscribeInfoList[0].id ? subscribeInfoList.length : '없음'}
                </em>
              </h4>
            </div>
          </div>
          <ScrollContainer
            className={s['table-container']}
            scrollBarWidth={subscribeInfoList.length >= 2 ? '12' : '0'}
            style={{ maxHeight: '345px' }}
          >
            <ul>
              {subscribeInfoList.length > 0 &&
                subscribeInfoList.map((info) => (
                  <li key={info.id} className={`${s['table-list']} ${s['row']}`}>
                    <ul className={s['t-body']}>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>견명</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{info.dogName}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>구독회차</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{info.subscribeCount}</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>플랜</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{info.plan}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>레시피</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{info.recipeNameList}</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>하루 권장 식사량</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{info.amount}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>결제금액</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{info.paymentPrice}</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>구독 시작일</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{info.subscribeStartDate}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>최근 발송일</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{info.deliveryDate}</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>못 먹는 음식</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>
                              {info.inedibleFood}{' '}
                              {info.inedibleFoodEtc && `(${info.inedibleFoodEtc})`}
                            </span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>특이사항</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{info.caution}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                ))}
            </ul>
          </ScrollContainer>
        </section>
        <section className={s['btn-section']}>
          <PopupCloseButton onClick={onHideModalHandler} />
        </section>
      </main>
    </ModalWrapper>
  );
}




const DUMMY_RESPONSE = {
  data: {
    _embedded: {
      memberSubscribeAdminDtoList: [
        {
          querySubscribeAdminDto: {
            id: 10680,
            dogName: '김바프',
            subscribeStartDate: '2022-07-18T13:48:31.244',
            subscribeCount: 14,
            plan: 'FULL',
            amount: 101.0,
            paymentPrice: 120000,
            deliveryDate: '2022-07-26',
            inedibleFood: '닭',
            inedibleFoodEtc: 'NONE',
            caution: '특이사항내용',
          },
          recipeNames: ['스타터프리미엄', '덕&램'],
        },
        {
          querySubscribeAdminDto: {
            id: 10650,
            dogName: '김바프',
            subscribeStartDate: '2022-07-18T13:48:31.201',
            subscribeCount: 11,
            plan: 'FULL',
            amount: 101.0,
            paymentPrice: 120000,
            deliveryDate: '2022-07-26',
            inedibleFood: 'NONE',
            inedibleFoodEtc: 'NONE',
            caution: 'NONE',
          },
          recipeNames: ['코끼리&칠면조'],
        },
      ],
    },
    page: {
      size: 3,
      totalElements: 13,
      totalPages: 5,
      number: 1,
    },
  },
};

