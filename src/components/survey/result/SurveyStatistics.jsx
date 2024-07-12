import React, { useEffect, useState } from 'react';
import { getData } from '/src/pages/api/reqData';
import s from './surveyStatistics.module.scss';
import Loading from '/src/components/common/Loading';
import { calcDogAgebyMonth } from '/util/func/calcDogAge';
import { dogActivityLevelType } from '/store/TYPE/dogActivityLevelType';
import { dogSizeType } from '/store/TYPE/dogSizeType';
import Btn_01 from '/public/img/mypage/statistic_dog_walker.svg';
import Btn_02 from '/public/img/mypage/statistic_dog_walker2.svg';
// import Logo from '/public/img/survey/logo_result.jpg';
// import ResultLine from '/public/img/survey/survey_result_line.png';

import { UnitOfDemicalPointOfOneMealGram } from '../../../../util/func/subscribe/finalVar';
import Image from 'next/image';
import { useSelector } from 'react-redux';

export const SurveyStatistics = ({ id, mode = 'default' }) => {
  const auth = useSelector((state) => state.auth);
  const userData = auth.userInfo;
  const surveyData = useSelector((state) => state.surveyData.surveyData);
  const reportLoadingDuration = 2000;
  const [info, setInfo] = useState({});
  const [surveyInfo, setSurveyInfo] = useState({});
  const [userInfo, setUserInfo] = useState(userData);
  const [isLoading, setIsLoading] = useState({ fetching: true });
  const [isRendered, setIsRendered] = useState(true);
  // const dogInfoResults = useSelector((state) => state.surveyDog.surveyDog);

  const [isMouseEnter, setIsMouseEnter] = useState(false);
  const [isShowResultIdx, setIsShowResultIdx] = useState(null);
  const [isActiveDogIdx, setIsActiveDogIdx] = useState('');

  // console.log('surveyData>>>', surveyData);

  const handleMouseEnter = () => {
    setIsMouseEnter(true);
  };
  const handleMouseLeave = () => {
    setIsMouseEnter(false);
  };

  // console.log('dogInfoResults>>>', dogInfoResults);
  console.log('isActiveDogIdx>>>', isActiveDogIdx);
  console.log('id>>>', id);
  console.log('userData>>>', userData);

  useEffect(() => {
    // if (!idList || !idList.length) return;

    const idList = id.split(',');

    // ! mypage => '강아지' id로 조회
    // ! survey => '설문조사' id로 조회
    // const getSurveyReportsApiUrl =
    //   mode === 'mypage'
    //     ? `/api/dogs/${id}/surveyReport`
    //     : `/api/surveyReports/${id}`;

    const promises = idList.map(async (id) => {
      const apiUrl = `/api/surveyReports/${id}`;
      const res = await getData(apiUrl);
      return res.data;
    });

    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const responses = await Promise.all(promises); // Wait for all API calls to finish
        // console.log('responses===>', responses);
        const dataArr = responses.filter((res) => res);
        setSurveyInfo(dataArr);

        if (!dataArr.length) {
          console.error('No data received from API calls.');
          setIsLoading((prevState) => ({
            ...prevState,
            fetching: false,
          }));
          return;
        }

        // // console.log(data)
        const data = dataArr[0];
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

  // 로딩 화면
  if (isLoading.fetching || isRendered) {
    return <Loading />;
  }

  // 설문 조사 결과 !
  console.log('info>>>', info);
  // 배열로 받을 예정

  //*** '더보기' 클릭
  const dogInfoClickHandler = (surveyId, index) => {
    setIsShowResultIdx(index);
    // setIsActiveDogIdx((prevIndex) => (prevIndex === index ? '' : index));

    // const getSurveyReportsApiUrl = `/api/surveyReports/${surveyId}`;

    // async () => {
    //   try {
    //     // setIsLoading((prevState) => ({
    //     //   ...prevState,
    //     //   fetching: true,
    //     // }));
    //     const res = await getData(getSurveyReportsApiUrl);
    //     // console.log(res);
    //     const data = res.data;
    //     if (!data) return;
    //     // // console.log(data)
    //     const DATA = {
    //       lastSurveyDate: data.lastSurveyDate,
    //       myDogName: data.myDogName,
    //       dogSize: dogSizeType.KOR[data.dogSize],
    //       ageAnalysis: {
    //         // 바프독을 시작한 평균 나이
    //         avgAgeMonth: data.ageAnalysis.avgAgeMonth, // 나이 단위 : 1년미만 -> 개월 / 1년이상 -> 살
    //         ageGroupOneCount: data.ageAnalysis.ageGroupOneCount, // 1그룹(가장어린)에 포함된 강아지 수
    //         ageGroupTwoCount: data.ageAnalysis.ageGroupTwoCount,
    //         ageGroupThreeCount: data.ageAnalysis.ageGroupThreeCount,
    //         ageGroupFourCount: data.ageAnalysis.ageGroupFourCount,
    //         ageGroupFiveCount: data.ageAnalysis.ageGroupFiveCount,
    //         myAgeGroup: data.ageAnalysis.myAgeGroup, // 내 강아지가 속한 그룹
    //         myStartAgeMonth: data.ageAnalysis.myStartAgeMonth, // 내 강아지가 바프독을 시작한 나이
    //       },
    //       weightAnalysis: {
    //         avgWeight: data.weightAnalysis.avgWeight,
    //         weightGroupOneCount: data.weightAnalysis.weightGroupOneCount, // 해당 체급 중 1그룹(가장가벼운)에 포함된 강아지 수
    //         weightGroupTwoCount: data.weightAnalysis.weightGroupTwoCount,
    //         weightGroupThreeCount: data.weightAnalysis.weightGroupThreeCount,
    //         weightGroupFourCount: data.weightAnalysis.weightGroupFourCount,
    //         weightGroupFiveCount: data.weightAnalysis.weightGroupFiveCount,
    //         myWeightGroup: data.weightAnalysis.myWeightGroup, // 내 강아지가 속한 그룹
    //         weightInLastReport: data.weightAnalysis.weightInLastReport, // 마지막으로 설문조사 했을 때 강아지 체중
    //       },
    //       activityAnalysis: {
    //         avgActivityLevel: data.activityAnalysis.avgActivityLevel, // 해당 체급의 평균 활동량
    //         activityGroupOneCount: data.activityAnalysis.activityGroupOneCount, // 해당 체급 중 1그룹(활동량 가장 낮은)에 포함된 강아지 수
    //         activityGroupTwoCount: data.activityAnalysis.activityGroupTwoCount,
    //         activityGroupThreeCount:
    //           data.activityAnalysis.activityGroupThreeCount,
    //         activityGroupFourCount:
    //           data.activityAnalysis.activityGroupFourCount,
    //         activityGroupFiveCount:
    //           data.activityAnalysis.activityGroupFiveCount,
    //         myActivityGroup: data.activityAnalysis.myActivityGroup, // 내 강아지가 속한 그룹 [1:VERY_LITTLE, 2:LITTLE, 3:NORMAL, 4:MUCH, 5:VERY_MUCH]
    //       },
    //       walkingAnalysis: {
    //         highRankPercent: data.walkingAnalysis.highRankPercent, // 산책량 상위 퍼센트
    //         walkingCountPerWeek: data.walkingAnalysis.walkingCountPerWeek,
    //         totalWalingTime: data.walkingAnalysis.totalWalingTime, // 일주일 총 산책 시간
    //         avgWalkingTimeInCity: data.walkingAnalysis.avgWalkingTimeInCity, // 같은 지역 평균 산책 시간
    //         avgWalkingTimeInAge: data.walkingAnalysis.avgWalkingTimeInAge, // 또래 평균 산책 시간
    //         avgWalkingTimeInDogSize:
    //           data.walkingAnalysis.avgWalkingTimeInDogSize, // 같은 체급 평균 산책 시간
    //       },
    //       snackAnalysis: {
    //         avgSnackCountInLargeDog: data.snackAnalysis.avgSnackCountInLargeDog, // 대형견 평균 간식 레벨 [1~3] 숫자가 높을수록 간식량 많음
    //         avgSnackCountInMiddleDog:
    //           data.snackAnalysis.avgSnackCountInMiddleDog, // 중형견 평균 간식 레벨 [1~3]
    //         avgSnackCountInSmallDog: data.snackAnalysis.avgSnackCountInSmallDog, // 소형견 평균 간식 레벨 [1~3]
    //         mySnackCount: data.snackAnalysis.mySnackCount, // 내 강아지 간식량 [1,2,3]
    //       },
    //       foodAnalysis: {
    //         oneDayRecommendKcal: data?.foodAnalysis.oneDayRecommendKcal, // 하루 권장 칼로리
    //         oneDayRecommendGram: data?.foodAnalysis.oneDayRecommendGram, // 하루 권장 식사량
    //         oneMealRecommendGram: data?.foodAnalysis.oneMealRecommendGram, // 한끼 권장 식사량
    //       },
    //     };

    //     const allDogsAgeCountArr = [];
    //     const allDogsWeightCountArr = [];
    //     const allDogsActivityCountArr = [];
    //     for (const key in DATA) {
    //       const innerObj = DATA[key];
    //       // STEP 1. get Total Dog Count
    //       if (key === 'ageAnalysis') {
    //         for (const innerKey in innerObj) {
    //           const innerVal = innerObj[innerKey];
    //           innerKey.indexOf('ageGroup') >= 0 &&
    //             allDogsAgeCountArr.push(innerVal);
    //         }
    //       } else if (key === 'weightAnalysis') {
    //         for (const innerKey in innerObj) {
    //           const innerVal = innerObj[innerKey];
    //           innerKey.indexOf('weightGroup') >= 0 &&
    //             allDogsWeightCountArr.push(innerVal);
    //         }
    //       } else if (key === 'activityAnalysis') {
    //         for (const innerKey in innerObj) {
    //           const innerVal = innerObj[innerKey];
    //           innerKey.indexOf('activityGroup') >= 0 &&
    //             allDogsActivityCountArr.push(innerVal);
    //         }
    //       }
    //     }
    //     // add Total dogs count / Each Bar Graph
    //     DATA.ageAnalysis.totalDogsCount = allDogsAgeCountArr.reduce(
    //       (acc, cur) => acc + cur,
    //     );
    //     DATA.weightAnalysis.totalDogCount = allDogsWeightCountArr.reduce(
    //       (acc, cur) => acc + cur,
    //     );
    //     DATA.activityAnalysis.totalDogCount = allDogsWeightCountArr.reduce(
    //       (acc, cur) => acc + cur,
    //     );

    //     const _percentDATA = JSON.parse(JSON.stringify(DATA));
    //     for (const key in _percentDATA) {
    //       const innerObj = _percentDATA[key];
    //       if (key === 'ageAnalysis') {
    //         const filteredObj = transformPercentUnitInGroup(
    //           innerObj,
    //           'ageGroup',
    //         );
    //         _percentDATA[key] = filter_objectInGroup(
    //           filteredObj,
    //           'ageGroup',
    //         ).map((obj, index) => {
    //           const groupOrder = index + 1;
    //           let tempObj = {};
    //           for (const key in obj) {
    //             tempObj = {
    //               degree: Object.values(obj)[0],
    //               inGroup: groupOrder === _percentDATA.ageAnalysis.myAgeGroup,
    //             };
    //           }
    //           return tempObj;
    //         });
    //       } else if (key === 'weightAnalysis') {
    //         const filteredObj = transformPercentUnitInGroup(
    //           innerObj,
    //           'weightGroup',
    //         );
    //         _percentDATA[key] = filter_objectInGroup(
    //           filteredObj,
    //           'weightGroup',
    //         ).map((obj, index) => {
    //           const groupOrder = index + 1;
    //           let tempObj = {};
    //           for (const key in obj) {
    //             tempObj = {
    //               degree: Object.values(obj)[0],
    //               inGroup:
    //                 groupOrder === _percentDATA.weightAnalysis.myWeightGroup,
    //             };
    //           }
    //           return tempObj;
    //         });
    //         // _percentDATA[key] = transformPercentUnitInGroup(innerObj, 'weightGroup');
    //       } else if (key === 'activityAnalysis') {
    //         const filteredObj = transformPercentUnitInGroup(
    //           innerObj,
    //           'activityGroup',
    //         );
    //         _percentDATA[key] = filter_objectInGroup(
    //           filteredObj,
    //           'activityGroup',
    //         ).map((obj, index) => {
    //           const groupOrder = index + 1;
    //           let tempObj = {};
    //           for (const key in obj) {
    //             tempObj = {
    //               degree: Object.values(obj)[0],
    //               inGroup:
    //                 groupOrder ===
    //                 _percentDATA.activityAnalysis.myActivityGroup,
    //             };
    //           }
    //           return tempObj;
    //         });
    //         // _percentDATA[key] = transformPercentUnitInGroup(innerObj, 'activityGroup');
    //       } else if (key === 'snackAnalysis') {
    //         _percentDATA[key] = transformPercentUnitInGroup(innerObj);
    //       } else if (key === 'walkingAnalysis') {
    //         const targetObj = {
    //           myDog: DATA.walkingAnalysis.totalWalingTime,
    //           inCity: DATA.walkingAnalysis.avgWalkingTimeInCity,
    //           inAge: DATA.walkingAnalysis.avgWalkingTimeInAge,
    //           inDogSize: DATA.walkingAnalysis.avgWalkingTimeInDogSize,
    //         };
    //         const resultObj = transformPercentUnitInGroup(targetObj);
    //         _percentDATA[key] = resultObj;
    //       }
    //     }

    //     // // console.log('_percentDATA: ',_percentDATA);
    //     // // console.log(DATA);
    //     const allDATA = {
    //       ...DATA,
    //       _percentDATA,
    //     };
    //     setInfo(allDATA);
    //     setIsRendered(false);
    //   } catch (err) {
    //     console.error(err);
    //     console.error('데이터를 가져올 수 없습니다.');
    //   }
    // };
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
  console.log('isShowResultIdx===>', isShowResultIdx);

  return (
    <div id="statistics">
      <section
        className={`${mode !== 'mypage' ? s.default : s.mypage} ${s.title}`}
      >
        <h1>{userInfo.name} 보호자님의 가족</h1>
        <div className={s.result_box_list}>
          {/* 견종 결과 */}
          {surveyInfo.map((dogInfo, index) => (
            <div
              key={index}
              className={`${s.dog_img_wrapper} ${
                isShowResultIdx ? s.active : ''
              }`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => dogInfoClickHandler(dogInfo.surveyId, index)}
            >
              <div className={s.dog_info_wrapper}>
                <div className={s.dog_info_name}>
                  {dogInfo.myDogName} (이)의 건강 상태를 분석한 결과입니다.
                </div>

                {/* '더보기' 버튼 클릭 시  */}
                {index === isShowResultIdx ? (
                  <div className={s.survey_result_wrapper}>
                    <div className={s.box_line}></div>
                    <main
                      className={`${s.grid_container_box} animation-show-all-child`}
                    >
                      <div className={s.top_tab_container}>
                        현재 6살 , 중성화를{' '}
                        <span className={s.under_text}>
                          {' '}
                          {dogInfo.neutralization ? '한' : '하지 않은'}
                        </span>{' '}
                        {dogInfo.myDogName}
                        <br />
                        <span className={s.under_text}>
                          {dogInfo.dogSize === 'LARGE'
                            ? '대형견'
                            : dogInfo.dogSize === 'MIDDLE'
                            ? '중형견'
                            : dogInfo.dogSize === 'SMALL'
                            ? '소형견'
                            : ''}{' '}
                        </span>
                        이고,{' '}
                        <span className={s.under_text}> {dogInfo.dogType}</span>
                        인 {dogInfo.myDogName}
                        <br />
                        <span className={s.under_text}>
                          {' '}
                          {dogInfo.priorityConcerns}
                        </span>{' '}
                        가 고민인 {dogInfo.myDogName}는{' '}
                        <span className={s.under_text}>
                          {dogInfo.dogStatus === 'HEALTHY'
                            ? '건강해요'
                            : dogInfo.dogSize === 'NEED_DIET'
                            ? '다이어트가 필요해요'
                            : dogInfo.dogSize === 'OBESITY'
                            ? '심각한 비만입니다'
                            : dogInfo.dogSize === 'THIN'
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

                    <div className={s.dog_info_name}>
                      바프독을 통해 이런 도움을 받을 수 있어요!
                    </div>
                  </div>
                ) : (
                  <button className={s.dog_info_show_btn}>더보기</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <span className={s.result_description}>
          더보기를 클릭하여 레시피와 플랜을 선택하여 주세요
        </span>
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
