import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import s from './dogInfo.module.scss';
import { useModalContext } from '/store/modal-context';
import PopupWrapper from '/src/components/popup/PopupWrapper';
import {
  PopupCloseButton,
  PopupCloseButton_typeX,
} from '/src/components/popup/PopupCloseButton';
import { getData, putObjData, getDataSSR } from '/src/pages/api/reqData';
import { FullScreenLoading } from '/src/components/atoms/FullScreenLoading';
import { transformBirthDay } from '/util/func/transformBirthDay';
import { transformPhoneNumber } from '/util/func/transformPhoneNumber';
import transformDate from '../../../../../util/func/transformDate';
import transformLocalCurrency from '../../../../../util/func/transformLocalCurrency';
import SurveyStep1 from '../../../../components/survey/SurveyStep1';
import SurveyStep2 from '../../../../components/survey/SurveyStep2';
import SurveyStep3 from '../../../../components/survey/SurveyStep3';
import Spinner from '../../../../components/atoms/Spinner';
import Modal_confirm from '../../../../components/modal/Modal_confirm';
import Modal_global_alert from '../../../../components/modal/Modal_global_alert';
import { validate } from '/util/func/validation/validation_survey';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_extraIntegerNumberZero from '/util/func/filter_extraIntegerNumberZero';
import filter_ints from '/util/func/filter_ints';
import filter_demicals from '/util/func/filter_demicals';

