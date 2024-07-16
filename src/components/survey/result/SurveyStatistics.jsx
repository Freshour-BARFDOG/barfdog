import React, { useCallback, useEffect, useState } from 'react';
import { getData } from '/src/pages/api/reqData';
import s from './surveyStatistics.module.scss';
import Loading from '/src/components/common/Loading';
import { calcDogAge } from '/util/func/calcDogAge';
import { dogActivityLevelType } from '/store/TYPE/dogActivityLevelType';
import { dogSizeType } from '/store/TYPE/dogSizeType';
import Btn_01 from '/public/img/mypage/statistic_dog_walker.svg';
import Btn_02 from '/public/img/mypage/statistic_dog_walker2.svg';

import { UnitOfDemicalPointOfOneMealGram } from '../../../../util/func/subscribe/finalVar';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import TagChart from './TagChart';
import { Swiper_product } from './Swiper_product';
import { useSubscribePlanInfo } from '/util/hook/useSubscribePlanInfo';
import SurveyResultRecipe from './SurveyResultRecipe';
import SurveyResultPlan from './SurveyResultPlan';

export const SurveyStatistics = ({ id, mode = 'default' }) => {
  const auth = useSelector((state) => state.auth);
  const userData = auth.userInfo;
  const surveyData = useSelector((state) => state.surveyData.surveyData);
  const reportLoadingDuration = 2000;
  const [info, setInfo] = useState({});
  const [surveyInfo, setSurveyInfo] = useState({});
  const [resultInfo, setResultInfo] = useState({});
  const [recipeInfo, setRecipeInfo] = useState({});
  const [recipeDoubleInfo, setRecipeDoubleInfo] = useState([]);
  const [recipeSingleInfo, setRecipeSingleInfo] = useState([]);
  const [userInfo, setUserInfo] = useState(userData);
  const [isLoading, setIsLoading] = useState({ fetching: true });
  const [isRendered, setIsRendered] = useState(true);
  // const [isMouseEnter, setIsMouseEnter] = useState(false);
  const [isShowResult, setIsShowResult] = useState(true);
  const [isActiveDogIdx, setIsActiveDogIdx] = useState('');
  const subscribePlanInfo = useSubscribePlanInfo();

  const [isArrowActive, setIsArrowActive] = useState(false);
  const [rotation, setRotation] = useState(0);

  const [form, setForm] = useState({
    plan: null,
    recipeIdList: [],
    nextPaymentPrice: null,
    oneMealGramList: [],
  });

  // const handleMouseEnter = () => {
  //   setIsMouseEnter(true);
  // };
  // const handleMouseLeave = () => {
  //   setIsMouseEnter(false);
  // };

  // console.log('dogInfoResults>>>', dogInfoResults);
  console.log('isActiveDogIdx>>>', isActiveDogIdx);
  console.log('id>>>', id);
  console.log('userData>>>', userData);

  //*** 구독플랜 금액 계산
  const calcSubscribePlanPaymentPrice = useCallback(
    (planName) => {
      if (!form.recipeIdList[0] || !planName || !recipeInfo.data) {
        return {
          perPack: 0,
          originPrice: 0,
          salePrice: 0,
        };
      }
      const discountPercent = subscribePlanInfo.planDiscountPercent[planName];
      const oneDayRecommendKcal = info.foodAnalysis.oneDayRecommendKcal;
      const pricePerGrams = info.recipeInfoList
        ?.filter((recipe) => form.recipeIdList.indexOf(recipe.id) >= 0)
        .map((recipe) => recipe.pricePerGram);
      const currentRecipeInfos = info.recipeInfoList
        ?.filter((recipe) => form.recipeIdList.indexOf(recipe.id) >= 0)
        .map((recipe) => recipe.name);
      const nextOneMealGrams = calcOneMealGramsWithRecipeInfo({
        selectedRecipeIds: form.recipeIdList,
        allRecipeInfos: recipeInfo.data,
        oneDayRecommendKcal: oneDayRecommendKcal,
        isOriginSubscriber,
      }).map((recipe) => recipe.oneMealGram);

      const isSameArray = valid_isTheSameArray(
        oneMealGramsForm.next,
        nextOneMealGrams,
      );
      // // console.log(oneMealGramsForm.next, nextOneMealGrams, "\n", isSameArray);
      if (!isSameArray) {
        setOneMealGramsForm((prevState) => ({
          ...prevState,
          next: nextOneMealGrams,
        }));
      }

      return calcSubscribePrice({
        discountPercent,
        oneMealGrams: nextOneMealGrams,
        planName,
        pricePerGrams,
        isOriginSubscriber,
        recipeNameList: currentRecipeInfos,
      });
    },
    [form.plan, form.recipeIdList, recipeInfo, subscribePlanInfo],
  );

  useEffect(() => {
    if (!id || !id.length) return;

    // ! mypage => '강아지' id로 조회
    // ! survey => '설문조사' id로 조회
    // const getSurveyReportsApiUrl =
    //   mode === 'mypage'
    //     ? `/api/dogs/${id}/surveyReport`
    //     : `/api/surveyReports/${id}`;

    //! [수정] 다견일 경우
    // const promises = idList.map(async (id) => {
    //   const apiUrl = `/api/surveyReports/${id}`;
    //   const res = await getData(apiUrl);
    //   return res.data;
    // });

    (async () => {
      try {
        // setIsLoading((prevState) => ({
        //   ...prevState,
        //   fetching: true,
        // }));

        //! [삭제] 다견일 경우
        // const responses = await Promise.all(promises); // Wait for all API calls to finish
        // console.log('responses===>', responses);
        // const dataArr = responses.filter((res) => res);
        // setSurveyInfo(dataArr);

        // if (!dataArr.length) {
        // console.error('No data received from API calls.');
        // setIsLoading((prevState) => ({
        //   ...prevState,
        //   fetching: false,
        // }));
        // return;
        // }

        //! [수정] 한 마리
        const apiUrl = `/api/surveyReports/${id}`;
        const res = await getData(apiUrl);
        console.log('/api/surveyReports/>>>', res);
        setSurveyInfo(res.data);

        const apiResultUrl = `/api/surveyReports/${id}/result`;
        const resultRes = await getData(apiResultUrl);
        console.log('apiResultUrl>>>', resultRes);
        setResultInfo(res.data);

        const getRecipeInfoApiUrl = `/api/recipes`;
        const recipeInfoRes = await getData(getRecipeInfoApiUrl);
        const recipeInfoData = recipeInfoRes?.data;
        setRecipeInfo(recipeInfoData._embedded?.recipeListResponseDtoList);

        if (recipeInfoData) {
          const recipeIdList =
            recipeInfoData._embedded?.recipeListResponseDtoList?.map(
              (l) => l.id,
            ) || [];
          const recipesDetailInfo = [];
          for (const recipeId of recipeIdList) {
            const apiUrl = `/api/recipes/${recipeId}`;
            const res = await getData(apiUrl);
            const data = res.data;
            // console.log('recipeDatas!!!! ', data);

            if (data.ingredientList.length > 1 && data.inStock) {
              setRecipeDoubleInfo((prevState) => {
                if (!prevState.some((recipe) => recipe.id === data.id)) {
                  return [...prevState, data];
                } else {
                  return prevState;
                }
              });
            } else if (data.ingredientList.length === 1 && data.inStock) {
              setRecipeSingleInfo((prevState) => {
                if (!prevState.some((recipe) => recipe.id === data.id)) {
                  return [...prevState, data];
                } else {
                  return prevState;
                }
              });
            }

            // recipesDetailInfo.push({
            //   ...data,
            //   kcalPerGram: data.gramPerKcal, // gramPerKcal(X) -> KcalPerGram(O) : 고객사에서 전달받은 무게상수의 단위를 그대로 사용하였으나, 오류가 있어서 수정함.
            // });
          }
        }

        // // console.log(data)
        // const data = res.data;
        // const DATA = {
        //   lastSurveyDate: data.lastSurveyDate,
        //   myDogName: data.myDogName,
        //   dogSize: dogSizeType.KOR[data.dogSize],
        //   ageAnalysis: {
        //     // 바프독을 시작한 평균 나이
        //     avgAgeMonth: data.ageAnalysis.avgAgeMonth, // 나이 단위 : 1년미만 -> 개월 / 1년이상 -> 살
        //     ageGroupOneCount: data.ageAnalysis.ageGroupOneCount, // 1그룹(가장어린)에 포함된 강아지 수
        //     ageGroupTwoCount: data.ageAnalysis.ageGroupTwoCount,
        //     ageGroupThreeCount: data.ageAnalysis.ageGroupThreeCount,
        //     ageGroupFourCount: data.ageAnalysis.ageGroupFourCount,
        //     ageGroupFiveCount: data.ageAnalysis.ageGroupFiveCount,
        //     myAgeGroup: data.ageAnalysis.myAgeGroup, // 내 강아지가 속한 그룹
        //     myStartAgeMonth: data.ageAnalysis.myStartAgeMonth, // 내 강아지가 바프독을 시작한 나이
        //   },
        //   weightAnalysis: {
        //     avgWeight: data.weightAnalysis.avgWeight,
        //     weightGroupOneCount: data.weightAnalysis.weightGroupOneCount, // 해당 체급 중 1그룹(가장가벼운)에 포함된 강아지 수
        //     weightGroupTwoCount: data.weightAnalysis.weightGroupTwoCount,
        //     weightGroupThreeCount: data.weightAnalysis.weightGroupThreeCount,
        //     weightGroupFourCount: data.weightAnalysis.weightGroupFourCount,
        //     weightGroupFiveCount: data.weightAnalysis.weightGroupFiveCount,
        //     myWeightGroup: data.weightAnalysis.myWeightGroup, // 내 강아지가 속한 그룹
        //     weightInLastReport: data.weightAnalysis.weightInLastReport, // 마지막으로 설문조사 했을 때 강아지 체중
        //   },
        //   activityAnalysis: {
        //     avgActivityLevel: data.activityAnalysis.avgActivityLevel, // 해당 체급의 평균 활동량
        //     activityGroupOneCount: data.activityAnalysis.activityGroupOneCount, // 해당 체급 중 1그룹(활동량 가장 낮은)에 포함된 강아지 수
        //     activityGroupTwoCount: data.activityAnalysis.activityGroupTwoCount,
        //     activityGroupThreeCount:
        //       data.activityAnalysis.activityGroupThreeCount,
        //     activityGroupFourCount:
        //       data.activityAnalysis.activityGroupFourCount,
        //     activityGroupFiveCount:
        //       data.activityAnalysis.activityGroupFiveCount,
        //     myActivityGroup: data.activityAnalysis.myActivityGroup, // 내 강아지가 속한 그룹 [1:VERY_LITTLE, 2:LITTLE, 3:NORMAL, 4:MUCH, 5:VERY_MUCH]
        //   },
        //   walkingAnalysis: {
        //     highRankPercent: data.walkingAnalysis.highRankPercent, // 산책량 상위 퍼센트
        //     walkingCountPerWeek: data.walkingAnalysis.walkingCountPerWeek,
        //     totalWalingTime: data.walkingAnalysis.totalWalingTime, // 일주일 총 산책 시간
        //     avgWalkingTimeInCity: data.walkingAnalysis.avgWalkingTimeInCity, // 같은 지역 평균 산책 시간
        //     avgWalkingTimeInAge: data.walkingAnalysis.avgWalkingTimeInAge, // 또래 평균 산책 시간
        //     avgWalkingTimeInDogSize:
        //       data.walkingAnalysis.avgWalkingTimeInDogSize, // 같은 체급 평균 산책 시간
        //   },
        //   snackAnalysis: {
        //     avgSnackCountInLargeDog: data.snackAnalysis.avgSnackCountInLargeDog, // 대형견 평균 간식 레벨 [1~3] 숫자가 높을수록 간식량 많음
        //     avgSnackCountInMiddleDog:
        //       data.snackAnalysis.avgSnackCountInMiddleDog, // 중형견 평균 간식 레벨 [1~3]
        //     avgSnackCountInSmallDog: data.snackAnalysis.avgSnackCountInSmallDog, // 소형견 평균 간식 레벨 [1~3]
        //     mySnackCount: data.snackAnalysis.mySnackCount, // 내 강아지 간식량 [1,2,3]
        //   },
        //   foodAnalysis: {
        //     oneDayRecommendKcal: data?.foodAnalysis.oneDayRecommendKcal, // 하루 권장 칼로리
        //     oneDayRecommendGram: data?.foodAnalysis.oneDayRecommendGram, // 하루 권장 식사량
        //     oneMealRecommendGram: data?.foodAnalysis.oneMealRecommendGram, // 한끼 권장 식사량
        //   },
        // };

        // const allDogsAgeCountArr = [];
        // const allDogsWeightCountArr = [];
        // const allDogsActivityCountArr = [];
        // for (const key in DATA) {
        //   const innerObj = DATA[key];
        //   // STEP 1. get Total Dog Count
        //   if (key === 'ageAnalysis') {
        //     for (const innerKey in innerObj) {
        //       const innerVal = innerObj[innerKey];
        //       innerKey.indexOf('ageGroup') >= 0 &&
        //         allDogsAgeCountArr.push(innerVal);
        //     }
        //   } else if (key === 'weightAnalysis') {
        //     for (const innerKey in innerObj) {
        //       const innerVal = innerObj[innerKey];
        //       innerKey.indexOf('weightGroup') >= 0 &&
        //         allDogsWeightCountArr.push(innerVal);
        //     }
        //   } else if (key === 'activityAnalysis') {
        //     for (const innerKey in innerObj) {
        //       const innerVal = innerObj[innerKey];
        //       innerKey.indexOf('activityGroup') >= 0 &&
        //         allDogsActivityCountArr.push(innerVal);
        //     }
        //   }
        // }
        // // add Total dogs count / Each Bar Graph
        // DATA.ageAnalysis.totalDogsCount = allDogsAgeCountArr.reduce(
        //   (acc, cur) => acc + cur,
        // );
        // DATA.weightAnalysis.totalDogCount = allDogsWeightCountArr.reduce(
        //   (acc, cur) => acc + cur,
        // );
        // DATA.activityAnalysis.totalDogCount = allDogsWeightCountArr.reduce(
        //   (acc, cur) => acc + cur,
        // );

        // const _percentDATA = JSON.parse(JSON.stringify(DATA));
        // for (const key in _percentDATA) {
        //   const innerObj = _percentDATA[key];
        //   if (key === 'ageAnalysis') {
        //     const filteredObj = transformPercentUnitInGroup(
        //       innerObj,
        //       'ageGroup',
        //     );
        //     _percentDATA[key] = filter_objectInGroup(
        //       filteredObj,
        //       'ageGroup',
        //     ).map((obj, index) => {
        //       const groupOrder = index + 1;
        //       let tempObj = {};
        //       for (const key in obj) {
        //         tempObj = {
        //           degree: Object.values(obj)[0],
        //           inGroup: groupOrder === _percentDATA.ageAnalysis.myAgeGroup,
        //         };
        //       }
        //       return tempObj;
        //     });
        //   } else if (key === 'weightAnalysis') {
        //     const filteredObj = transformPercentUnitInGroup(
        //       innerObj,
        //       'weightGroup',
        //     );
        //     _percentDATA[key] = filter_objectInGroup(
        //       filteredObj,
        //       'weightGroup',
        //     ).map((obj, index) => {
        //       const groupOrder = index + 1;
        //       let tempObj = {};
        //       for (const key in obj) {
        //         tempObj = {
        //           degree: Object.values(obj)[0],
        //           inGroup:
        //             groupOrder === _percentDATA.weightAnalysis.myWeightGroup,
        //         };
        //       }
        //       return tempObj;
        //     });
        //     // _percentDATA[key] = transformPercentUnitInGroup(innerObj, 'weightGroup');
        //   } else if (key === 'activityAnalysis') {
        //     const filteredObj = transformPercentUnitInGroup(
        //       innerObj,
        //       'activityGroup',
        //     );
        //     _percentDATA[key] = filter_objectInGroup(
        //       filteredObj,
        //       'activityGroup',
        //     ).map((obj, index) => {
        //       const groupOrder = index + 1;
        //       let tempObj = {};
        //       for (const key in obj) {
        //         tempObj = {
        //           degree: Object.values(obj)[0],
        //           inGroup:
        //             groupOrder ===
        //             _percentDATA.activityAnalysis.myActivityGroup,
        //         };
        //       }
        //       return tempObj;
        //     });
        //     // _percentDATA[key] = transformPercentUnitInGroup(innerObj, 'activityGroup');
        //   } else if (key === 'snackAnalysis') {
        //     _percentDATA[key] = transformPercentUnitInGroup(innerObj);
        //   } else if (key === 'walkingAnalysis') {
        //     const targetObj = {
        //       myDog: DATA.walkingAnalysis.totalWalingTime,
        //       inCity: DATA.walkingAnalysis.avgWalkingTimeInCity,
        //       inAge: DATA.walkingAnalysis.avgWalkingTimeInAge,
        //       inDogSize: DATA.walkingAnalysis.avgWalkingTimeInDogSize,
        //     };
        //     const resultObj = transformPercentUnitInGroup(targetObj);
        //     _percentDATA[key] = resultObj;
        //   }
        // }

        // // // console.log('_percentDATA: ',_percentDATA);
        // // // console.log(DATA);
        // const allDATA = {
        //   ...DATA,
        //   _percentDATA,
        // };
        // setInfo(allDATA);
        setIsRendered(false);
      } catch (err) {
        console.error(err);
        console.error('데이터를 가져올 수 없습니다.');
      }

      setTimeout(() => {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: false,
        }));
      }, reportLoadingDuration);
    })();
  }, []);

  //! 로딩 화면
  if (isLoading.fetching || isRendered) {
    return <Loading />;
  }

  // 설문 조사 결과 !
  console.log('info>>>', info);
  // 배열로 받을 예정

  //*** '더보기' 클릭
  const dogInfoClickHandler = () => {
    setIsShowResult(!isShowResult);

    // if (!isShowResultIdx.includes(index)) {
    //   // 클릭한 index가 배열에 없으면 추가
    //   setIsShowResultIdx([...isShowResultIdx, index]);
    // } else {
    //   // 클릭한 index가 배열에 있으면 제거
    //   setIsShowResultIdx(isShowResultIdx.filter((item) => item !== index));
    // }
  };

  const onClickArrowIcon = (e) => {
    e.preventDefault();
    setIsArrowActive(!isArrowActive);
    setRotation((prevRotation) => (prevRotation + 180) % 360);
  };

  // const topTabElement = document.querySelector(`.${s.top_tab}`);
  // const gridContainerElement = document.querySelector(`.${s.grid_container}`);

  // // 스크롤 이벤트 리스너 추가
  // window.addEventListener('scroll', () => {
  //   // 현재 스크롤 위치 확인
  //   const currentScroll =
  //     window.scrollY ||
  //     window.pageYOffset ||
  //     document.documentElement.scrollTop;

  //   // grid_container 요소의 위치 확인
  //   const gridContainerRect = gridContainerElement.getBoundingClientRect();
  //   const gridContainerTop =
  //     gridContainerRect.top + window.scrollY ||
  //     window.pageYOffset ||
  //     document.documentElement.scrollTop;
  //   console.log('gridContainerTop', gridContainerTop);
  //   console.log('currentScroll', currentScroll);
  //   // 스크롤 위치가 grid_container 요소의 top 위치 이상인 경우
  //   if (currentScroll >= gridContainerTop - 100) {
  //     // top_tab 요소를 fixed로 변경하고 원하는 위치로 이동
  //     topTabElement.style.position = 'fixed';
  //     topTabElement.style.top = '100px'; // 원하는 위치로 설정
  //   } else {
  //     // 스크롤 위치가 grid_container 요소의 top 위치 이하인 경우
  //     // top_tab 요소를 다시 static으로 변경
  //     topTabElement.style.position = 'static';
  //   }
  // });

  console.log('isActiveDogIdx>>>', isActiveDogIdx);
  console.log('surveyInfo===>', surveyInfo);
  console.log('resultInfo===>', resultInfo);
  console.log('recipeInfo===>', recipeInfo);
  console.log('recipeDoubleInfo===>', recipeDoubleInfo);
  console.log('recipeSingleInfo===>', recipeSingleInfo);
  console.log('form===>', form);

  return (
    <div id="statistics">
      <section
        className={`${mode !== 'mypage' ? s.default : s.mypage} ${s.title}`}
      >
        <h1>{userInfo.name} 보호자님의 가족</h1>
        <div className={s.result_box_list}>
          {/* 견종 결과 */}
          {/* {surveyInfo?.map((dogInfo, index) => ( */}
          <div
            // key={index}
            className={`${s.dog_img_wrapper} ${isShowResult ? s.active : ''}`}
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
            // onClick={() => dogInfoClickHandler(dogInfo.surveyId, index)}
          >
            <div className={s.dog_info_wrapper}>
              <div className={s.dog_info_name}>
                {surveyInfo.myDogName} (이)의 건강 상태를 분석한 결과입니다.
              </div>

              {/* '더보기' 버튼 클릭 시  */}
              {isShowResult ? (
                <div
                  className={`${s.survey_result_wrapper} animation-show-all-child`}
                >
                  <div className={s.box_line}></div>
                  {/* 1. 설문조사 정보 */}
                  <main className={`${s.grid_container_box}`}>
                    <div className={s.top_tab_container}>
                      현재 {calcDogAge(surveyInfo.dogBirthday.slice(0, 6))},
                      중성화를{' '}
                      <span className={s.under_text}>
                        {' '}
                        {surveyInfo.neutralization ? '한' : '하지 않은'}
                      </span>{' '}
                      {surveyInfo.myDogName}
                      <br />
                      <span className={s.under_text}>
                        {surveyInfo.dogSize === 'LARGE'
                          ? '대형견'
                          : surveyInfo.dogSize === 'MIDDLE'
                          ? '중형견'
                          : surveyInfo.dogSize === 'SMALL'
                          ? '소형견'
                          : ''}{' '}
                      </span>
                      이고,{' '}
                      <span className={s.under_text}>
                        {' '}
                        {surveyInfo.dogType}
                      </span>
                      인 {surveyInfo.myDogName}
                      <br />
                      <span className={s.under_text}>
                        {' '}
                        {surveyInfo.priorityConcerns}
                      </span>{' '}
                      가 고민인 {surveyInfo.myDogName}는{' '}
                      <span className={s.under_text}>
                        {surveyInfo.dogStatus === 'HEALTHY'
                          ? '건강해요'
                          : surveyInfo.dogSize === 'NEED_DIET'
                          ? '다이어트가 필요해요'
                          : surveyInfo.dogSize === 'OBESITY'
                          ? '심각한 비만입니다'
                          : surveyInfo.dogSize === 'THIN'
                          ? '말랐어요'
                          : ''}
                      </span>
                      {/* <div className={s.top_tab}>
                            <div>견종 정보</div>
                            <div>건강 종합 점수</div>
                            <div>영양 가이드</div>
                          </div> */}
                    </div>
                  </main>

                  <div className={s.box_line}></div>

                  {/* 2. 맞춤 문구 설명 */}
                  <div className={s.dog_info_name}>
                    바프독을 통해 이런 도움을 받을 수 있어요!
                  </div>

                  <div className={s.dog_tag_container}>
                    <div className={s.dog_tag_box}>
                      <TagChart />
                    </div>

                    <div className={s.box_line}></div>

                    {/* 구분선 */}
                    <ul className={isArrowActive ? s.tag_list_active : ''}>
                      <li>
                        <h2>#다이어트필요</h2>
                        <div>
                          국가는 노인과 청소년의 복지향상을 위한 정책을 실시할
                          의무를 진다. 언론·출판에 대한 허가나 검열과
                          집회·결사에 대한 허가는 인정되지 아니한다. 학교교육 및
                          평생교육을 포함한 교육제도와 그 운영, 교육재정 및
                          교원의 지위에 관한 기본적인 사항은 법률로 정한다.
                        </div>
                      </li>
                      <li>
                        <h2>#다이어트필요</h2>
                        <div>
                          국가는 노인과 청소년의 복지향상을 위한 정책을 실시할
                          의무를 진다. 언론·출판에 대한 허가나 검열과
                          집회·결사에 대한 허가는 인정되지 아니한다. 학교교육 및
                          평생교육을 포함한 교육제도와 그 운영, 교육재정 및
                          교원의 지위에 관한 기본적인 사항은 법률로 정한다.
                        </div>
                      </li>
                    </ul>

                    <button onClick={onClickArrowIcon}>
                      더보기
                      <Image
                        src={'/img/survey/survey_arrow.svg'}
                        alt="survey_arrow"
                        width={10}
                        height={10}
                        style={{ transform: `rotate(${rotation}deg)` }}
                      />
                    </button>
                  </div>

                  <div className={s.box_dot_divider}></div>

                  {/* 3. 레시피 선택 */}
                  <SurveyResultRecipe
                    surveyInfo={surveyInfo}
                    recipeInfo={recipeInfo}
                    recipeDoubleInfo={recipeDoubleInfo}
                    recipeSingleInfo={recipeSingleInfo}
                    form={form}
                    setForm={setForm}
                  />

                  <div className={s.box_dot_divider}></div>

                  {/* 4. 플랜 선택 */}
                  <SurveyResultPlan
                    surveyInfo={surveyInfo}
                    recipeInfo={recipeInfo}
                    recipeDoubleInfo={recipeDoubleInfo}
                    recipeSingleInfo={recipeSingleInfo}
                    form={form}
                    setForm={setForm}
                    calcPrice={calcSubscribePlanPaymentPrice}
                  />

                  {/* 5. 챙겨줄 제품 - Swiper */}
                  <div className={s.recommend_product_container}>
                    {surveyInfo.myDogName} (이)에게 더 챙겨줄 제품은 없을까요?
                    <div className={s.recommend_product_title}>
                      함게 구독하면 좋은 일반 상품도 살펴보세요!
                    </div>
                    <Swiper_product />
                  </div>

                  {/* 6. 닫기 버튼 */}
                  {/* <div className={s.close_btn_wrapper}>
                    <button
                      className={s.close_btn}
                      onClick={() => dogInfoClickHandler(surveyInfo.surveyId)}
                    >
                      닫기
                      <Image
                        src={'/img/survey/survey_arrow.svg'}
                        alt="survey_arrow"
                        width={10}
                        height={10}
                        className={s.rotate_180}
                      />
                    </button>
                  </div> */}
                </div>
              ) : (
                <div className={s.dog_info_show_btn_wrapper}>
                  <button
                    className={s.dog_info_show_btn}
                    onClick={dogInfoClickHandler}
                  >
                    더보기{' '}
                    <Image
                      src={'/img/survey/survey_arrow.svg'}
                      alt="survey_arrow"
                      width={10}
                      height={10}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* ))} */}
        </div>

        {/* <span className={s.result_description}>
          더보기를 클릭하여 레시피와 플랜을 선택하여 주세요
        </span> */}
      </section>

      <button className={s.payment_btn}>결제하러 가기</button>
    </div>
  );
};

