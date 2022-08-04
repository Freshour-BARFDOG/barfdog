import React, { useEffect, useState } from 'react';
import { getData } from '/src/pages/api/reqData';
import s from './surveyStatistics.module.scss';
import Image from 'next/image';
import Loading from '/src/components/common/Loading';
import { calcDogAgebyMonth } from '/util/func/calcDogAge';
import { dogActivityLevelType } from '/store/TYPE/dogActivityLevelType';
import {dogSizeType} from "/store/TYPE/dogSizeType";

export const SurveyStatistics = ({ id ,  mode = 'default' }) => {
  
  const reportLoadingDuration = 2000;
  const [info, setInfo] = useState({});
  const [isLoading, setIsLoading] = useState({ fetching: true });
  const [isRendered, setIsRendered] = useState(true);
  
  
  useEffect(() => {
    // ! mypage => '강아지' id로 조회
    // ! survey => '설문조사' id로 조회
    const getSurveyReportsApiUrl = mode === 'mypage' ? `/api/dogs/${id}/surveyReport` : `/api/surveyReports/${id}`;
    // console.log(getSurveyReportsApiUrl);
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getSurveyReportsApiUrl);
        console.log(res);
        const data = res.data;
        if (!data) return;
        // console.log(data)
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
            activityGroupThreeCount: data.activityAnalysis.activityGroupThreeCount,
            activityGroupFourCount: data.activityAnalysis.activityGroupFourCount,
            activityGroupFiveCount: data.activityAnalysis.activityGroupFiveCount,
            myActivityGroup: data.activityAnalysis.myActivityGroup, // 내 강아지가 속한 그룹 [1:VERY_LITTLE, 2:LITTLE, 3:NORMAL, 4:MUCH, 5:VERY_MUCH]
          },
          walkingAnalysis: {
            highRankPercent: data.walkingAnalysis.highRankPercent, // 산책량 상위 퍼센트
            walkingCountPerWeek: data.walkingAnalysis.walkingCountPerWeek,
            totalWalingTime: data.walkingAnalysis.totalWalingTime, // 일주일 총 산책 시간
            avgWalkingTimeInCity: data.walkingAnalysis.avgWalkingTimeInCity, // 같은 지역 평균 산책 시간
            avgWalkingTimeInAge: data.walkingAnalysis.avgWalkingTimeInAge, // 또래 평균 산책 시간
            avgWalkingTimeInDogSize: data.walkingAnalysis.avgWalkingTimeInDogSize, // 같은 체급 평균 산책 시간
          },
          snackAnalysis: {
            avgSnackCountInLargeDog: data.snackAnalysis.avgSnackCountInLargeDog, // 대형견 평균 간식 레벨 [1~3] 숫자가 높을수록 간식량 많음
            avgSnackCountInMiddleDog: data.snackAnalysis.avgSnackCountInMiddleDog, // 중형견 평균 간식 레벨 [1~3]
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
              innerKey.indexOf('ageGroup') >= 0 && allDogsAgeCountArr.push(innerVal);
            }
          } else if (key === 'weightAnalysis') {
            for (const innerKey in innerObj) {
              const innerVal = innerObj[innerKey];
              innerKey.indexOf('weightGroup') >= 0 && allDogsWeightCountArr.push(innerVal);
            }
          } else if (key === 'activityAnalysis') {
            for (const innerKey in innerObj) {
              const innerVal = innerObj[innerKey];
              innerKey.indexOf('activityGroup') >= 0 && allDogsActivityCountArr.push(innerVal);
            }
          }
        }
        // add Total dogs count / Each Bar Graph
        DATA.ageAnalysis.totalDogsCount = allDogsAgeCountArr.reduce((acc, cur) => acc + cur);
        DATA.weightAnalysis.totalDogCount = allDogsWeightCountArr.reduce((acc, cur) => acc + cur);
        DATA.activityAnalysis.totalDogCount = allDogsWeightCountArr.reduce((acc, cur) => acc + cur);

        const _percentDATA = JSON.parse(JSON.stringify(DATA));
        for (const key in _percentDATA) {
          const innerObj = _percentDATA[key];
          if (key === 'ageAnalysis') {
            const filteredObj = transformPercentUnitInGroup(innerObj, 'ageGroup');
            _percentDATA[key] = filter_objectInGroup(filteredObj, 'ageGroup').map((obj, index) => {
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
            const filteredObj = transformPercentUnitInGroup(innerObj, 'weightGroup');
            _percentDATA[key] = filter_objectInGroup(filteredObj, 'weightGroup').map((obj, index) => {
              const groupOrder = index + 1;
              let tempObj = {};
              for (const key in obj) {
                tempObj = {
                  degree: Object.values(obj)[0],
                  inGroup: groupOrder === _percentDATA.weightAnalysis.myWeightGroup
                };
              }
              return tempObj;
            });
            // _percentDATA[key] = transformPercentUnitInGroup(innerObj, 'weightGroup');
          } else if (key === 'activityAnalysis') {
            const filteredObj = transformPercentUnitInGroup(innerObj, 'activityGroup');
            _percentDATA[key] = filter_objectInGroup(filteredObj, 'activityGroup').map((obj, index) => {
              const groupOrder = index + 1;
              let tempObj = {};
              for (const key in obj) {
                tempObj = {
                  degree: Object.values(obj)[0],
                  inGroup: groupOrder === _percentDATA.activityAnalysis.myActivityGroup,
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

        // console.log('_percentDATA: ',_percentDATA);
        // console.log(DATA);
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



  if (isLoading.fetching || isRendered) {
    return <Loading />;
  }

  return (
    <div id="statistics">
      <section className={`${mode !== 'mypage' ? s.default : s.mypage} ${s.title}`}>
        {info.myDogName}의 맞춤 레포트
        <span>{info.lastSurveyDate} 설문결과</span>
      </section>
      <main className={`${s.grid_container_box} animation-show-all-child`}>
        <div className={s.grid_container}>
          <section className={s.top}>
            <div className={s.flex_box}>
              {/* 왼쪽박스 */}
              <div className={s.box}>
                <p>바프독을 시작하는 나이</p>
                <div className={s.stick_box}>
                  {info?._percentDATA?.ageAnalysis.length &&
                    info?._percentDATA?.ageAnalysis.map((data, index) => (
                      <span
                        key={`ageAnanysis-${index}`}
                        className={`${data.inGroup ? s.stick_red : s.stick}`}
                        style={{ height: data.degree }}
                      ></span>
                    ))}
                </div>

                <div className={s.top_text_box}>
                  <div className={s.top_text_row1}>
                    <div className={s.left_text}>전체 평균</div>
                    <div className={s.right_text}>
                      {calcDogAgebyMonth(info.ageAnalysis?.avgAgeMonth)}
                    </div>
                  </div>
                  <div className={s.top_text_row2}>
                    <div className={s.left_text}>{info.myDogName}</div>
                    <div className={s.right_text}>
                      {calcDogAgebyMonth(info.ageAnalysis?.myStartAgeMonth)}
                    </div>
                  </div>
                </div>
              </div>

              {/* 가운데박스 */}
              <div className={s.box}>
                <p>{info.dogSize} 평균 체중</p>

                <div className={s.stick_box}>
                  {info?._percentDATA?.weightAnalysis.length &&
                    info?._percentDATA?.weightAnalysis.map((data, index) => (
                      <span
                        key={`ageAnanysis-${index}`}
                        className={`${data.inGroup ? s.stick_red : s.stick}`}
                        style={{ height: data.degree }}
                      ></span>
                    ))}
                </div>

                <div className={s.top_text_box}>
                  <div className={s.top_text_row1}>
                    <div className={s.left_text}>{info.dogSize} 평균</div>
                    <div className={s.right_text}>{info.weightAnalysis?.avgWeight}kg</div>
                  </div>
                  <div className={s.top_text_row2}>
                    <div className={s.left_text}>{info.myDogName}</div>
                    <div className={s.right_text}>{info?.weightAnalysis?.weightInLastReport}kg</div>
                  </div>
                </div>
              </div>

              {/* 오른쪽 박스 */}
              <div className={s.box}>
                <p>{info.dogSize} 평균 활동량</p>

                <div className={s.stick_box}>
                  {info?._percentDATA?.activityAnalysis.length &&
                    info?._percentDATA?.activityAnalysis.map((data, index) => (
                      <span
                        key={`ageAnanysis-${index}`}
                        className={`${data.inGroup ? s.stick_red : s.stick}`}
                        style={{ height: data.degree }}
                      ></span>
                    ))}
                </div>

                <div className={s.top_text_box}>
                  <div className={s.top_text_row1}>
                    <div className={s.left_text}>전체 평균</div>
                    <div className={s.right_text}>
                      {dogActivityLevelType.KOR[info?.activityAnalysis?.avgActivityLevel]}
                    </div>
                  </div>
                  <div className={s.top_text_row2}>
                    <div className={s.left_text}>{info?.myDogName}</div>
                    <div className={s.right_text}>
                      {
                        dogActivityLevelType.KOR[
                          info?.activityAnalysis?.avgActivityLevel
                        ]
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className={s.left}>
            <div className={s.left_title}>{info?.myDogName}의 산책 점검</div>

            <div className={s.left_flex_box1}>
              <div className={s.left_box}>
                <p>산책 점수</p>
                <div className={s.left_box_text}>
                  상위 {info?.walkingAnalysis?.highRankPercent}%
                </div>
              </div>
              <div className={s.right_box}>
                <div className={s.row_1}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require('public/img/mypage/statistic_dog_walker.png')}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                  일주일 산책 횟수
                </div>
                <p>{info?.walkingAnalysis?.walkingCountPerWeek}회</p>

                <div className={s.row_2}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require('public/img/mypage/statistic_dog_walker2.png')}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                  일주일 총 산책 시간
                </div>
                <p>{info?.walkingAnalysis?.totalWalingTime}시간</p>
              </div>
            </div>

            <div className={s.left_title}>
              견종별 산책시간
              <p>(일주일 기준)</p>
            </div>

            <div className={s.left_flex_box2}>
              <div className={s.content_box}>
                <div className={s.left_stick_box}>
                  <span
                    className={s.stick}
                    style={{
                      height: `${info?._percentDATA?.walkingAnalysis.inCity}`,
                    }}
                  ></span>
                  <span
                    className={s.stick_red}
                    style={{
                      height: `${info?._percentDATA?.walkingAnalysis.myDog}`,
                    }}
                  ></span>
                </div>
                우리지역에서
              </div>

              <div className={s.content_box}>
                <div className={s.left_stick_box}>
                  <span
                    className={s.stick}
                    style={{
                      height: `${info?._percentDATA?.walkingAnalysis.inAge}`,
                    }}
                  ></span>
                  <span
                    className={s.stick_red}
                    style={{
                      height: `${info?._percentDATA?.walkingAnalysis.myDog}`,
                    }}
                  ></span>
                </div>
                또래 중에서
              </div>

              <div className={s.content_box}>
                <div className={s.left_stick_box}>
                  <span
                    className={s.stick}
                    style={{
                      height: `${info?._percentDATA?.walkingAnalysis.inDogSize}`,
                    }}
                  ></span>
                  <span
                    className={s.stick_red}
                    style={{
                      height: `${info?._percentDATA?.walkingAnalysis.myDog}`,
                    }}
                  ></span>
                </div>
                {info.dogSize} 중에서
              </div>
            </div>
          </section>

          <section className={s.t_right}>
            <div className={s.left_title}>견종별 간식 횟수</div>

            <div className={s.t_right_grid_box}>
              <div>대형견</div>
              <span
                className={s.horizon_stick}
                style={{
                  width: `${info?._percentDATA?.snackAnalysis.avgSnackCountInLargeDog}`,
                }}
              ></span>
              <div>중형견</div>
              <span
                className={s.horizon_stick}
                style={{
                  width: `${info?._percentDATA?.snackAnalysis.avgSnackCountInMiddleDog}`,
                }}
              ></span>
              <div>소형견</div>
              <span
                className={s.horizon_stick}
                style={{
                  width: `${info?._percentDATA?.snackAnalysis.avgSnackCountInSmallDog}`,
                }}
              ></span>
              <div className={s.hero_name}>{info.myDogName}</div>
              <span
                className={s.horizon_stick_red}
                style={{
                  width: `${info?._percentDATA?.snackAnalysis.mySnackCount}`,
                }}
              ></span>
            </div>
          </section>

          <section className={`${s.b_right} ${s['analysis-result']}`}>
            <div className={s.left_title}>바프독 생식기준 결과</div>
            <div className={s.b_right_grid_box}>
              <div className={s.right_text}>
                <em>{info?.myDogName}의 <br /> 하루 권장 칼로리</em>
              </div>
              <div className={s.left_text}>
                {Number(info?.foodAnalysis?.oneDayRecommendKcal).toFixed(0)}kcal
              </div>
              <div className={s.right_text}>하루 권장 식사량</div>
              <div className={s.left_text}>{info?.foodAnalysis?.oneDayRecommendGram}g</div>
              <div className={s.right_text}>
                <p>한끼 권장 식사량</p>
                <span>(하루 두끼 기준)</span>
              </div>
              <div className={s.left_text}>{info?.foodAnalysis?.oneMealRecommendGram}g</div>
            </div>
          </section>
        </div>
      </main>
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
      // console.log('percentUnit', percentUnit)
      // console.log('KEY', key, '&',targetString ,key.indexOf(targetString))
      obj[key] =
        typeof val === 'number' && key.indexOf(targetString) >= 0 ? percentUnit + '%' : val;
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
    key.indexOf(keyword) >= 0 && filteredGroup.push({ [key]: val, inGroup: false });
  }
  return filteredGroup;
};