export default function Popup_DogDetailPage({ data, dogIdx }) {
  const getDogInfoApiUrl = `/api/dogs/${dogIdx}`;
  const apiDataQueryDog = 'dogDto';

  const mct = useModalContext();
  const router = useRouter();
  const hasAlert = mct.hasAlert;
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState({});
  const [formValues, setFormValues] = useState({});
  const [tempValues, setTempValues] = useState({});
  const [modalMessage, setModalMessage] = useState('');
  const [submitState, setSubmitState] = useState(null);

  // * ------ MEMBER ------ *
  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getDogInfoApiUrl);
        let initialValues = [];
        if (res.data[apiDataQueryDog]) {
          const DATA = res.data[apiDataQueryDog];

          console.log('DATA', DATA);

          // 다음 결제일 포맷변환 (0000년 0월 0일)
          const nextPaymentDate = new Date(DATA.nextPaymentDate);
          const year = nextPaymentDate.getFullYear();
          const month = (nextPaymentDate.getMonth() + 1)
            .toString()
            .padStart(2, '0');
          const day = nextPaymentDate.getDate().toString().padStart(2, '0');

          const formattedNextPaymentDate = `${year}-${month}-${day}`;

          initialValues = {
            id: DATA.id,
            address: {
              zipcode: DATA.address?.zipcode,
              city: DATA.address?.city,
              street: DATA.address?.street,
              detailAddress: DATA.address?.detailAddress,
            },
            phoneNumber: transformPhoneNumber(DATA.phoneNumber),
            birthday: transformBirthDay(DATA.memberBirthday),
            memberName: DATA.memberName,
            subscribeId: DATA.subscribeId,
            subscribeCount: DATA.subscribeCount,
            subscribeStatus: DATA.subscribeStatus,
            subscribeCount: DATA.subscribeCount,
            nextPaymentDate: DATA.nextPaymentDate && formattedNextPaymentDate,
            nextPaymentPrice: DATA.nextPaymentPrice,
            email: DATA.email,
            name: DATA.name,
            gender: DATA.gender,
            birth: DATA.birth,
            oldDog: DATA.oldDog,
            dogType: DATA.dogType,
            dogSize: DATA.dogSize,
            weight: DATA.weight,
            neutralization: true,
            activityLevel: DATA.activityLevel,
            walkingCountPerWeek: DATA.walkingCountPerWeek,
            walkingTimePerOneTime: DATA.walkingTimePerOneTime,
            dogStatus: DATA.dogStatus,
            snackCountLevel: DATA.snackCountLevel,
            inedibleFood: DATA.inedibleFood,
            inedibleFoodEtc: DATA.inedibleFoodEtc,
            recommendRecipeId: DATA.recommendRecipeId,
            oneMealRecommendGram: DATA.oneMealRecommendGram,
            caution: DATA.caution,
          };
        } else {
          alert('데이터를 가져올 수 없습니다.');
        }
        setFormValues(initialValues);
      } catch (err) {
        console.error(err);
        console.error(err.response);
        alert('데이터를 가져올 수 없습니다.');
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, [dogIdx]);

  const onInputChange = (e) => {
    const { value } = e.currentTarget;
    setTempValues((prevState) => ({
      ...prevState,
      // birthday: value,
      nextPaymentDate: value,
    }));
  };

  if (isLoading.fetching) {
    return <FullScreenLoading />;
  }

  // * ------ SURVEY ------ *

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;
    console.log('input', input);

    if (filteredType) {
      filteredValue = filter_emptyValue(value);
      if (filteredType.indexOf('number') >= 0) {
        filteredValue = filter_onlyNumber(filteredValue);
      }
      if (filteredType.indexOf('ints') >= 0) {
        filteredValue = filter_extraIntegerNumberZero(filteredValue);
        const thisFilteredType = filteredType
          .split(',')
          .filter((type) => type.indexOf('ints') >= 0)[0];
        const intNum = Number(thisFilteredType.split('-')[1]);
        filteredValue = intNum
          ? filter_ints(filteredValue, intNum)
          : filteredValue;
      }
      if (filteredType.indexOf('demicals') >= 0) {
        filteredValue = filter_extraIntegerNumberZero(filteredValue);
        const thisFilteredType = filteredType
          .split(',')
          .filter((type) => type.indexOf('demicals') >= 0)[0];
        const demicalNum = Number(thisFilteredType.split('-')[1]);
        filteredValue = demicalNum
          ? filter_demicals(filteredValue, demicalNum)
          : filteredValue;
      }
    }

    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  const onStartValidate = () => {
    if (submitState === true) return;
    const errObj = validate(formValues, 'ALL');
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) {
      let errorMessages = ['- 오류 안내 -\n'];
      let count = 0;
      for (const key in errObj) {
        const errorMessage = errObj[key];
        errorMessage && errorMessages.push(`${++count}. ${errorMessage}\n`);
      }
      onShowModal(errorMessages);
      setSubmitState(null);
      // - prevent to the Next step when validation failed
    } else {
      setActiveConfirmModal(true);
      setSubmitState('READY');
    }
  };

  // 다음 결제일 변경 버튼
  const onChangeNextPaymentDate = () => {
    // console.log('newNextPaymentDate', tempValues.nextPaymentDate);

    if (
      !tempValues.nextPaymentDate ||
      formValues.nextPaymentDate === tempValues.nextPaymentDate
    ) {
      alert('기존 구독 결제일과 동일합니다.');
    } else if (confirm('구독 결제일을 정말 변경하시겠습니까?')) {
      (async () => {
        try {
          const apiUrl = `/api/admin/nextPaymentDate/${formValues.subscribeId}`;
          const newNextPaymentDate = tempValues.nextPaymentDate;

          // 다음 결제일 포맷변환 (0000년 0월 0일)
          const match = newNextPaymentDate.match(/(\d{4})-(\d{2})-(\d{2})/);
          let yyyymmdd = '';
          if (match) {
            const year = match[1];
            const month = match[2];
            const day = match[3];
            yyyymmdd = `${year}${month}${day}`;
          } else {
            console.log('날짜 형식이 올바르지 않습니다.');
          }
          const data = {
            nextPaymentDate: yyyymmdd,
          };
          console.log('PUT 요청 !', data);
          const res = await putObjData(apiUrl, data);
          console.log(res);
          // const resData = res.data.data;
          if (res.isDone) {
            alert('구독 결제일 변경이 완료되었습니다.');
            setFormValues((prevState) => ({
              ...prevState,
              nextPaymentDate: newNextPaymentDate,
            }));
            setTempValues((prevState) => ({
              ...prevState,
              nextPaymentDate: null,
            }));
          }
        } catch (err) {
          console.error('API통신 오류 : ', err);
          onShowModal(
            'API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.',
          );
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000);
        }
      })();
    }
  };

  // 수정하기 버튼
  const onSubmit = async (confirm) => {
    if (!confirm || submitState === true) {
      return setActiveConfirmModal(false);
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      let modalMessage;
      const apiUrl = `/api/admin/update/dog/${dogIdx}`;
      const {
        phoneNumber,
        email,
        address,
        birthday,
        id,
        memberName,
        oneMealRecommendGram,
        ...dataToSend
      } = formValues;

      const res = await putObjData(apiUrl, dataToSend);

      console.log(res);
      const resData = res.data.data;

      if (res.isDone) {
        modalMessage = '설문조사가 성공적으로 수정되었습니다.';
        setSubmitState('UPDATED');
      } else if (resData?.errors?.length > 0) {
        const errorArr = resData?.errors || [];
        modalMessage = errorArr.map((err) => err.defaultMessage).join(', ');
        setSubmitState(false);
      } else {
        modalMessage = '내부 통신장애입니다. 잠시 후 다시 시도해주세요.';
        setSubmitState(false);
      }
      onShowModal(modalMessage);
      setActiveConfirmModal(false);
    } catch (err) {
      console.error('API통신 오류 : ', err);
      onShowModal('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }

    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const onFinishUpdateSurvey = () => {
    router.push('/bf-admin/dog');
    window.location.reload();
  };

  const onShowModal = (message) => {
    mct.alertShow();
    setModalMessage(message);
  };

  const onHideModal = () => {
    mct.alertHide();
    setModalMessage('');
  };

  console.log('formValues', formValues);

  return (
    <>
      <div id={s.popup}>
        <PopupWrapper style={{ width: 1000 }}>
          <header className={s.header}>
            <div className={s.row}>
              <div className={s.cont}>
                <h1 className={s['popup-title']}>반려견정보 조회</h1>
                <PopupCloseButton_typeX />
              </div>
            </div>
          </header>
          <main className={s.body}>
            <div className={s.row}>
              <section className={s.table}>
                <ul>
                  <li className={s['table-list']}>
                    <div className={s['t-header']}>
                      <h4 className={s.title}>회원 정보</h4>
                    </div>
                    <ul className={s['t-body']}>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>이름</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.memberName}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>생일</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>
                              {tempValues.birthday || formValues.birthday}
                            </span>
                            <span></span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>아이디</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.email}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>연락처</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.phoneNumber}</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']} ${s['fullWidth']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>주소</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.address?.street}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <br />

                  {/* ------ SUBSCRIBE------ */}
                  <li className={s['table-list']}>
                    <div className={s['t-header']}>
                      <h4 className={s.title}>구독 정보</h4>
                    </div>
                    <ul className={s['t-body']}>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>구독 상태</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>
                              {formValues.subscribeStatus === 'BEFORE_PAYMENT'
                                ? '결제 전'
                                : 'SUBSCRIBING'
                                ? '구독 중'
                                : 'SUBSCRIBE_PENDING'
                                ? '구독 보류'
                                : '관리자 구독'}
                            </span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>구독 회차</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.subscribeCount} 회</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>다음 결제일</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            {formValues.nextPaymentDate && (
                              <>
                                <span>
                                  <input
                                    type="date"
                                    value={
                                      tempValues.nextPaymentDate ||
                                      formValues.nextPaymentDate
                                    }
                                    onChange={onInputChange}
                                  />
                                </span>

                                <button
                                  className="admin_btn line point basic_s"
                                  onClick={() => {
                                    onChangeNextPaymentDate(
                                      formValues.nextPaymentDate,
                                    );
                                  }}
                                >
                                  변경
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>다음 결제 금액</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.nextPaymentPrice} 원</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']} ${s['fullWidth']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>추천 그램수</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.oneMealRecommendGram} g</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>

                  {/* ------ SURVEY ------ */}
                  {/* <div className={s['t-gram']}>
                    <h4 className={s.title}>추천 그램수 :</h4>
                    <div className={s.gram}></div>
                  </div> */}

                  <br />
                  <li>
                    <div className={s['t-header']}>
                      <h4 className={s.title}>반려견 정보</h4>
                    </div>
                    <div className={s['survey-page']}>
                      <SurveyStep1
                        formValues={formValues}
                        setFormValues={setFormValues}
                        onInputChangeHandler={onInputChangeHandler}
                      />
                      <SurveyStep2
                        formValues={formValues}
                        setFormValues={setFormValues}
                        onInputChangeHandler={onInputChangeHandler}
                      />
                      <SurveyStep3
                        formValues={formValues}
                        setFormValues={setFormValues}
                        onInputChangeHandler={onInputChangeHandler}
                      />
                      <div className={`${s['btn-section']} ${s['in-mypage']}`}>
                        <button
                          className={s.submit}
                          type={'button'}
                          onClick={onStartValidate}
                        >
                          {isLoading.submit ? (
                            <Spinner style={{ color: '#fff' }} />
                          ) : (
                            '수정하기'
                          )}
                        </button>
                      </div>
                      <section className={s['btn-section']}>
                        <PopupCloseButton />
                      </section>
                    </div>
                  </li>
                </ul>
              </section>
            </div>
          </main>
          {activeConfirmModal && (
            <Modal_confirm
              theme={'userPage'}
              isConfirm={onSubmit}
              positionCenter
              text={'반려견 정보를 수정하시겠습니까?'}
              caution={
                <>
                  구독 중인 반려견의 한 끼당 g수가 변경되면,
                  <br />
                  다음 예약 결제금액이 자동으로 변경됩니다
                </>
              }
            />
          )}
          {hasAlert && (
            <Modal_global_alert
              message={modalMessage}
              onClick={
                submitState === 'UPDATED' ? onFinishUpdateSurvey : onHideModal
              }
              background
            />
          )}
        </PopupWrapper>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const { id: dogIdx } = query;

  let isMyDog = true;

  const getOneDogInfoApiUrl = `/api/dogs/${dogIdx}`;
  const dogInfoRes = await getDataSSR(req, getOneDogInfoApiUrl);
  const data = dogInfoRes?.data || null;
  if (!data || !isMyDog) {
    return {
      props: { data: null },
    };
  } else {
    data.dogIdx = Number(dogIdx); // form submit 에 사용
  }

  return { props: { data, dogIdx } };
}