const transformPercentUnitInGroup = (obj, targetString) => {
  //  절대값을 상대값( 퍼센트)으로 변화
  const targetValueArr = Object.keys(obj)
    .filter((key) => key.indexOf(targetString) >= 0)
    .map((key) => obj[key]);
  const valArr = targetString ? targetValueArr : Object.values(obj);
  const highestVal = Math.max(...valArr);

  if (targetString) {
    for (const key in obj) {
      const val = obj[key];
      const percentUnit = Number((val / highestVal).toFixed(3)) * 100;
      // // console.log('percentUnit', percentUnit)
      // // console.log('KEY', key, '&',targetString ,key.indexOf(targetString))
      obj[key] =
        typeof val === 'number' && key.indexOf(targetString) >= 0
          ? percentUnit + '%'
          : val;
    }
  } else {
    for (const key in obj) {
      const val = obj[key];
      const percentUnit = ((val / highestVal) * 100).toFixed(2) + '%';
      obj[key] = percentUnit;
    }
  }

  return obj;
};

const filter_objectInGroup = (obj, keyword) => {
  let filteredGroup = [];
  for (const key in obj) {
    const val = obj[key];
    key.indexOf(keyword) >= 0 &&
      filteredGroup.push({ [key]: val, inGroup: false });
  }
  return filteredGroup;
};

