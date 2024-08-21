import React, { useCallback, useEffect, useState } from 'react';
import { getData, putObjData } from '/src/pages/api/reqData';
import s from './surveyStatistics.module.scss';
import Loading from '/src/components/common/Loading';
import { calcDogAge } from '/util/func/calcDogAge';
import Btn_01 from '/public/img/mypage/statistic_dog_walker.svg';
import Btn_02 from '/public/img/mypage/statistic_dog_walker2.svg';
import { UnitOfDemicalPointOfOneMealGram } from '../../../../util/func/subscribe/finalVar';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import TagChart from './TagChart';
import { Swiper_product } from '../result/Swiper_product';
import { useSubscribePlanInfo } from '/util/hook/useSubscribePlanInfo';
import SurveyResultRecipe from '../result/SurveyResultRecipe';
import SurveyResultPlan from '../result/SurveyResultPlan';
import { calcOneMealGramsWithRecipeInfo } from '/util/func/subscribe/calcOneMealGramsWithRecipeInfo';
import { convertFixedNumberByOneDayRecommendKcal } from '/util/func/subscribe/convertFixedNumberByOneDayRecommendKcal';
import { originSubscribeIdList } from '/util/func/subscribe/originSubscribeIdList';
import { validate } from '/util/func/validation/validation_orderSubscribe';
import {
  valid_hasFormErrors,
  valid_isTheSameArray,
} from '/util/func/validation/validationPackage';
import { calcSubscribePrice } from '/util/func/subscribe/calcSubscribePrices';
import { surveyDescriptionList } from './description';
import { cartAction } from '/store/cart-slice';
import { useModalContext } from '/store/modal-context';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useRouter } from 'next/router';
import { Modal_deliveryNotice } from '../../modal/Modal_deliveryNotice';
import { FaArrowRight } from 'react-icons/fa';
import SurveyDogInfo from './SurveyDogInfo';
import SurveyScore from './HealthScore';
import { calcDogAgebyMonth } from '/util/func/calcDogAge';
import { dogActivityLevelType } from '/store/TYPE/dogActivityLevelType';
import { dogSizeType } from '/store/TYPE/dogSizeType';
import RecommendRecipe from './RecommendRecipe';
import ConcernDetails from './ConcernDetails';
import HealthScore from './HealthScore';
import HealthScoreAnalysis from './HealthScoreAnalysis';
import WalkingAnalysis from './WalkingAnalysis';
import DogAnalysis from './DogAnalysis';

