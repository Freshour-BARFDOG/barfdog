import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import LayoutWithoutFooter from '/src/components/common/LayoutWithoutFooter';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import {
  FullScreenLoading,
  FullScreenRunningDog,
} from '/src/components/atoms/FullScreenLoading';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_extraIntegerNumberZero from '/util/func/filter_extraIntegerNumberZero';
import filter_ints from '/util/func/filter_ints';
import filter_demicals from '/util/func/filter_demicals';
import { dogActivityLevelType } from '/store/TYPE/dogActivityLevelType';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import { getDataSSR, putObjData } from '/src/pages/api/reqData';
import { useRouter } from 'next/router';
import { dogSizeType } from '/store/TYPE/dogSizeType';
import { dogPhysicalStatusType } from '/store/TYPE/dogPhysicalStatusType';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import { validate } from '/util/func/validation/validation_survey';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import Spinner from '/src/components/atoms/Spinner';
import Modal_confirm from '/src/components/modal/Modal_confirm';
import SurveyStep1 from '/src/components/survey/step/SurveyStep1';
import SurveyStep2 from '/src/components/survey/step/SurveyStep2';
import SurveyStep3 from '/src/components/survey/step/SurveyStep3';
import SurveyStep4 from '/src/components/survey/step/SurveyStep4';
import SurveyStep5 from '/src/components/survey/step/SurveyStep5';
import SurveyStep6 from '/src/components/survey/step/SurveyStep6';
import SurveyStep7 from '/src/components/survey/step/SurveyStep7';
import SurveyStep8 from '/src/components/survey/step/SurveyStep8';
import SurveyStep9 from '/src/components/survey/step/SurveyStep9';
import SurveyStep10 from '/src/components/survey/step/SurveyStep10';
import SurveyStep11 from '/src/components/survey/step/SurveyStep11';
import SurveyStep12 from '/src/components/survey/step/SurveyStep12';
import SurveyStep13 from '/src/components/survey/step/SurveyStep13';
import SurveyStep14 from '/src/components/survey/step/SurveyStep14';
import SurveyStep15 from '/src/components/survey/step/SurveyStep15';
import SurveyStep16 from '/src/components/survey/step/SurveyStep16';
import SurveyStep17 from '/src/components/survey/step/SurveyStep17';
import Image from 'next/image';