// export async function getServerSideProps({ req, query }) {
//   // Query CASE
//   // surveyReportsId : 결제 전
//   // dogId: 구독 중 || 구독 보류

//   const { id } = query;
//   console.log('***', id);
//   console.log('***', req, query);
//   console.log('***');

//   let data = null;

//   // DATA: this Dog's Result of survey Report
//   const getSurveyReportResultApiUrl = surveyReportsId
//     ? `/api/surveyReports/${surveyReportsId}/result` // "설문조사 직후" 현재 페이지 진입
//     : dogId
//     ? `/api/dogs/${dogId}/surveyReportResult` // "설문조사 수정 후", "맞춤플랜 변경"으로 현재 페이지 진입
//     : null;
//   const surveyInfoRes = await getDataSSR(req, getSurveyReportResultApiUrl);
//   const surveyInfoData = surveyInfoRes?.data || null;
//   const thisDogId = dogId || surveyInfoData?.dogId || null;

//   // DATA: this Dog
//   const getDogInfoApiUrl = `/api/dogs/${thisDogId}`;
//   const dogInfoRes = await getDataSSR(req, getDogInfoApiUrl);
//   const dogData = dogInfoRes?.data || null;
//   const dogDto = dogData?.dogDto || null;

//   // DATA: Recipes
//   const getRecipeInfoApiUrl = `/api/recipes`;
//   const recipeInfoRes = await getDataSSR(req, getRecipeInfoApiUrl);
//   const recipeInfoData = recipeInfoRes?.data;

