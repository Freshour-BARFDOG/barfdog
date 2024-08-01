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

export default function SubscribeSkipPage({ subscribeId }) {
  const router = useRouter();
  const [subscribeInfo, setSubscribeInfo] = useState();
  const [dogName, setDogName] = useState('');

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

  useEffect(() => {
    // const periodInWeeks = Number(skipCount.split('-')[1]);
    // const result = calcChangedSubscribeDeliveryDate(
    //   initialDelvieryDate,
    //   periodInWeeks,
    // );
    // // // console.log(initialDelvieryDate)
    // // // console.log(periodInWeeks)
    // setChangedDelvieryDate(result);
  }, [skipCount]);

  const onSubmit = async (confirm) => {
    if (submitted) return console.error('이미 제출된 양식입니다.');
    if (!confirm) {
      return setActiveConfirmModal(false);
    }

    const selectedSkipCount = Number(skipCount.split('-')[1]);
    const skipType =
      selectedSkipCount === 1 ? subscribeSkipType.WEEK : subscribeSkipType.ONCE; // 건너뛰기 타입

    const body = {
      id: subscribeInfo.info.subscribeId,
      type: skipType,
    };

    try {
      setIsLoading(true);
      setSubmitted(true);
      const url = `/api/subscribes/${subscribeInfo.info.subscribeId}/skip/${skipType}`;
      const res = await postObjData(url, body);
      // console.log(res);
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
  };

  console.log(skipCount);

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
            <section>
              <div className={`${s.content_inner_box4}`}>
                <div className={s.text}>
                  생산 예정일: 2024.00.00.
                  <br />
                  수령 예정일: 2024.00.00.
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
                        2024.01.01.
                      </div>
                      <div>
                        수령 예정일 <br />
                        2024.01.01.
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
                        2024.01.01.
                      </div>
                      <div>
                        수령 예정일 <br />
                        2024.01.01.
                      </div>
                    </div>
                  </div>
                </div>

                {/* <p className={s.d_day_text}>
                  기존 발송 예정일은
                  <span>
                    {transformDate(initialDelvieryDate, '월일') || '정보없음'}
                  </span>
                  입니다
                </p>
                <p className={s.d_day_text2}>
                  변경 발송 예정일은
                  <span className={s.red_span}>
                    {transformDate(changedDelvieryDate, '월일')}
                  </span>
                  입니다
                </p> */}

                {/* <div className={s.picture_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority={false}
                      src={require('public/img/mypage/delivery_schedule.png')}
                      objectFit="cover"
                      layout="fill"
                      alt="배송 안내 이미지"
                    />
                  </div>
                </div> */}

                <div className={s.btn_box}>
                  {/*  오늘과 다음 결제예정일 비교 ==> 5일 이내일 경우 구독 버튼 나타남 */}
                  {isAvailableSubscribeSkipping(
                    subscribeInfo?.subscribeDto.nextPaymentDate,
                  ) ? (
                    <button
                      type={'button'}
                      className={s.btn}
                      onClick={() => {
                        setActiveConfirmModal(true);
                      }}
                    >
                      건너뛰기 적용하기
                    </button>
                  ) : (
                    <span className={'pointColor'}>
                      건너뛰기는 다음 결제 5일 전부터 가능합니다.
                    </span>
                  )}
                </div>
              </div>
            </section>
          </MypageWrapper>
        </Wrapper>
      </LayoutWithoutFooter>

      {/* {isLoading.reload && <FullScreenLoading />} */}

      {activeConfirmModal && (
        <Modal_confirm
          text={`${(() => {
            const selectedIndex = inputIdList.indexOf(skipCount);
            const skipMethodName = inputLabelList.filter(
              (label, index) => index === selectedIndex,
            )[0];
            const skipWeeklyCount = inputIdList[selectedIndex].split('-')[1];
            return `건너뛰기는 되돌리기 불가능한 서비스입니다.\n정말 ${skipMethodName}(${skipWeeklyCount}주)를 적용하시겠습니까?`;
          })()}`}
          isConfirm={onSubmit}
          positionCenter
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
