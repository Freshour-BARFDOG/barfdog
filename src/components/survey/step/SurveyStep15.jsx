import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyCustomRadioTrueOrFalse from '/src/components/survey/SurveyCustomRadioTrueOrFalse';
import SurveyInputMultipleSelectedEtc from '../SurveyInputMultipleSelectedEtc';
// import Modal_alert, { Modal_innerForm } from '../../modal/Modal_consult';
// import Modal_consult from '../../modal/Modal_consult';

export default function SurveyStep15({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
}) {
  let cautionIdList = [
    '관절염',
    '슬개골 탈구',
    '피부염',
    '당뇨병',
    '귀 염증',
    '눈물/안구',
    '치주염',
    '신장 질환',
    '간 질환',
    '췌장염',
    '심장 질환',
    'ETC',
  ];

  let cautionLabelList = [
    '관절염',
    '슬개골 탈구',
    '피부염',
    '당뇨병',
    '귀 염증',
    '눈물/안구',
    '치주염',
    '신장 질환',
    '간 질환',
    '췌장염',
    '심장 질환',
    '기타',
  ];

  const [activeIndexList, setActiveIndexList] = useState([]);
  const [modalMessage1, setModalMessage1] = useState('');
  const [modalMessage2, setModalMessage2] = useState('');
  const [modalMessage3, setModalMessage3] = useState('');
  const [isRejectStart, setRejectStart] = useState(false);

  // UI '짤림 현상'해결
  useEffect(() => {
    const swiperWrap = surveyPageRef.current;
    const slideWithDependencyElem = swiperWrap.querySelector(
      '.swiper-slide-active',
    );
    const activeSlideHeight = slideWithDependencyElem.offsetHeight;
    const targetSwiperElem = swiperWrap.querySelector('.swiper-wrapper');
    targetSwiperElem.style.height = rem(activeSlideHeight);
  }, [formValues]);

  const removeDiabetes = (index) => {
    setFormValues((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        if (idx === index) {
          const cautionArray = item.caution.split(',');
          const updatedCaution = cautionArray.filter((caution) => {
            return (
              caution.trim() !== '당뇨병' &&
              caution.trim() !== '신장 질환' &&
              caution.trim() !== '췌장염'
            );
          });
          const newCautionString = updatedCaution.join(',');
          return {
            ...item,
            caution: newCautionString,
          };
        }
        return item;
      });

      return newFormValues;
    });
  };

  const onShowRejectModal = () => {
    setRejectStart(true);
    setModalMessage1('관리가 필요한 질병입니다.');
    setModalMessage2('상담요청 후 급여여부가 판단되오니');
    setModalMessage3('상담창으로 이동합니다.');
  };

  const onHideModal = (index) => {
    setModalMessage1('');
    setModalMessage2('');
    setModalMessage3('');
    setRejectStart(false);
    removeDiabetes(index);
  };

  const onRejectHandler = () => {
    window.open('https://36o2x.channel.io/home', '_blank');
  };

  useEffect(() => {
    const hasDiabetes = formValues.some(
      (dog) =>
        dog.caution.includes('당뇨병') ||
        dog.caution.includes('췌장염') ||
        dog.caution.includes('신장 질환'),
    );
    if (hasDiabetes) {
      onShowRejectModal();
    }
  }, [formValues]);

  return (
    <section id="surveyPage" className={s.step14Page}>
      {formValues?.map((dog, index) => (
        <div key={index} className={s.status_container}>
          <div className={s.input_status_container}>
            <p className={s.input_title}>
              {dog.name} (이)의 건강적 특이사항, 질병 등이 있나요 ?
            </p>
            <p className={s.supplement_text}>
              * 질병이 있는 경우 <strong>필수</strong>로 체크해주세요! <br />
              질병에 따라 급여가 불가할 수 있습니다.
            </p>
            <div className={s.input_supplement_box}>
              <SurveyCustomRadioTrueOrFalse
                title="caution"
                value={dog.caution}
                setFormValues={setFormValues}
                theme={'letter-in-shape'}
                labelList={['있어요', '없어요']}
                onInputChangeHandler={onInputChangeHandler}
                dogInfo={dog}
                dogInfoIndex={index}
                setActiveIndexList={setActiveIndexList}
              />
            </div>

            {activeIndexList.includes(index) && (
              <div className={s.caution_select_container} key={index}>
                <SurveyInputMultipleSelectedEtc
                  formValueKey={'caution'}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  dogInfo={dog}
                  dogInfoIndex={index}
                  onInputChangeHandler={onInputChangeHandler}
                  className={s.dogStatus}
                  idList={cautionIdList}
                  labelList={cautionLabelList}
                  etcKey={'cautionEtc'}
                />
                {/* {isRejectStart && (
                  <Modal_consult
                    text1={modalMessage1}
                    text2={modalMessage2}
                    text3={modalMessage3}
                  >
                    <Modal_innerForm
                      onCancel={() => onHideModal(index)}
                      onConfirm={onRejectHandler}
                    ></Modal_innerForm>
                  </Modal_consult>
                )} */}

                {/* <div className={s.caution_text_box}>
                  <p className={s.caution_text}>
                    ⚠ 당뇨병, 신장 질환, 췌장염은 관리가 필요한 질병입니다.{' '}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;상담요청 후 급여여부가
                    판단되오니,{' '}
                    <a
                      href="https://36o2x.channel.io/home"
                      rel="noreferrer"
                      target="_blank"
                    >
                      문의하기
                    </a>
                    를 클릭해주세요.
                  </p>
                </div> */}
              </div>
            )}
          </div>
          {formValues.length >= 2 && index !== formValues.length - 1 && (
            <div className={s.input_line}></div>
          )}
        </div>
      ))}

      {/* //! [추가]
  // 당뇨병, 신장질환, 췌장염 :
  // 관리가 필요한 질병입니다. 상담요청 후 급여여부가 판단되오니 상담창으로 이동합니다. */}
    </section>
  );
}
