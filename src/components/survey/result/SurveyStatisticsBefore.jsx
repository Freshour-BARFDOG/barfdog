import React, { useEffect, useState } from 'react';
import s from './surveyStatistics.module.scss';
import Loading from '/src/components/common/Loading';
import { dogSizeType } from '/store/TYPE/dogSizeType';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import TagChart from './TagChart';
import { Swiper_product } from './Swiper_product';
import {
  transformPercentUnitInGroup,
  filter_objectInGroup,
} from './SurveyStatistics';

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
  // const [isMouseEnter, setIsMouseEnter] = useState(false);
  const [isShowResultIdx, setIsShowResultIdx] = useState([]);
  // const [isReadyIdx, setIsReadyIdx] = useState([]);
  const [isActiveDogIdx, setIsActiveDogIdx] = useState('');

  const [isArrowActive, setIsArrowActive] = useState(false);
  const [rotation, setRotation] = useState(0);

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

  useEffect(() => {
    // if (!idList || !idList.length) return;
    const idList = id.split(',');

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
        //! [수정] 다견일 경우
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

  //! 로딩 화면
  if (isLoading.fetching || isRendered) {
    return <Loading />;
  }

  // 설문 조사 결과 !
  console.log('info>>>', info);
  // 배열로 받을 예정
  //*** '더보기' 클릭
  const dogInfoClickHandler = (surveyId, index) => {
    if (!isShowResultIdx.includes(index)) {
      // 클릭한 index가 배열에 없으면 추가
      setIsShowResultIdx([...isShowResultIdx, index]);
    } else {
      // 클릭한 index가 배열에 있으면 제거
      setIsShowResultIdx(isShowResultIdx.filter((item) => item !== index));
    }
  };

  const onClickArrowIcon = (e) => {
    e.preventDefault();
    setIsArrowActive(!isArrowActive);
    setRotation((prevRotation) => (prevRotation + 180) % 360);
  };

  // const getRandomPosition = () => {
  //   const randomX = Math.floor(Math.random() * 201) - 100; // -100 ~ 100 사이의 랜덤 X 좌표
  //   const randomY = Math.floor(Math.random() * 201) - 100; // -100 ~ 100 사이의 랜덤 Y 좌표
  //   return { transform: `translate(${randomX}px, ${randomY}px)` };
  // };
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
          {surveyInfo?.map((dogInfo, index) => (
            <div
              key={index}
              className={`${s.dog_img_wrapper} ${
                isShowResultIdx ? s.active : ''
              }`}
            >
              <div className={s.dog_info_wrapper}>
                <div className={s.dog_info_name}>
                  {dogInfo.myDogName} (이)의 건강 상태를 분석한 결과입니다.
                </div>

                {/* '더보기' 버튼 클릭 시  */}
                {isShowResultIdx.includes(index) ? (
                  <div
                    className={`${s.survey_result_wrapper} animation-show-all-child`}
                  >
                    <div className={s.box_line}></div>
                    {/* 1. 설문조사 정보 */}
                    <main className={`${s.grid_container_box}`}>
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
                            집회·결사에 대한 허가는 인정되지 아니한다. 학교교육
                            및 평생교육을 포함한 교육제도와 그 운영, 교육재정 및
                            교원의 지위에 관한 기본적인 사항은 법률로 정한다.
                          </div>
                        </li>
                        <li>
                          <h2>#다이어트필요</h2>
                          <div>
                            국가는 노인과 청소년의 복지향상을 위한 정책을 실시할
                            의무를 진다. 언론·출판에 대한 허가나 검열과
                            집회·결사에 대한 허가는 인정되지 아니한다. 학교교육
                            및 평생교육을 포함한 교육제도와 그 운영, 교육재정 및
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
                    <div className={s.recipe_container}>
                      <div className={s.recipe_title}>
                        {dogInfo.myDogName} (을)를 위한 <span>레시피</span>를
                        선택해 주세요
                        <div className={s.recipe_title_info}>
                          <strong>최대 2가지</strong>까지 레시피 선택이
                          가능합니다
                        </div>
                      </div>

                      {/* 3-1) 더블 */}
                      <div className={s.recipe_box}>
                        <h3>[ 더블미트(복합 단백질) 레시피 ]</h3>
                        <ul>
                          <li>
                            <div>스타터 프리미엄+</div>
                            <div>dsfsdfds</div>
                            <button>자세히 알아보기</button>
                          </li>
                          <li>
                            {' '}
                            <div>스타터 프리미엄+</div>
                            <div>dsfsdfds</div>
                            <button>자세히 알아보기</button>
                          </li>
                          <li>
                            {' '}
                            <div>스타터 프리미엄+</div>
                            <div>dsfsdfds</div>
                            <button>자세히 알아보기</button>
                          </li>
                        </ul>
                      </div>

                      {/* 3-2) 싱글 */}
                      <div className={s.recipe_box}>
                        <h3> [ 싱글미트(단일 단백질) 레시피 ]</h3>
                        <ul>
                          <li>
                            <div>스타터 프리미엄+</div>
                            <div>dsfsdfds</div>
                            <button>자세히 알아보기</button>
                          </li>
                          <li>
                            {' '}
                            <div>스타터 프리미엄+</div>
                            <div>dsfsdfds</div>
                            <button>자세히 알아보기</button>
                          </li>
                          <li>
                            {' '}
                            <div>스타터 프리미엄+</div>
                            <div>dsfsdfds</div>
                            <button>자세히 알아보기</button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className={s.box_dot_divider}></div>

                    {/* 4. 플랜 선택 */}
                    <div className={s.plan_container}>
                      <div className={s.plan_title}>
                        {dogInfo.myDogName} (을)를 위한 <span>플랜</span>을
                        선택해 주세요
                        <div className={s.plan_title_info}>
                          풀플랜: 2주 마다 배송 / 하프플랜: 4주마다 배송
                        </div>
                      </div>
                      {/* 4-1) 플랜 선택 */}
                      <ul>
                        <li>
                          <div className={s.plan_name}>풀플랜</div>

                          <div className={s.plan_info}>
                            하루 <strong>2끼</strong> / 2주 간격 배송 / 총 28팩
                          </div>
                        </li>
                        <li>
                          <div className={s.plan_name}>풀플랜</div>
                          <div className={s.plan_info}>
                            하루 <strong>2끼</strong> / 2주 간격 배송 / 총 28팩
                          </div>
                        </li>
                        <li>
                          <div className={s.plan_name}>풀플랜</div>
                          <div className={s.plan_info}>
                            하루 <strong>2끼</strong> / 2주 간격 배송 / 총 28팩
                          </div>
                        </li>
                        <li>
                          <div className={s.plan_name}>풀플랜</div>
                          <div className={s.plan_info}>
                            하루 <strong>2끼</strong> / 2주 간격 배송 / 총 28팩
                          </div>
                        </li>
                      </ul>
                      {/* 4-2) 끼니, 팩 */}
                      <div className={s.pack_box}>
                        {/* (1) 선택 레시피 */}
                        {/* 하프플랜, 풀플랜 선택에 따라 보여지는 칸 수가 달라지도록 */}
                        <div className={s.one_pack_row}>
                          <div className={s.one_pack_text}>
                            선택 레시피: <br />
                            (1팩 기준)
                          </div>
                          <div className={s.recipe_text}>
                            <p>000g</p>{' '}
                            <p className={s.recipe_name}>스타터프리미엄</p>
                          </div>
                          <div className={s.recipe_text}>
                            <p>000g</p>{' '}
                            <p className={s.recipe_name}>스타터프리미엄</p>
                          </div>
                        </div>

                        {/* (2) 한 끼당 */}
                        <div className={s.one_pack_row}>
                          <div className={s.one_pack_text}>한 끼당:</div>
                          <div className={s.recipe_text}>
                            <p>0,000원</p>{' '}
                          </div>
                          <div className={s.recipe_text}>
                            <p>0,000원</p>{' '}
                          </div>
                        </div>

                        {/* (3) 팩 수 */}
                        <div className={s.one_pack_row}>
                          <div className={s.one_pack_text}>팩수:</div>
                          <div className={s.recipe_text}>
                            <p>14팩</p>{' '}
                          </div>
                          <div className={s.recipe_text}>
                            <p>14팩</p>{' '}
                          </div>
                        </div>

                        {/* (4) 최대 할인가 */}
                        {/* - 결제페이지의 12개월 구독 혜택인 최대 '25%할인'가로 노출 */}
                        {/* - 1회 배송 시 최대 할인가(25%)로 노출! */}
                        <div className={s.discount_price_row}>
                          <div className={s.one_pack_text}>최대 할인가:</div>
                          <div className={s.recipe_text}>
                            <p>00,000원</p>{' '}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 5. 챙겨줄 제품 - Swiper */}
                    <div className={s.recommend_product_container}>
                      {dogInfo.myDogName} (이)에게 더 챙겨줄 제품은 없을까요?
                      <div className={s.recommend_product_title}>
                        함게 구독하면 좋은 일반 상품도 살펴보세요!
                      </div>
                      <Swiper_product />
                    </div>

                    {/* 6. 닫기 버튼 */}
                    <div className={s.close_btn_wrapper}>
                      <button
                        className={s.close_btn}
                        onClick={() =>
                          dogInfoClickHandler(dogInfo.surveyId, index)
                        }
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
                    </div>
                  </div>
                ) : (
                  <div className={s.dog_info_show_btn_wrapper}>
                    <div className={s.empty_div}></div>
                    <button
                      className={s.dog_info_show_btn}
                      onClick={() =>
                        dogInfoClickHandler(dogInfo.surveyId, index)
                      }
                    >
                      더보기{' '}
                      <Image
                        src={'/img/survey/survey_arrow.svg'}
                        alt="survey_arrow"
                        width={10}
                        height={10}
                      />
                    </button>
                    {/* <div
                              className={s.dog_info_ready_btn}
                              onClick={() =>
                                dogInfoClickHandler(dogInfo.surveyId, index)
                              }
                            >
                              결제준비 {isReadyIdx.includes(index) ? '완료' : '전'}
                            </div> */}
                  </div>
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
