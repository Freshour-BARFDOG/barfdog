import s from '/src/pages/mypage/subscribe/[subscribeId].module.scss';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { useModalContext } from '/store/modal-context';
import { ToggleBoxContext } from '/src/components/atoms/ToggleBox';
import { FullScreenLoading } from '/src/components/atoms/FullScreenLoading';
import { postObjData } from '/src/pages/api/reqData';
import Modal_confirm from '/src/components/modal/Modal_confirm';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import transformDate, { transformToday } from '/util/func/transformDate';
import { calcChangedSubscribeDeliveryDate } from '/util/func/calcNextSubscribeDeliveryDate';
import { subscribeSkipType } from '/store/TYPE/subscribeSkipType';
import { getDiffDateNumber } from '/util/func/getDiffDate';
import { useSubscribeInfo } from '/util/hook/useSubscribeInfo';
import { useRouter } from 'next/router';
import LayoutWithoutFooter from '/src/components/common/LayoutWithoutFooter';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { getData } from '../../../api/reqData';
import { formattedProductionAndReceivingDate } from '../../../../../util/func/formattedProductionAndReceivingDate';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function SubscribeSkipPage({ subscribeId }) {
  const router = useRouter();
  const [subscribeInfo, setSubscribeInfo] = useState();
  const [dogName, setDogName] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    (async () => {
      try {
        const apiUrl = `/api/subscribes/${subscribeId}`;
        const res = await getData(apiUrl);

        const subscribeData = res.data;

        console.log(res);

        if (res.status === 200) {
          setSubscribeInfo(subscribeData);
          setDogName(subscribeData.subscribeDto.dogName);

          setSelectedDate(
            formattedProductionAndReceivingDate(
              subscribeData?.subscribeDto.nextDeliveryDate,
            ).formattedReceivingDate,
          );
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  console.log(subscribeInfo);

  const mct = useModalContext();
  const tbContext = useContext(ToggleBoxContext);

  const curPlan = subscribeInfo?.subscribeDto.plan;
  const curPlanWeeklyPaymentCycle =
    subscribePlanType[curPlan]?.weeklyPaymentCycle;
  const inputIdKey = 'weeklySkipCount';
  const inputIdList = [
    `${inputIdKey}-1`,
    `${inputIdKey}-${curPlanWeeklyPaymentCycle}`,
  ];
  const inputLabelList = ['1주 건너뛰기', '1회 건너뛰기'];
  const initialInputValue = inputIdList[0];
  const initialDelvieryDate = subscribeInfo?.subscribeDto.nextDeliveryDate;

  const [skipCount, setSkipCount] = useState(initialInputValue);
  const [changedDelvieryDate, setChangedDelvieryDate] =
    useState(initialDelvieryDate);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  // useEffect(() => {
  //   // const periodInWeeks = Number(skipCount.split('-')[1]);
  //   // const result = calcChangedSubscribeDeliveryDate(
  //   //   initialDelvieryDate,
  //   //   periodInWeeks,
  //   // );
  //   // // // console.log(initialDelvieryDate)
  //   // // // console.log(periodInWeeks)
  //   // setChangedDelvieryDate(result);
  // }, [skipCount]);

  // YYYY.MM.DD. -> YYYY-MM-DD
  function formatDateToDash(dateStr) {
    const cleanedDate = dateStr.replace(/\./g, '');

    const year = cleanedDate.slice(0, 4);
    const month = cleanedDate.slice(4, 6);
    const day = cleanedDate.slice(6, 8);

    return `${year}-${month}-${day}`;
  }

  function addDays(dateString, days) {
    const formattedDateString = dateString.replace(/\./g, '-').slice(0, -1);
    const date = new Date(formattedDateString);
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}.`;
  }

  const onSubmit = async (confirm) => {
    if (submitted) return console.error('이미 제출된 양식입니다.');
    if (!confirm) {
      return setActiveConfirmModal(false);
    }

    // const selectedSkipCount = Number(skipCount.split('-')[1]);
    // const skipType =
    // selectedSkipCount === 1 ? subscribeSkipType.WEEK : subscribeSkipType.ONCE; // 건너뛰기 타입
    const skipType =
      isActive === 'week' ? subscribeSkipType.WEEK : subscribeSkipType.ONCE;

    console.log(skipType, subscribeId);

    const body = {
      id: Number(subscribeId),
      type: skipType,
    };

    try {
      setIsLoading(true);
      setSubmitted(true);
      const url = `/api/subscribes/${subscribeId}/skip/week`;
      const res = await postObjData(url, body);
      console.log(res);
      if (res.isDone) {
        mct.alertShow(
          '구독 건너뛰기가 적용되었습니다.',
          onSuccessChangeSubscribeOrder,
        );
      } else {
        mct.alertShow(`데이터 전송 실패\n${res.error}`);
        setSubmitted(false);
      }
      setActiveConfirmModal(false);
    } catch (err) {
      console.error('err: ', err);
    }
    setIsLoading(false);
  };

  const onSuccessChangeSubscribeOrder = () => {
    setIsLoading({ reload: true });
    mct.alertHide();
    window.location.reload();
  };

  const onPrevPage = () => {
    router.push('/mypage');
  };

  const skipSelectHandler = (item) => {
    setIsActive(item);

    if (item === 'week') {
      const delayedDate = addDays(
        formattedProductionAndReceivingDate(
          subscribeInfo?.subscribeDto.nextDeliveryDate,
        ).formattedReceivingDate,
        7, // 7days * 2 or 4wks
      );
      setSelectedDate(formatDateToDash(delayedDate));
    } else if (item === 'once') {
      const delayedDate = addDays(
        formattedProductionAndReceivingDate(
          subscribeInfo?.subscribeDto.nextDeliveryDate,
        ).formattedReceivingDate,
        7 * curPlanWeeklyPaymentCycle, // 7days * 2or4wks
      );
      setSelectedDate(formatDateToDash(delayedDate));
    }
  };

  //* 건너뛰기 버튼 클릭
  const onSkipHandler = () => {
    if (!isActive) {
      return alert('미루기 항목을 선택해주세요.');
    }

    setActiveConfirmModal(true);
  };

  useEffect(() => {
    const today = new Date();
    const nextDay = new Date(
      formattedProductionAndReceivingDate(
        subscribeInfo?.subscribeDto.nextDeliveryDate,
      ).formattedProductionDate,
    );

    if (nextDay >= today) {
      setIsAvailable(true);
    }
  }, []);

  console.log(selectedDate);
  console.log('isActive___', isActive);

  return (
    <>
      <MetaTitle title="마이페이지 배송 미루기" />
      <LayoutWithoutFooter>
        <Wrapper>
          <MypageWrapper>
            <header>
              <div className={s.prev_btn} style={{ cursor: 'pointer' }}>
                <Image
                  src={'/img/order/left_arrow.svg'}
                  alt="left_arrow"
                  width={24}
                  height={24}
                  onClick={onPrevPage}
                />
              </div>
            </header>
            <section className={s.title_delivery_skip}>
              <div className={s.title_text}>배송 미루기</div>
              <div className={s.title_info}>
                <span>{dogName}(이)의 현재 생산·배송 일정</span>
              </div>
            </section>
            <section className={s.title_delivery_skip_content}>
              <div className={`${s.content_inner_box4}`}>
                <div className={s.text}>
                  생산 예정일:{' '}
                  {
                    formattedProductionAndReceivingDate(
                      subscribeInfo?.subscribeDto.nextDeliveryDate,
                    ).formattedProductionDate
                  }
                  <br />
                  수령 예정일:{' '}
                  {
                    formattedProductionAndReceivingDate(
                      subscribeInfo?.subscribeDto.nextDeliveryDate,
                    ).formattedReceivingDate
                  }
                </div>

                {/* <div className={s.radio_box}>
                  <CustomRadio
                    className={`${s['customRadio-weeklySkipCount']}`}
                    name="weeklySkipCount"
                    idList={inputIdList}
                    labelList={inputLabelList}
                    value={skipCount}
                    setValue={setSkipCount}
                    getDirValue
                  />
                </div> */}

                <div className={s.skip_list_wrapper}>
                  <div
                    className={`${s.skip_box} ${
                      isActive === 'week' ? s.active : ''
                    }`}
                    onClick={() => skipSelectHandler('week')}
                  >
                    <h4>1주 미루기</h4>
                    <div className={s.skip_content}>
                      <div>
                        생산 예정일
                        <br />
                        {addDays(
                          formattedProductionAndReceivingDate(
                            subscribeInfo?.subscribeDto.nextDeliveryDate,
                          ).formattedProductionDate,
                          7,
                        )}
                      </div>
                      <div>
                        수령 예정일 <br />
                        {addDays(
                          formattedProductionAndReceivingDate(
                            subscribeInfo?.subscribeDto.nextDeliveryDate,
                          ).formattedReceivingDate,
                          7,
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${s.skip_box} ${
                      isActive === 'once' ? s.active : ''
                    }`}
                    onClick={() => skipSelectHandler('once')}
                  >
                    <h4>1회 미루기</h4>
                    <div className={s.skip_content}>
                      <div>
                        생산 예정일
                        <br />
                        {addDays(
                          formattedProductionAndReceivingDate(
                            subscribeInfo?.subscribeDto.nextDeliveryDate,
                          ).formattedProductionDate,
                          7 * curPlanWeeklyPaymentCycle, // 7days * 2or4wks
                        )}
                      </div>
                      <div>
                        수령 예정일 <br />
                        {addDays(
                          formattedProductionAndReceivingDate(
                            subscribeInfo?.subscribeDto.nextDeliveryDate,
                          ).formattedReceivingDate,
                          7 * curPlanWeeklyPaymentCycle,
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedDate && (
                  <>
                    <div className={s.calendar_label}>수령 예정일</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateCalendar
                        value={dayjs(selectedDate)}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        readOnly
                        sx={{
                          '& .Mui-selected': {
                            backgroundColor: '#be1a21 !important', // 체크된 날짜의 배경색을 빨간색으로
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </>
                )}

                {/* 1. 다음 배송일(nextDeliveryDate)이 있는 경우 : 배송미루기 탭으로 이동 가능
                        -> 1) 정기구독 (다음 배송일 O, 다음 결제일 O)
                              - 다음 결제일(nextPaymentDate)이 있는 경우 
                        -> 2) 패키지 && 배송횟수 1 이상 (다음 배송일 O, 다음 결제일 X) */}

                {/* 2. 다음 배송일(nextDeliveryDate)이 없는 경우,
                       패키지이고, 남은 배송횟수 0
                      -> 마이페이지 스와이퍼에서 아예 배송미루기 버튼 없어, 페이지 이동 불가  */}

                {subscribeInfo?.subscribeDto.nextPaymentDate ? (
                  <div className={s.btn_box}>
                    {/* 1. 다음 결제일(nextPaymentDate)이 있다면 */}
                    {/* 해당 구독 생산 예정일 전(주문마감일) => '건너뛰기' 버튼 나타남 */}
                    {isAvailable ? (
                      <button
                        type={'button'}
                        className={s.btn}
                        onClick={onSkipHandler}
                      >
                        건너뛰기 적용하기
                      </button>
                    ) : (
                      <span className={'pointColor'}>
                        건너뛰기는 다음 결제 5일 전부터 가능합니다.
                      </span>
                    )}
                  </div>
                ) : (
                  <div className={s.btn_box}>
                    {/* 2. 다음 결제일(nextPaymentDate)이 없는 경우
                        -> 패키지 && 배송횟수 1 이상 */}

                    <button
                      type={'button'}
                      className={s.btn}
                      onClick={onSkipHandler}
                    >
                      건너뛰기 적용하기
                    </button>
                  </div>
                )}
              </div>
            </section>
          </MypageWrapper>
        </Wrapper>
      </LayoutWithoutFooter>

      {/* {isLoading.reload && <FullScreenLoading />} */}

      {activeConfirmModal && (
        <Modal_confirm
          // text={`${(() => {
          //   const selectedIndex = inputIdList.indexOf(skipCount);
          //   // const skipMethodName = inputLabelList.filter(
          //   //   (label, index) => index === selectedIndex,
          //   // )[0];
          //   const skipWeeklyCount = inputIdList[selectedIndex].split('-')[1];
          //   const labelName = isActive === 'once' ? `1회 미루기` : '1주 미루기';
          //   const skipMethodName =
          //     isActive === 'once' ? `1회(${curPlanWeeklyPaymentCycle})` : '1주';
          //   // return `건너뛰기는 되돌리기 불가능한 서비스입니다.\n정말 ${skipMethodName}(${skipWeeklyCount}주)를 적용하시겠습니까?`;
          //   //             return `${labelName}를 선택하셨습니다.
          //   // 구독 일정을 ${7 * curPlanWeeklyPaymentCycle}일 미뤄,
          //   // ${selectedDate}
          //   // 수령 예정입니다.

          //   // 이대로 변경하시겠습니까?`;

          //   return (
          //     <>
          //       <div>건너뛰기는 되돌리기 불가능한 서비스입니다.</div>
          //     </>
          //   );
          // })()}`}
          title={
            <>
              <strong>
                {isActive === 'once' ? `1회 미루기` : '1주 미루기'}
              </strong>
              를 선택하셨습니다.
            </>
          }
          text={
            <>
              <p>
                <br />
                구독 일정을{' '}
                {isActive === 'once'
                  ? curPlanWeeklyPaymentCycle + '주'
                  : '1주'}{' '}
                미뤄,
                <br />
                <span style={{ color: '#BE1A21' }}>{selectedDate}</span>
                <br />
                수령 예정입니다.
                <br />
                이대로 변경하시겠습니까?
              </p>
            </>
          }
          isConfirm={onSubmit}
          positionCenter
          height={'200px'}
          option={{ wordBreak: true }}
        />
      )}
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { subscribeId } = query;

  return { props: { subscribeId } };
}

function isAvailableSubscribeSkipping(nextPaymentDate) {
  // TEST : nextPaymentDate '2022-09-01T23:00:10.466'
  if (!nextPaymentDate) return false;
  const today = transformToday();
  const getDiffDate = getDiffDateNumber(nextPaymentDate, today);
  const availableSkipDate = 5;
  return getDiffDate <= availableSkipDate;
}