export default function UpdateSurveyPage({ data }) {
  // ! [기존]
  // const initialFormValues = {
  //   name: data.dogDto.name, // 강아지이름 str
  //   gender: data.dogDto.gender, // str TYPE
  //   birth: data.dogDto.birth, // str (YYYYMM)
  //   oldDog: data.dogDto.oldDog, // boolean
  //   dogSize: dogSizeType[data.dogDto.dogSize], // str TYPE
  //   dogType: data.dogDto.dogType, // str
  //   weight: data.dogDto.weight, // number
  //   neutralization: data.dogDto.neutralization, // boolean
  //   activityLevel: dogActivityLevelType[data.dogDto.activityLevel], // str TYPE
  //   walkingCountPerWeek: data.dogDto.walkingCountPerWeek, // number
  //   walkingTimePerOneTime: data.dogDto.walkingTimePerOneTime, // number
  //   dogStatus: dogPhysicalStatusType[data.dogDto.dogStatus], // str TYPE
  //   snackCountLevel: data.dogDto.snackCountLevel, // str TYPE
  //   inedibleFood: data.dogDto.inedibleFood, // str: 못 먹는 음식 [없으면 'NONE', 기타일 경우 'ETC']
  //   inedibleFoodEtc: data.dogDto.inedibleFoodEtc, // str:기타('ETC') 일 경우 못 먹는 음식 입력 [없으면 'NONE']
  //   recommendRecipeId: data.dogDto.recommendRecipeId, // number
  //   caution: data.dogDto.caution, // 기타 특이사항 [없으면 'NONE']
  // };

  const initialFormValues = [
    {
      name: data.dogDto.name, // 강아지이름 str
      gender: data.dogDto.gender, // 강아지 성별 str
      neutralization: data.dogDto.neutralization, // 중성화여부 Boolean
      dogSize: dogSizeType[data.dogDto.dogSize], // 강아지 체급 str
      dogType: data.dogDto.dogType, // 강아지 종 str
      birth: data.dogDto.birth, //! [변경] 강아지 생월 str // [YYYYMMDD]
      oldDog: data.dogDto.oldDog, // 노견 여부 boolean (checkbox type)
      weight: data.dogDto.weight, // 강아지 몸무게 str // 몸무게 소수점 아래 1자리
      dogStatus: data.dogDto.dogStatus, //! [변경] 강아지 상태 [HEALTHY, NEED_DIET, OBESITY, THIN]
      specificDogStatus: data.dogDto.specificDogStatus, //! [추가]  특별한 상태
      specificDogStatusEtc: data.dogDto.specificDogStatusEtc, //! [추가]  특별한 상태
      // [PREGNANT_EARLY, PREGNANT_LATE,
      // LACTATING_ONE_TO_TWO, LACTATING_THREE_TO_FOUR, LACTATING_FIVE_TO_SIX, LACTATING_OVER_SEVEN,
      // NULL] 해당 사항이 없다면 NULL
      expectedPregnancyDay: data.dogDto.expectedPregnancyDay, //! [추가] 임신예상일 str // [YYYYMMDD]
      activityLevel: data.dogDto.activityLevel, // 활동량 레벨 str [VERY_LITTLE, LITTLE, NORMAL, MUCH, VERY_MUCH]
      walkingCountPerWeek: data.dogDto.walkingCountPerWeek, // 주당 산책 횟수 string
      walkingTimePerOneTime: data.dogDto.walkingTimePerOneTime, // 한 번 산책할 때 산책 시간 string
      snackCountLevel: data.dogDto.snackCountLevel, //  간식먹는 정도 str
      waterCountLevel: data.dogDto.waterCountLevel, //! [추가] 음수량 str [LITTLE, NORMAL, MUCH]
      supplement: data.dogDto.supplement,
      supplementEtc: data.dogDto.supplementEtc,
      currentMeal: data.dogDto.currentMeal,
      inedibleFood: data.dogDto.inedibleFood, // 못 먹는 음식 str => get API 리스트 // 빈값('')일 경우, '있어요'선택됨)
      inedibleFoodEtc: data.dogDto.inedibleFoodEtc, // 못 먹는 음식 > '기타' 일경우
      caution: data.dogDto.caution, // 기타 특이사항 // 빈값('')일 경우, '있어요'선택됨)
      // caution: dogCautionType.NONE, // 기타 특이사항 // 빈값('')일 경우, '있어요'선택됨)
      cautionEtc: data.dogDto.cautionEtc,
      newToRawDiet: data.dogDto.newToRawDiet, //! [추가] 생식처음
      recommendRecipeId: data.dogDto.recommendRecipeId, // 특별히 챙겨주고 싶은 부분에 해당하는 Recipe => get API 리스트
      priorityConcerns: data.dogDto.priorityConcerns,
    },
  ];

  const loadingDuration = 1200; // ms
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isLoading, setIsLoading] = useState({});
  const [modalMessage, setModalMessage] = useState('');
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);
  const [submitState, setSubmitState] = useState(null);
  const [isChangedOneMealRecommendGram, setIsChangedOneMealRecommendGram] =
    useState(false);
  const [isActiveNextBtn, setIsActiveNextBtn] = useState(false);

  // 유효성 검사
  const [errorInfo, setErrorInfo] = useState({
    errorIndex: null,
    errorMessage: '',
  });

  useEffect(() => {
    if (!data && window && typeof window !== 'undefined') {
      window.location.href = '/mypage';
    }
  }, [data]);

  useEffect(() => {
    setIsLoading(() => ({ animation: true }));
    setTimeout(
      () => setIsLoading(() => ({ animation: false })),
      loadingDuration,
    );
  }, []);

  const validationIndexWithKey = [
    { swiperIndex: 1, key: 'name' },
    {
      swiperIndex: 2,
      key: 'gender',
    },
    { swiperIndex: 4, key: 'dogSize' },
    { swiperIndex: 4, key: 'dogType' },
    { swiperIndex: 5, key: 'birth' },
    { swiperIndex: 6, key: 'weight' },
    { swiperIndex: 9, key: 'walkingCountPerWeek' },
    { swiperIndex: 9, key: 'walkingTimePerOneTime' },
    { swiperIndex: 12, key: 'supplement' },
    { swiperIndex: 13, key: 'currentMeal' },
    { swiperIndex: 14, key: 'inedibleFood' },
    { swiperIndex: 17, key: 'priorityConcerns' },
  ];

  //*** 값 입력 ***//
  const onInputChangeHandler = (e, index, formValueKey) => {
    const input = e.currentTarget;
    const { id, value } = input;

    const filteredType = input.dataset.inputType;
    let filteredValue = value;

    // string -> boolean
    if (filteredValue === 'true') {
      filteredValue = true;
    } else if (filteredValue === 'false') {
      filteredValue = false;
    }

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

    if (Array.isArray(formValues)) {
      const newFormValues = formValues.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            [id]:
              formValueKey === 'recommendRecipeId'
                ? Number(filteredValue)
                : filteredValue,
          };
        }
        return item;
      });
      setFormValues(newFormValues);
    }

    //////////////////////////////

    //*** 값 입력할 때마다 에러메세지 ***/

    // 이름 중복 확인
    const isDuplicateName = formValues.some(
      (item, idx) => idx !== index && item.name === value,
    );

    // 중복된 이름이 있으면 에러 메시지 설정
    if (isDuplicateName) {
      setErrorInfo({
        errorIndex: index,
        errorMessage: '이름이 중복됩니다.',
      });
      setIsActiveNextBtn(false);
    } else if (!value) {
      setErrorInfo({
        errorIndex: index,
        errorMessage: '필수 항목입니다.',
      });
      setIsActiveNextBtn(false);
    } else if (value === 'YES') {
      setErrorInfo({
        errorIndex: index,
        errorMessage: '필수 항목입니다.',
      });
      setIsActiveNextBtn(false);
    } else {
      setErrorInfo({
        errorIndex: null,
        errorMessage: '',
      });
      setIsActiveNextBtn(true);
    }
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

  const onSubmit = async (confirm) => {
    if (!confirm || submitState === true) {
      return setActiveConfirmModal(false);
    }

    console.log(formValues);

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      let modalMessage;
      const apiUrl = `/api/dogs/${data.dogIdx}`;
      const res = await putObjData(apiUrl, formValues[0]);
      // console.log(res);
      const resData = res.data.data;

      if (res.isDone) {
        modalMessage = '설문조사가 성공적으로 수정되었습니다.'; // 추천그램수 변경여부와 관계없이 설문조사 성공
        const beforeOneMealRecommendGram = data.dogDto.oneMealRecommendGram;
        const afterOneMealRecommendGram = resData.oneMealRecommendGram;
        const isChangedOneMealRecommendGram =
          beforeOneMealRecommendGram !== afterOneMealRecommendGram;
        setIsChangedOneMealRecommendGram(isChangedOneMealRecommendGram); // 추천그램수 변경되지 않음
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

  const onHideModal = () => {
    mct.alertHide();
    setModalMessage('');
  };

  const onShowModal = (message) => {
    mct.alertShow();
    setModalMessage(message);
  };

  const onRedirectByChangingOneMealRecommendGram = (confirm) => {
    if (confirm) {
      setIsLoading({ redir: true });
      const dogId = data.dogIdx;
      window.location.href = `/order/subscribeShop?dogId=${dogId}`;
    } else {
      // console.log('추천그램수 변경되고, 취소')
      setIsChangedOneMealRecommendGram(false);
      onFinishUpdateSurvey();
    }
  };

  const onFinishUpdateSurvey = () => {
    window.location.reload();
  };

  // ANIMATION
  if (isLoading.animation) {
    return <FullScreenRunningDog opacity={1} />;
  }

  if (isLoading.reload) {
    return <FullScreenLoading opacity={0.5} />;
  }

  const onPrevPage = () => {
    router.push('/mypage');
  };

  return (
    <>
      <MetaTitle title="설문조사 수정하기" />
      <LayoutWithoutFooter>
        <Wrapper>
          <MypageWrapper>
            <div className={s['survey-page']}>
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
              <div className={s.dog_title_update}>반려견 정보</div>

              {/* 1. 견명 */}
              <SurveyStep1
                setErrorInfo={setErrorInfo}
                errorInfo={errorInfo}
                formValues={formValues}
                setFormValues={setFormValues}
                onInputChangeHandler={onInputChangeHandler}
                setIsActiveNextBtn={setIsActiveNextBtn}
                mode={'update'}
              />
              <div className={s.empty_box_big}></div>

              {/* 2. 성별 */}
              <SurveyStep2
                errorInfo={errorInfo}
                formValues={formValues}
                setFormValues={setFormValues}
                onInputChangeHandler={onInputChangeHandler}
              />
              <div className={s.empty_box_middle}></div>

              {/* 3. 중성화 여부 */}
              <SurveyStep3
                errorInfo={errorInfo}
                formValues={formValues}
                setFormValues={setFormValues}
                onInputChangeHandler={onInputChangeHandler}
              />
              <div className={s.empty_box_middle}></div>

              {/* 4. 사이즈, 견종  */}
              <SurveyStep4
                errorInfo={errorInfo}
                formValues={formValues}
                setFormValues={setFormValues}
                setIsActiveNextBtn={setIsActiveNextBtn}
                onInputChangeHandler={onInputChangeHandler}
                mode={'update'}
              />

              {/* 5. 생일 */}
              <SurveyStep5
                errorInfo={errorInfo}
                formValues={formValues}
                setFormValues={setFormValues}
                onInputChangeHandler={onInputChangeHandler}
                setIsActiveNextBtn={setIsActiveNextBtn}
                mode={'update'}
              />
              <div className={s.empty_box_big}></div>

              {/* 6. 몸무게 */}
              <SurveyStep6
                errorInfo={errorInfo}
                formValues={formValues}
                setFormValues={setFormValues}
                onInputChangeHandler={onInputChangeHandler}
              />

              {/* 7. 상태 */}
              <SurveyStep7
                formValues={formValues}
                setFormValues={setFormValues}
                setIsActiveNextBtn={setIsActiveNextBtn}
                onInputChangeHandler={onInputChangeHandler}
              />
              <div className={s.empty_box_big}></div>

              {/* 8. 활동량  */}
              <SurveyStep8
                formValues={formValues}
                setFormValues={setFormValues}
                onInputChangeHandler={onInputChangeHandler}
              />
              <div className={s.empty_box_big}></div>

              {/* 9. 산책량  */}
              <SurveyStep9
                errorInfo={errorInfo}
                formValues={formValues}
                setFormValues={setFormValues}
                onInputChangeHandler={onInputChangeHandler}
                setIsActiveNextBtn={setIsActiveNextBtn}
                mode={'update'}
              />
              {/* <div className={s.empty_box_big}></div> */}

              {/* 10. 간식량 */}
              <SurveyStep10
                formValues={formValues}
                setFormValues={setFormValues}
                onInputChangeHandler={onInputChangeHandler}
              />
              <div className={s.empty_box_big}></div>

              {/* 11. 음수량   */}
              <SurveyStep11
                formValues={formValues}
                setFormValues={setFormValues}
                onInputChangeHandler={onInputChangeHandler}
              />
              <div className={s.empty_box_big}></div>

              {/* 12. 영양제  */}
              <SurveyStep12
                errorInfo={errorInfo}
                formValues={formValues}
                setFormValues={setFormValues}
                onInputChangeHandler={onInputChangeHandler}
                setIsActiveNextBtn={setIsActiveNextBtn}
                mode={'update'}
              />
              <div className={s.empty_box_big}></div>

              {/* 13. 현재 식사  */}
              <SurveyStep13
                errorInfo={errorInfo}
                formValues={formValues}
                setFormValues={setFormValues}
                setIsActiveNextBtn={setIsActiveNextBtn}
                onInputChangeHandler={onInputChangeHandler}
              />
              <div className={s.empty_box_big}></div>

              {/* 14. 못먹는 재료 */}
              <SurveyStep14
                formValues={formValues}
                setFormValues={setFormValues}
                setIsActiveNextBtn={setIsActiveNextBtn}
                onInputChangeHandler={onInputChangeHandler}
                mode={'update'}
              />
              <div className={s.empty_box_big}></div>

              {/* 15. 건강적 특이사항, 질병   */}
              <SurveyStep15
                formValues={formValues}
                setFormValues={setFormValues}
                setIsActiveNextBtn={setIsActiveNextBtn}
                onInputChangeHandler={onInputChangeHandler}
                mode={'update'}
              />
              <div className={s.empty_box_big}></div>

              {/* 16. 생식 처음*/}
              <SurveyStep16
                formValues={formValues}
                setFormValues={setFormValues}
                setIsActiveNextBtn={setIsActiveNextBtn}
                onInputChangeHandler={onInputChangeHandler}
              />
              <div className={s.empty_box_big}></div>

              {/* 17. 특별히 챙겨주고 싶은 것  */}
              <SurveyStep17
                errorInfo={errorInfo}
                formValues={formValues}
                setFormValues={setFormValues}
                setIsActiveNextBtn={setIsActiveNextBtn}
                onInputChangeHandler={onInputChangeHandler}
              />

              {/* ! [삭제예정] */}
              {/* <SurveyBundleStep1
                formValues={formValues}
                setFormValues={setFormValues}
                onInputChangeHandler={onInputChangeHandler}
              />
              <SurveyBundleStep2
                formValues={formValues}
                setFormValues={setFormValues}
                onInputChangeHandler={onInputChangeHandler}
              />
              <SurveyBundleStep3
                formValues={formValues}
                setFormValues={setFormValues}
                onInputChangeHandler={onInputChangeHandler}
              /> */}

              <div className={`${s['btn-section']} ${s['in-mypage']}`}>
                <button
                  className={`${isActiveNextBtn ? s.activated : ''} ${
                    s.submit_btn
                  }`}
                  disabled={!isActiveNextBtn}
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
            </div>
          </MypageWrapper>
        </Wrapper>
      </LayoutWithoutFooter>
      {activeConfirmModal && (
        <Modal_confirm
          theme={'userPage'}
          isConfirm={onSubmit}
          positionCenter
          text={'반려견 정보를 수정하시겠습니까?'}
        />
      )}
      {hasAlert && !isChangedOneMealRecommendGram && (
        <Modal_global_alert
          message={modalMessage}
          onClick={
            submitState === 'UPDATED' ? onFinishUpdateSurvey : onHideModal
          }
          background
        />
      )}
      {isChangedOneMealRecommendGram && (
        <Modal_confirm
          theme={'userPage'}
          isConfirm={onRedirectByChangingOneMealRecommendGram}
          positionCenter
          text={
            '추천 그램수 변경내역이 존재합니다.\n맞춤플랜을 확인하러 가시겠습니까?'
          }
        />
      )}
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const { dogIdx } = query;

  let isMyDog = true;
  const getAllDogsApiUrl = '/api/dogs';
  const allDogRes = await getDataSSR(req, getAllDogsApiUrl);
  if (allDogRes.data) {
    const allDogIds =
      allDogRes.data._embedded.queryDogsDtoList.map((data) =>
        data.id.toString(),
      ) || [];
    isMyDog = allDogIds.indexOf(dogIdx) >= 0;
    // console.log('allDogIds: ',allDogIds);
  }

  const getOneDogInfoApiUrl = `/api/dogs/${dogIdx}`;
  const dogInfoRes = await getDataSSR(req, getOneDogInfoApiUrl);
  const data = dogInfoRes.data || null;
  if (!data || !isMyDog) {
    return {
      redirect: {
        permanent: false,
        destination: '/mypage',
      },
      props: { data: null },
    };
  } else {
    data.dogIdx = Number(dogIdx); // form submit 에 사용
  }

  return { props: { data } };
}