export const SurveyStatistics = ({ id, mode = 'default' }) => {
  const auth = useSelector((state) => state.auth);
  const userData = auth.userInfo;
  const surveyData = useSelector((state) => state.surveyData.surveyData);
  const reportLoadingDuration = 2000;
  const [surveyInfo, setSurveyInfo] = useState({});
  const [resultInfo, setResultInfo] = useState({});
  const [recipeInfo, setRecipeInfo] = useState({});
  const [recipeDoubleInfo, setRecipeDoubleInfo] = useState([]);
  const [recipeSingleInfo, setRecipeSingleInfo] = useState([]);
  const [userInfo, setUserInfo] = useState(userData);
  const [isLoading, setIsLoading] = useState({ fetching: true });
  const [isRendered, setIsRendered] = useState(true);
  const [isShowResult, setIsShowResult] = useState(false);

  const [etcConcernsData, setEtcConcernsData] = useState({});
  const [pricePerPack, setPricePerPack] = useState(''); // 가격
  const [submitted, setSubmitted] = useState(false);
  const [info, setInfo] = useState({});
  const subscribePlanInfo = useSubscribePlanInfo();
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  const dispatch = useDispatch();

  const [isArrowActive, setIsArrowActive] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [activeModal, setActiveModal] = useState(false);
  const [scoreInfo, setScoreInfo] = useState({});

  const [form, setForm] = useState({
    plan: null,
    recipeIdList: [],
    nextPaymentPrice: null,
  });

  const [isOriginSubscriber, setIsOriginSubscriber] = useState(false);
  const [oneMealGramsForm, setOneMealGramsForm] = useState({
    current: [],
    next: [],
  });

  const [toppingPerPackPriceList, setToppingPerPackPriceList] = useState([]);

  const [mypageSubscribeId, setMypageSubscribeId] = useState(null);

  const dogStatusType = {
    THIN: 'THIN',
    HEALTHY: 'HEALTHY',
    NEED_DIET: 'NEED_DIET',
    OBESITY: 'OBESITY',
    PREGNANT: 'PREGNANT',
    LACTATING: 'LACTATING',
    KOR: {
      THIN: '말랐어요',
      HEALTHY: '건강해요',
      NEED_DIET: '다이어트 필요',
      OBESITY: '심각한 비만',
      PREGNANT: '임신한 상태',
      LACTATING: '수유 중',
    },
  };

  // 하단 버튼 '마이페이지로 돌아가기'
  const onPrevPage = () => {
    router.push('/mypage');
  };

  useEffect(() => {
    //! [추가] 기존 구독자인지 확인
    originSubscribeIdList.includes(surveyInfo.subscribeId) &&
      setIsOriginSubscriber(true);
  }, []);

  useEffect(() => {
    if (!id || !id.length) return;

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

        // ! mypage => '강아지' id로 조회
        // ! survey => '설문조사' id로 조회
        const apiUrl =
          mode === 'mypage'
            ? `/api/dogs/${id}/surveyReport`
            : `/api/surveyReports/${id}`;

        const res = await getData(apiUrl);
        const data = res.data;
        // console.log('/api/surveyReports/>>>', res);
        setSurveyInfo(data);

        //*** 건강종합점수 계산
        const scoreNumber = data.score;
        let color, text;

        switch (true) {
          case scoreNumber >= 0 && scoreNumber <= 25:
            color = '#D60B0B';
            text = '매우 위험해요';
            break;
          case scoreNumber >= 26 && scoreNumber <= 50:
            color = '#FF9243';
            text = '다소 위험해요';
            break;
          case scoreNumber >= 51 && scoreNumber <= 75:
            color = '#FFD543';
            text = '나쁘지 않아요';
            break;
          case scoreNumber >= 76 && scoreNumber <= 90:
            color = '#00C1EC';
            text = '좋아요!';
            break;
          case scoreNumber >= 91 && scoreNumber <= 100:
            color = '#0BD65C';
            text = '아주 좋아요!';
            break;
          default:
            color = '#FFFFFF';
            text = '';
            break;
        }

        // 상태 업데이트
        setScoreInfo({
          scoreNumber,
          color,
          text,
        });

        //*** 칼로리 계산
        const DATA = {
          lastSurveyDate: data.lastSurveyDate,
          myDogName: data.myDogName,
          dogSize: dogSizeType.KOR[data.dogSize],
          ageAnalysis: {
            // 바프독을 시작한 평균 나이
            avgAgeMonth: data.ageAnalysis.avgAgeMonth, // 나이 단위 : 1년미만 -> 개월 / 1년이상 -> 살
            ageGroupOneCount: data.ageAnalysis.ageGroupOneCount, // 1그룹(가장어린)에 포함된 강아지 수
            ageGroupTwoCount: data.ageAnalysis.ageGroupTwoCount,
            ageGroupThreeCount: data.ageAnalysis.ageGroupThreeCount,
            ageGroupFourCount: data.ageAnalysis.ageGroupFourCount,
            ageGroupFiveCount: data.ageAnalysis.ageGroupFiveCount,
            myAgeGroup: data.ageAnalysis.myAgeGroup, // 내 강아지가 속한 그룹
            myStartAgeMonth: data.ageAnalysis.myStartAgeMonth, // 내 강아지가 바프독을 시작한 나이
          },
          weightAnalysis: {
            avgWeight: data.weightAnalysis.avgWeight,
            weightGroupOneCount: data.weightAnalysis.weightGroupOneCount, // 해당 체급 중 1그룹(가장가벼운)에 포함된 강아지 수
            weightGroupTwoCount: data.weightAnalysis.weightGroupTwoCount,
            weightGroupThreeCount: data.weightAnalysis.weightGroupThreeCount,
            weightGroupFourCount: data.weightAnalysis.weightGroupFourCount,
            weightGroupFiveCount: data.weightAnalysis.weightGroupFiveCount,
            myWeightGroup: data.weightAnalysis.myWeightGroup, // 내 강아지가 속한 그룹
            weightInLastReport: data.weightAnalysis.weightInLastReport, // 마지막으로 설문조사 했을 때 강아지 체중
          },
          activityAnalysis: {
            avgActivityLevel: data.activityAnalysis.avgActivityLevel, // 해당 체급의 평균 활동량
            activityGroupOneCount: data.activityAnalysis.activityGroupOneCount, // 해당 체급 중 1그룹(활동량 가장 낮은)에 포함된 강아지 수
            activityGroupTwoCount: data.activityAnalysis.activityGroupTwoCount,
            activityGroupThreeCount:
              data.activityAnalysis.activityGroupThreeCount,
            activityGroupFourCount:
              data.activityAnalysis.activityGroupFourCount,
            activityGroupFiveCount:
              data.activityAnalysis.activityGroupFiveCount,
            myActivityGroup: data.activityAnalysis.myActivityGroup, // 내 강아지가 속한 그룹 [1:VERY_LITTLE, 2:LITTLE, 3:NORMAL, 4:MUCH, 5:VERY_MUCH]
          },
          walkingAnalysis: {
            highRankPercent: data.walkingAnalysis.highRankPercent, // 산책량 상위 퍼센트
            walkingCountPerWeek: data.walkingAnalysis.walkingCountPerWeek,
            totalWalingTime: data.walkingAnalysis.totalWalingTime, // 일주일 총 산책 시간
            avgWalkingTimeInCity: data.walkingAnalysis.avgWalkingTimeInCity, // 같은 지역 평균 산책 시간
            avgWalkingTimeInAge: data.walkingAnalysis.avgWalkingTimeInAge, // 또래 평균 산책 시간
            avgWalkingTimeInDogSize:
              data.walkingAnalysis.avgWalkingTimeInDogSize, // 같은 체급 평균 산책 시간
          },
          snackAnalysis: {
            avgSnackCountInLargeDog: data.snackAnalysis.avgSnackCountInLargeDog, // 대형견 평균 간식 레벨 [1~3] 숫자가 높을수록 간식량 많음
            avgSnackCountInMiddleDog:
              data.snackAnalysis.avgSnackCountInMiddleDog, // 중형견 평균 간식 레벨 [1~3]
            avgSnackCountInSmallDog: data.snackAnalysis.avgSnackCountInSmallDog, // 소형견 평균 간식 레벨 [1~3]
            mySnackCount: data.snackAnalysis.mySnackCount, // 내 강아지 간식량 [1,2,3]
          },
          foodAnalysis: {
            oneDayRecommendKcal: data?.foodAnalysis.oneDayRecommendKcal, // 하루 권장 칼로리
            oneDayRecommendGram: data?.foodAnalysis.oneDayRecommendGram, // 하루 권장 식사량
            oneMealRecommendGram: data?.foodAnalysis.oneMealRecommendGram, // 한끼 권장 식사량
          },
        };

        const allDogsAgeCountArr = [];
        const allDogsWeightCountArr = [];
        const allDogsActivityCountArr = [];
        for (const key in DATA) {
          const innerObj = DATA[key];
          // STEP 1. get Total Dog Count
          if (key === 'ageAnalysis') {
            for (const innerKey in innerObj) {
              const innerVal = innerObj[innerKey];
              innerKey.indexOf('ageGroup') >= 0 &&
                allDogsAgeCountArr.push(innerVal);
            }
          } else if (key === 'weightAnalysis') {
            for (const innerKey in innerObj) {
              const innerVal = innerObj[innerKey];
              innerKey.indexOf('weightGroup') >= 0 &&
                allDogsWeightCountArr.push(innerVal);
            }
          } else if (key === 'activityAnalysis') {
            for (const innerKey in innerObj) {
              const innerVal = innerObj[innerKey];
              innerKey.indexOf('activityGroup') >= 0 &&
                allDogsActivityCountArr.push(innerVal);
            }
          }
        }
        // add Total dogs count / Each Bar Graph
        DATA.ageAnalysis.totalDogsCount = allDogsAgeCountArr.reduce(
          (acc, cur) => acc + cur,
        );
        DATA.weightAnalysis.totalDogCount = allDogsWeightCountArr.reduce(
          (acc, cur) => acc + cur,
        );
        DATA.activityAnalysis.totalDogCount = allDogsWeightCountArr.reduce(
          (acc, cur) => acc + cur,
        );

        const _percentDATA = JSON.parse(JSON.stringify(DATA));
        for (const key in _percentDATA) {
          const innerObj = _percentDATA[key];
          if (key === 'ageAnalysis') {
            const filteredObj = transformPercentUnitInGroup(
              innerObj,
              'ageGroup',
            );
            _percentDATA[key] = filter_objectInGroup(
              filteredObj,
              'ageGroup',
            ).map((obj, index) => {
              const groupOrder = index + 1;
              let tempObj = {};
              for (const key in obj) {
                tempObj = {
                  degree: Object.values(obj)[0],
                  inGroup: groupOrder === _percentDATA.ageAnalysis.myAgeGroup,
                };
              }
              return tempObj;
            });
          } else if (key === 'weightAnalysis') {
            const filteredObj = transformPercentUnitInGroup(
              innerObj,
              'weightGroup',
            );
            _percentDATA[key] = filter_objectInGroup(
              filteredObj,
              'weightGroup',
            ).map((obj, index) => {
              const groupOrder = index + 1;
              let tempObj = {};
              for (const key in obj) {
                tempObj = {
                  degree: Object.values(obj)[0],
                  inGroup:
                    groupOrder === _percentDATA.weightAnalysis.myWeightGroup,
                };
              }
              return tempObj;
            });
            // _percentDATA[key] = transformPercentUnitInGroup(innerObj, 'weightGroup');
          } else if (key === 'activityAnalysis') {
            const filteredObj = transformPercentUnitInGroup(
              innerObj,
              'activityGroup',
            );
            _percentDATA[key] = filter_objectInGroup(
              filteredObj,
              'activityGroup',
            ).map((obj, index) => {
              const groupOrder = index + 1;
              let tempObj = {};
              for (const key in obj) {
                tempObj = {
                  degree: Object.values(obj)[0],
                  inGroup:
                    groupOrder ===
                    _percentDATA.activityAnalysis.myActivityGroup,
                };
              }
              return tempObj;
            });
            // _percentDATA[key] = transformPercentUnitInGroup(innerObj, 'activityGroup');
          } else if (key === 'snackAnalysis') {
            _percentDATA[key] = transformPercentUnitInGroup(innerObj);
          } else if (key === 'walkingAnalysis') {
            const targetObj = {
              myDog: DATA.walkingAnalysis.totalWalingTime,
              inCity: DATA.walkingAnalysis.avgWalkingTimeInCity,
              inAge: DATA.walkingAnalysis.avgWalkingTimeInAge,
              inDogSize: DATA.walkingAnalysis.avgWalkingTimeInDogSize,
            };
            const resultObj = transformPercentUnitInGroup(targetObj);
            _percentDATA[key] = resultObj;
          }
        }

        // // console.log('_percentDATA: ',_percentDATA);
        // // console.log(DATA);
        const allDATA = {
          ...DATA,
          _percentDATA,
        };
        setInfo(allDATA);

        //* 문구 설명
        let etcConcernsList = [];
        if (res.data.dogStatus !== 'HEALTHY') {
          etcConcernsList.push(dogStatusType.KOR[res.data.dogStatus]);
        }

        if (res.data.specificDogStatus.includes('PREGNANT')) {
          etcConcernsList.push('임신한 상태');
        }

        if (res.data.specificDogStatus.includes('LACTATING')) {
          etcConcernsList.push('수유 중');
        }

        if (res.data.waterCountLevel === 'LITTLE') {
          etcConcernsList.push('적은 음수량');
        }

        if (
          res.data.dogActivity.activityLevel === 'VERY_MUCH' ||
          res.data.dogActivity.activityLevel === 'MUCH'
        ) {
          etcConcernsList.push('많은 활동량');
        } else if (
          res.data.dogActivity.activityLevel === 'VERY_LITTLE' ||
          res.data.dogActivity.activityLevel === 'LITTLE'
        ) {
          etcConcernsList.push('적은 활동량');
        }

        const etcConcernsTextList = res.data.priorityConcerns
          .split(',')
          .slice(1); // 첫 번째 항목을 제외

        if (etcConcernsTextList.length > 0) {
          etcConcernsList = [...etcConcernsList, ...etcConcernsTextList];
        }

        setEtcConcernsData(etcConcernsList);

        // const etcConcerns =
        //   res.data.dogStatus === '건강해요' &&
        //   !res.data.specificDogStatus.includes('PREGNANT') &&
        //   !res.data.specificDogStatus.includes('LACTATING') &&
        //   res.data.waterCountLevel !== 'LITTLE' &&
        //   res.data.dogActivity.activityLevel !== 'VERY_MUCH' &&
        //   res.data.dogActivity.activityLevel !== 'MUCH' &&
        //   res.data.dogActivity.activityLevel !== 'VERY_LITTLE' &&
        //   res.data.dogActivity.activityLevel !== 'LITTLE' &&
        //   !res.data.priorityConcerns.split(',').slice(1)
        //     ? false
        //     : [];

        // {
        //     dogStatus: dogStatusType.KOR[res.data.dogStatus],
        //     pregnant:
        //       res.data.specificDogStatus.includes('PREGNANT') &&
        //       '임신한 상태',
        //     lactating:
        //       res.data.specificDogStatus.includes('LACTATING') && '수유 중',
        //     waterCountLevel:
        //       res.data.waterCountLevel === 'LITTLE' && '적은 음수량',
        //     activityLevel:
        //       res.data.dogActivity.activityLevel === 'VERY_MUCH' ||
        //       res.data.dogActivity.activityLevel === 'MUCH'
        //         ? '많은 활동량'
        //         : res.data.dogActivity.activityLevel === 'VERY_LITTLE' ||
        //           res.data.dogActivity.activityLevel === 'LITTLE'
        //         ? '적은 활동량'
        //         : '',
        //     etcPriorityConcerns: res.data.priorityConcerns
        //       .split(',')
        //       .slice(1), // 첫 번째 항목을 제외
        //   };

        setForm((prevState) => ({
          ...prevState,
          oneDayRecommendKcal: res.data.foodAnalysis.oneDayRecommendKcal,
        }));

        // ! mypage => '강아지' id로 조회
        // ! survey => '설문조사' id로 조회

        if (mode === 'default') {
          const apiResultUrl = `/api/surveyReports/${id}/result`;
          const resultRes = await getData(apiResultUrl);
          // console.log('apiResultUrl>>>', resultRes);
          setResultInfo(resultRes.data);
        } else if (mode === 'mypage') {
          const apiDogList = '/api/dogs';
          const dogListRes = await getData(apiDogList);
          const dogListData = dogListRes?.data._embedded.queryDogsDtoList;
          // console.log('dogListData>>>', dogListData);
          const subscribeId = dogListData?.find(
            (dog) => dog.id === Number(id),
          ).subscribeId;
          setMypageSubscribeId(subscribeId);
        }

        const getRecipeInfoApiUrl = `/api/recipes`;
        const recipeInfoRes = await getData(getRecipeInfoApiUrl);
        const recipeInfoData = recipeInfoRes?.data;
        // setRecipeInfo(recipeInfoData._embedded?.recipeListResponseDtoList);

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

            if (data) {
              recipesDetailInfo.push({
                ...data,
                kcalPerGram: data.gramPerKcal, // gramPerKcal(X) -> KcalPerGram(O) : 고객사에서 전달받은 무게상수의 단위를 그대로 사용하였으나, 오류가 있어서 수정함.
              });

              setRecipeInfo(recipesDetailInfo);
            }

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

  // const currentRecipeIds =
  //   resultInfo.recipeDtoList
  //     .filter((rc) => surveyInfo.recipeName?.split(',').indexOf(rc.name) >= 0)
  //     .map((rc) => rc.id) || [];
  const currentOneMealGrams = useCallback(
    calcOneMealGramsWithRecipeInfo({
      // selectedRecipeIds: currentRecipeIds,
      selectedRecipeIds: form.recipeIdList,
      allRecipeInfos: recipeInfo?.data || [],
      oneDayRecommendKcal: resultInfo.foodAnalysis?.oneDayRecommendKcal,
      isOriginSubscriber,
    }).map((recipe) => recipe.oneMealGram),
    [recipeInfo.loading, subscribePlanInfo.loading, surveyInfo],
  );

  useEffect(() => {
    if (oneMealGramsForm.current.length === 0) {
      setOneMealGramsForm((prevState) => ({
        ...prevState,
        current: currentOneMealGrams,
      }));
    }
  }, [currentOneMealGrams]);

  // //*** 구독플랜 금액 계산
  const calcSubscribePlanPaymentPrice = useCallback(
    (planName) => {
      if (!form.recipeIdList[0] || !planName || !recipeInfo) {
        return {
          perPack: 0,
          originPrice: 0,
          salePrice: 0,
        };
      }
      const discountPercent = subscribePlanInfo.planDiscountPercent[planName];
      const oneDayRecommendKcal = surveyInfo.foodAnalysis?.oneDayRecommendKcal;
      const pricePerGrams = recipeInfo
        ?.filter((recipe) => form.recipeIdList.indexOf(recipe.id) >= 0)
        .map((recipe) => recipe.pricePerGram);
      const currentRecipeInfos = recipeInfo
        ?.filter((recipe) => form.recipeIdList.indexOf(recipe.id) >= 0)
        .map((recipe) => recipe.name);
      const nextOneMealGrams = calcOneMealGramsWithRecipeInfo({
        selectedRecipeIds: form.recipeIdList,
        allRecipeInfos: recipeInfo,
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

      // console.log('=====', nextOneMealGrams);

      // console.log('::::::', {
      //   discountPercent,
      //   oneMealGrams: nextOneMealGrams,
      //   planName,
      //   pricePerGrams,
      //   isOriginSubscriber,
      //   recipeNameList: currentRecipeInfos,
      // });

      //! [추가] 평균 전체가격, 레시피별 가격
      const { avgPrice, recipePrices } = calcSubscribePrice({
        discountPercent,
        oneMealGrams: nextOneMealGrams,
        planName,
        pricePerGrams,
        isOriginSubscriber,
        recipeNameList: currentRecipeInfos,
        toppingPerPackPriceList,
      });

      return {
        avgPrice, // 평균 전체 가격
        recipePrices, // 레시피별 가격
        // recipePrices: calcPriceList.map(item => ({
        //   name: item.recipeName,
        //   perPack: item.perPack,
        // })),
      };
    },
    // [form.plan, form.recipeIdList, recipeInfo, subscribePlanInfo],
    [form],
  );

  //! 로딩 화면
  if (isLoading.fetching || isRendered) {
    return <Loading />;
  }

  const onClickModalButton = () => {
    mct.alertHide();
  };

  //* '더보기' 클릭
  const dogInfoClickHandler = () => {
    setIsShowResult(!isShowResult);
  };

  const onClickArrowIcon = (e) => {
    e.preventDefault();
    setIsArrowActive(!isArrowActive);
    setRotation((prevRotation) => (prevRotation + 180) % 360);
  };

  //* 레시피 확인하러가기
  const moveToResultHandler = async () => {
    mode === 'default'
      ? router.push(`/survey/result?id=${id}`)
      : router.push(`/mypage/dogs/${id}/result`);
  };

  const onActiveAlertModalHandler = () => {
    setActiveModal(true);
  };

  console.log('surveyInfo===>', surveyInfo);
  console.log('resultInfo===>', resultInfo);
  // console.log('recipeInfo===>', recipeInfo);
  // console.log('recipeDoubleInfo===>', recipeDoubleInfo);
  // console.log('recipeSingleInfo===>', recipeSingleInfo);
  // console.log('form===>', form);
  console.log('etcConcernsData===>', etcConcernsData);

  return (
    <div id="statistics">
      <section
        className={`${mode !== 'mypage' ? s.default : s.mypage} ${s.title}`}
      >
        <header>
          <p className={s.survey_date}>
            {surveyInfo.lastSurveyDate}의 설문 결과입니다
          </p>
        </header>

        <div className={s.result_box_list}>
          {/* 1. 견종 정보 */}
          {surveyInfo.dogType !== '품종 모름' && (
            <>
              <SurveyDogInfo surveyInfo={surveyInfo} />
            </>
          )}

          {/* 2. 건강점수 */}
          <HealthScore
            surveyInfo={surveyInfo}
            scoreInfo={scoreInfo}
            info={info}
          />

          {/* 3. 생식기준 결과 */}
          <section className={`${s.b_right} ${s['analysis-result']}`}>
            <div className={s.left_title}>바프독 기준 결과</div>
            <div className={s.b_right_grid_box}>
              <div className={s.right_text}>
                {info?.myDogName}(이)의 <br /> 하루 권장 <b>칼로리</b>
              </div>
              <div className={s.left_text}>
                {Number(info?.foodAnalysis?.oneDayRecommendKcal).toFixed(0)}{' '}
                Kcal
              </div>
              <div className={s.right_text}>
                {' '}
                {info?.myDogName}(이)의 <br /> 하루 권장 <b>식사량</b>
              </div>
              <div className={s.left_text}>
                {info?.foodAnalysis?.oneDayRecommendGram.toFixed(
                  UnitOfDemicalPointOfOneMealGram,
                )}{' '}
                g
              </div>
              {/* <div className={s.right_text}>
                <p>한끼 권장 식사량</p>
                <span>(하루 두끼 기준)</span>
              </div>
              <div className={s.left_text}>
                {info?.foodAnalysis?.oneMealRecommendGram.toFixed(
                  UnitOfDemicalPointOfOneMealGram,
                )}
                g
              </div> */}
            </div>
            <p>
              ※ 해당 결과는 ‘권장’ 값이오니 보호자님이 지켜봐주시며 급여량을{' '}
              증감해주시는 것이 <br />
              가장 좋습니다! 또한, 안내된 식사량은 ‘하루’ 권장량이오니 반려견의
              끼니 수에 맞춰 나눠 <br />
              급여해주세요 :)
            </p>
          </section>

          <div className={s.divider}></div>

          {/* 4. 추천 레시피 */}
          {surveyInfo.priorityConcerns && (
            <RecommendRecipe surveyInfo={surveyInfo} recipeInfo={recipeInfo} />
          )}

          <div className={s.divider}></div>

          {/* 5. 그 외 고민사항 */}
          {etcConcernsData.length > 0 && (
            <ConcernDetails etcConcernsData={etcConcernsData} />
          )}

          <div className={s.divider}></div>

          {/* 6. 건강점수 그래프  */}
          <HealthScoreAnalysis surveyInfo={surveyInfo} />

          <div className={s.divider}></div>

          {/* 7. 산책  */}
          <WalkingAnalysis surveyInfo={surveyInfo} />

          <div className={s.divider}></div>

          {/* 8. 동일크기 견종 비교  */}
          <DogAnalysis surveyInfo={surveyInfo} info={info} />

          <div
            className={`${s.survey_result_wrapper} animation-show-all-child`}
          >
            {/* <button onClick={onClickArrowIcon}>
                더보기
                <Image
                  src={'/img/survey/survey_arrow.svg'}
                  alt="survey_arrow"
                  width={10}
                  height={10}
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              </button>
            </div> */}
          </div>
        </div>

        {mode === 'mypage' && (
          <button className={s.link} onClick={onPrevPage}>
            마이페이지로 돌아가기
          </button>
        )}
      </section>

      {hasAlert && (
        <Modal_global_alert onClick={onClickModalButton} background />
      )}

      <button
        className={`${s.activated} ${s.moveto_result_btn}`}
        onClick={moveToResultHandler}
      >
        레시피 선택하기
        <FaArrowRight />
      </button>
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
