import s from '/src/pages/survey/survey.module.scss';
import SurveyInputRadio from './AdminSurveyInputRadio';
import React, { useEffect, useState } from 'react';
import { dogSnackCountLevelType } from '/store/TYPE/dogSnackCountLevelType';
import { dogInedibleFoodType } from '/store/TYPE/dogInedibleFoodType';
import { getData } from '../../pages/api/reqData';
import Spinner from '../atoms/Spinner';
import { useRouter } from 'next/router';
import { dogCautionType } from '/store/TYPE/dogCautionType';

export default function SurveyBundleStep3({
  formValues,
  setFormValues,
  onInputChangeHandler,
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState({});
  const [ingredientList, setIngredientList] = useState([]);
  const [recommendRecipeList, setRecommendRecipeList] = useState([]);

  useEffect(() => {
    // 설문조사에 필요한 재료 리스트 조회
    const getFormValuesApiUrl = '/api/recipes/ingredients';
    const dataQuery = 'stringList';
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          inedibleFood: true,
        }));

        const res = await getData(getFormValuesApiUrl);
        // // console.log(res);
        let data = res.data;
        const newItems = data ? data._embedded[dataQuery] : data;
        setIngredientList(newItems);
      } catch (err) {
        console.error('데이터를 가져올 수 없습니다.');
        alert('서버장애입니다. 잠시 후 다시 시도해주세요.');
        router.back();
      }
      setIsLoading((prevState) => ({
        ...prevState,
        inedibleFood: false,
      }));
    })();
  }, []);

  useEffect(() => {
    // 특별히챙겨주고싶은 부분 리스트 조회
    const getFormValuesApiUrl = '/api/recipes/survey';
    const dataQuery = 'recipeSurveyResponseDtoList';
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          recommendRecipeId: true,
        }));

        const res = await getData(getFormValuesApiUrl);
        // // console.log(res);
        let newItems = [];
        let data = res.data?._embedded;
        if (data) {
          newItems = data[dataQuery].map((list) => ({
            id: list.id,
            label: list.descriptionForSurvey,
          }));
        }
        setRecommendRecipeList(newItems);
      } catch (err) {
        console.error('데이터를 가져올 수 없습니다.');
        alert('서버장애입니다. 잠시 후 다시 시도해주세요.2');
        router.back();
      }
      setIsLoading((prevState) => ({
        ...prevState,
        recommendRecipeId: false,
      }));
    })();
  }, []);

  useEffect(() => {
    // inedibleFoodEtc => inedibleFood의 formvalue가 'ETC'가 아닌 경우,
    // // console.log('inedibleFood',formValues.inedibleFood,'&& inedibleFoodETc',formValues.inedibleFoodEtc); // TEST
    let inedibleFoodEtcValue =
      formValues.inedibleFood === dogInedibleFoodType.ETC
        ? formValues.inedibleFoodEtc
        : dogInedibleFoodType.NONE;
    // // console.log('inedibleFoodEtcValue: ',inedibleFoodEtcValue)
    // 특별히 챙겨주고싶은부분: 기타항목 => value를 ''값으로 할당
    inedibleFoodEtcValue =
      formValues.inedibleFood === dogInedibleFoodType.ETC &&
      inedibleFoodEtcValue === dogInedibleFoodType.NONE
        ? null
        : inedibleFoodEtcValue;
    setFormValues((prevState) => ({
      ...prevState,
      inedibleFoodEtc: inedibleFoodEtcValue,
    }));

    // ETC 일경우에는 '기존입력값' 또는 ''
    // ETC가 아닐 경우에는 NONE
  }, [formValues.inedibleFood]);

  useEffect(() => {
    // FORMVALUE.inedibleFoodEtc 초기화
    if (
      formValues.inedibleFoodEtc === dogInedibleFoodType.NONE &&
      formValues.inedibleFood === dogInedibleFoodType.ETC
    ) {
      // ex. 반려견 못먹는 음식 '기타'항목이 선택돼있고, input에  'NONE'을 입력한 경우
      // => '반려견 못먹는 음식'이 '없어요' Radio가 Select되도록 UI변경시킴
      setFormValues((prevState) => ({
        ...prevState,
        inedibleFoodEtc: '',
        inedibleFood: dogInedibleFoodType.NONE,
      }));
    }
  }, [formValues.inedibleFoodEtc]);
  // ! inediblefood 기타가 아닐 경우에 초기화

  return (
    <section id="surveyPage" className={s.step3page}>
      <div className={s['input-row']}>
        <p className={s.input_title}>간식 급여 횟수는</p>
        <SurveyInputRadio
          formValueKey={'snackCountLevel'}
          formValues={formValues}
          setFormValues={setFormValues}
          className={s.snackCountLevel}
          idList={[
            dogSnackCountLevelType.LITTLE,
            dogSnackCountLevelType.NORMAL,
            dogSnackCountLevelType.MUCH,
          ]}
          labelList={[
            dogSnackCountLevelType.KOR.LITTLE,
            dogSnackCountLevelType.KOR.NORMAL,
            dogSnackCountLevelType.KOR.MUCH,
          ]}
          desc={[
            <span key={'desc-01'}>
              식사에 <br /> 상관없는 양
            </span>,
            <span key={'desc-02'}>
              식사에 어느정도
              <br /> 상관 있는 양
            </span>,
            <span key={'desc-03'}>
              식사에 상당한
              <br /> 영향이 있는 양
            </span>,
          ]}
        />
      </div>

      <div className={`${s['input-row']} ${s['display-flex-column']}`}>
        <p className={s.input_title}>
          반려견은 못먹는 음식이
          {isLoading.inedibleFood && <Spinner />}
        </p>
        {formValues.inedibleFood === dogInedibleFoodType.NONE ? (
          <SurveyInputRadio
            formValueKey={'inedibleFood'}
            formValues={formValues}
            setFormValues={setFormValues}
            className={s.inedibleFood}
            idList={[dogInedibleFoodType.FAKE_TYPE, dogInedibleFoodType.NONE]}
            labelList={[
              dogInedibleFoodType.KOR.FAKE_TYPE,
              dogInedibleFoodType.KOR.NONE,
            ]}
          />
        ) : (
          <SurveyInputRadio
            formValueKey={'inedibleFood'}
            formValues={formValues}
            setFormValues={setFormValues}
            className={s.inedibleFood}
            idList={[
              dogInedibleFoodType.FAKE_TYPE,
              dogInedibleFoodType.NONE,
              ...ingredientList,
              dogInedibleFoodType.ETC,
            ]}
            labelList={[
              dogInedibleFoodType.KOR.FAKE_TYPE,
              dogInedibleFoodType.KOR.NONE,
              ...ingredientList,
              dogInedibleFoodType.KOR.ETC,
            ]}
          />
        )}
        {formValues.inedibleFood === dogInedibleFoodType.ETC && (
          <input
            id={'inedibleFoodEtc'}
            className={`${s.input_underLine} ${s['focus-underline']} mt-30`}
            type="text"
            placeholder="직접 입력해주세요."
            value={formValues.inedibleFoodEtc || ''}
            onChange={onInputChangeHandler}
          />
        )}
      </div>

      <div className={s['input-row']}>
        <div className={s.red_text}>
          ※ 바프독의 모든 생식 레시피에는
          <br />
          영양분이 가득한 육고기, 뼈, 내장, 채소 등이 들어갑니다. <br />
          육고기와 뼈의 경우 알러지 분류에 들어가지만
          <br />
          내장의 경우 알러지 분류에 들어가지 않으니 참고해주세요.
          <br />
        </div>
      </div>
      <div className={s['input-row']}>
        <p className={s.input_title}>
          특별히 챙겨주고 싶은 부분은
          {isLoading.recommendRecipeId && <Spinner />}
        </p>
        <SurveyInputRadio
          formValueKey={'recommendRecipeId'}
          formValues={formValues}
          setFormValues={setFormValues}
          className={s.recommendRecipeId}
          dataType={'number'}
          idList={recommendRecipeList.map((list) => list.id)}
          labelList={recommendRecipeList.map((list) => list.label)}
        />
      </div>
      <div className={`${s['input-row']}`}>
        <div className={s.input_title}>기타 특이사항(질병 등)이</div>
        <SurveyInputRadio
          formValueKey={'caution'}
          formValues={formValues}
          setFormValues={setFormValues}
          className={s.caution}
          idList={[dogCautionType.FAKE_TYPE, dogCautionType.NONE]}
          labelList={[dogCautionType.KOR.FAKE_TYPE, dogCautionType.KOR.NONE]}
        />
        {formValues.caution !== dogCautionType.NONE && (
          <label className={s.item_box} htmlFor={'caution'}>
            <input
              id={'caution'}
              className={`${s.input_underLine} ${s['focus-underline']} mt-30`}
              type="text"
              placeholder="직접 입력해주세요."
              value={
                formValues.caution === dogCautionType.NONE
                  ? ''
                  : formValues.caution || ''
              }
              onChange={onInputChangeHandler}
            />
            <p className={`${s.red_text} mt-30`}>
              ※ 질병여부 필수 작성해주세요 <br />
              ( 질병에 따라 급여가 불가 할 수 있습니다.) <br />
              ex. 췌장염, 쿠싱, 심장병, 만성췌장, 고지혈 등 <br />
            </p>
          </label>
        )}
      </div>
    </section>
  );
}