//   // console.log(
//   //   'recipeInfoData',
//   //   recipeInfoData._embedded?.recipeListResponseDtoList,
//   // );

//   if (dogData && recipeInfoData) {
//     const recipeIdList =
//       recipeInfoData._embedded?.recipeListResponseDtoList?.map((l) => l.id) ||
//       [];
//     const recipesDetailInfo = [];
//     for (const recipeId of recipeIdList) {
//       const apiUrl = `/api/recipes/${recipeId}`;
//       const res = await getDataSSR(req, apiUrl);
//       const data = res.data;
//       // console.log('recipeDatas>>>> ', data);
//       if (data) {
//         recipesDetailInfo.push({
//           ...data,
//           kcalPerGram: data.gramPerKcal, // gramPerKcal(X) -> KcalPerGram(O) : 고객사에서 전달받은 무게상수의 단위를 그대로 사용하였으나, 오류가 있어서 수정함.
//         });
//       }
//     }

//     // console.log("dogDto: ",dogDto);
//     // console.log("surveyInfoData: ",surveyInfoData);
//     // console.log("recipesDetailInfo: ",recipesDetailInfo);
//     data = {
//       dogDto: dogDto,
//       surveyInfo: surveyInfoData,
//       recipesDetailInfo: recipesDetailInfo,
//     };
//   }

//   if (!data) {
//     return {
//       props: {},
//       redirect: {
//         destination: '/',
//       },
//     };
//   }

//   return { props: { data } };
// }
