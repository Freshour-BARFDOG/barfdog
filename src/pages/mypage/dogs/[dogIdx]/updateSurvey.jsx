import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import {FullScreenLoading, FullScreenRunningDog} from '/src/components/atoms/FullScreenLoading';
import SurveyStep1 from '/src/components/survey/SurveyStep1';
import SurveyStep2 from '/src/components/survey/SurveyStep2';
import SurveyStep3 from '/src/components/survey/SurveyStep3';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_extraIntegerNumberZero from '/util/func/filter_extraIntegerNumberZero';
import filter_ints from '/util/func/filter_ints';
import filter_demicals from '/util/func/filter_demicals';
import { dogActivityLevelType } from '/store/TYPE/dogActivityLevelType';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import {getDataSSR, putObjData} from '/src/pages/api/reqData';
import { useRouter } from 'next/router';
import { dogSizeType } from '/store/TYPE/dogSizeType';
import { dogPhysicalStatusType } from '/store/TYPE/dogPhysicalStatusType';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import {validate} from "/util/func/validation/validation_survey";
import {valid_hasFormErrors} from "/util/func/validation/validationPackage";
import Spinner from "/src/components/atoms/Spinner";
import Modal_confirm from "/src/components/modal/Modal_confirm";

export default function UpdateSurveyPage({ data }) {
  // console.log(data);
  const initialFormValues = {
    name: data.dogDto.name, // 강아지이름 str
    gender: data.dogDto.gender, // str TYPE
    birth: data.dogDto.birth, // str (YYYYMM)
    oldDog: data.dogDto.oldDog, // boolean
    dogSize: dogSizeType[data.dogDto.dogSize], // str TYPE
    dogType: data.dogDto.dogType, // str
    weight: data.dogDto.weight, // number
    neutralization: data.dogDto.neutralization, // boolean
    activityLevel: dogActivityLevelType[data.dogDto.activityLevel], // str TYPE
    walkingCountPerWeek: data.dogDto.walkingCountPerWeek, // number
    walkingTimePerOneTime: data.dogDto.walkingTimePerOneTime, // number
    dogStatus: dogPhysicalStatusType[data.dogDto.dogStatus], // str TYPE
    snackCountLevel: data.dogDto.snackCountLevel, // str TYPE
    inedibleFood: data.dogDto.inedibleFood, // str: 못 먹는 음식 [없으면 'NONE', 기타일 경우 'ETC']
    inedibleFoodEtc: data.dogDto.inedibleFoodEtc, // str:기타('ETC') 일 경우 못 먹는 음식 입력 [없으면 'NONE']
    recommendRecipeId: data.dogDto.recommendRecipeId, // number
    caution: data.dogDto.caution, // 기타 특이사항 [없으면 'NONE']
  };

  // ! 못먹는음식 => 기타 & 직접입력란에 미리 입력되도록
  // ! 기타 특이사항 => 직접입력란에 미리 입력된것 && 있어요 checked

  const loadingDuration = 1200; // ms
  const router = useRouter();
  const mct = useModalContext();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isLoading, setIsLoading] = useState({}); // obj
  const [modalMessage, setModalMessage] = useState('');
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);
  const [submitState, setSubmitState] = useState(null);
  
  useEffect( () => {
    setIsLoading(() => ({ animation : true }));
    setTimeout(() => setIsLoading(() => ({ animation: false })), loadingDuration);
  }, [] );
  
  
  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;
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
        filteredValue = intNum ? filter_ints(filteredValue, intNum) : filteredValue;
      }
      if (filteredType.indexOf('demicals') >= 0) {
        filteredValue = filter_extraIntegerNumberZero(filteredValue);
        const thisFilteredType = filteredType
          .split(',')
          .filter((type) => type.indexOf('demicals') >= 0)[0];
        const demicalNum = Number(thisFilteredType.split('-')[1]);
        filteredValue = demicalNum ? filter_demicals(filteredValue, demicalNum) : filteredValue;
      }
    }

    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };
  
  const onStartValidate = ()=>{
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
      setActiveConfirmModal(true)
      setSubmitState('READY');
    }
  
  }

  const onSubmit = async (confirm) => {
    console.log(confirm)
    if (!confirm || submitState === true) {
      return setActiveConfirmModal(false)
    }
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      let modalMessage;
      const apiUrl = `/api/dogs/${data.dogIdx}`;
      const res = await putObjData(apiUrl, formValues);
      console.log(res);
      if (res.isDone) {
        modalMessage = '설문조사가 성공적으로 수정되었습니다.';
        onShowModal(modalMessage);
        setTimeout(()=>{
          window.location.reload();
        }, 1000);
        setIsLoading({reload:true});
        console.log(res.data.data)
        // const slicedReportApiLink = res.data.data._links.query_surveyReport.href.split('/');
        // const linkLength = slicedReportApiLink.length;
        // const endPoint = slicedReportApiLink[linkLength - 1];
        // const surveyReportsId = endPoint;
        // const curPath = router.pathname;
        // await router.push(`${curPath}?surveyReportsId=${surveyReportsId}`);

      } else {
        modalMessage = '내부 통신장애입니다. 잠시 후 다시 시도해주세요.';
        onShowModal(modalMessage);
        setSubmitState(false);
      }
      setActiveConfirmModal(false)
    } catch (err) {
      console.error('API통신 오류 : ', err);
      onShowModal('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
      // setTimeout(()=>{
      //   window.location.reload();
      // }, 1000);
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

  useEffect(() => {
    if (!data && window && typeof window !== 'undefined') {
      window.location.href = '/mypage/dogs';
    }
  }, [data]);
  
  
  // ANIMATION
  if(isLoading.animation){
    return <FullScreenRunningDog opacity={1} />
  }

  if(isLoading.reload){
    return <FullScreenLoading opacity={0.5}/>
  }
  
  return (
    <>
      <MetaTitle title="설문조사 수정하기" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
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
                <button className={s.submit} type={'button'} onClick={onStartValidate}>
                  {isLoading.submit ? <Spinner style={{color:'#fff'}}/> : '수정하기'}
                </button>
              </div>
            </div>
          </MypageWrapper>
        </Wrapper>
      </Layout>
      {activeConfirmModal && (
        <Modal_confirm
          theme={'userPage'}
          isConfirm={onSubmit}
          positionCenter
          text={'반려견 정보를 수정하시겠습니까?\n정기구독 중인 결제금액이 변동될 수 있습니다.'}
        />
      )}
      <Modal_global_alert message={modalMessage} onClick={onHideModal} background />
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const { dogIdx } = query;
  console.log(dogIdx)

  const getDogInfoApiUrl = `/api/dogs/${dogIdx}`;
  const dogInfoRes = await getDataSSR(req, getDogInfoApiUrl);
  const data = dogInfoRes.data || null;
  
  if (!data) {
    return {
      redirect: {
        permanent: false,
        destination: '/mypage/dogs',
      },
      props: { data: null },
    };
  }else {
    data.dogIdx = Number(dogIdx); // form submit 에 사용
  }

  return { props: { data } };
}
