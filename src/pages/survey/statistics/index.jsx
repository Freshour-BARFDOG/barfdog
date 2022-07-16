import React, { useEffect, useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from 'src/pages/survey/statistics/index.module.scss';
import Image from 'next/image';
import { getData } from '/src/pages/api/reqData';
import axios from 'axios';
import Loading from '../../../components/common/Loading';

export default function SurveyStatisticsPage() {
  const [isLoading, setIsLoading] = useState({ fetching: true });
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    let dogId;
    const getSurveyReportApiUrl = `/api/surveyReports/${dogId}`;
    const getDogInfoApiUrl = `/api/dogs/${dogId}/surveyReportResult`;

    (async () => {
      /// ---------------- TEST ---------------- ///
      const getAllDogListApiUrl = `/api/dogs`;
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getAllDogListApiUrl);
        const data = res.data;
        const userDogs = data._embedded.queryDogsDtoList;
        console.log(userDogs);
        dogId = userDogs[1].id;
      } catch (err) {
        // console.error(err.response);
        // alert('데이터를 가져올 수 없습니다.');
      }
      /// ---------------- TEST ---------------- ///

      const surveyDATA = await getSurveyReport(getSurveyReportApiUrl);

      console.log(dogId);
      setTimeout(() => {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: false,
        }));
      }, 3000);

      // axios.defaults.baseURL = 'http://localhost:4000/';
      // const res = await axios.get(`/api/self/surveyReports/${dogId}`)
    })();
  }, []);
  
  
  
  return (
    <>
      <MetaTitle title="설문조사 통계" />
      <Layout>
        <Wrapper>
  
          {isLoading.fetching ? <Loading /> :   <div id="statistics">
            <section className={s.title}>
              시호의 맞춤 레포트
              <br />
              <div>2022-02-24 설문결과</div>
            </section>
  
            <section className={s.grid_container_box}>
              <div className={s.grid_container}>
                <div className={s.top}>
                  <div className={s.flex_box}>
                    {/* 왼쪽박스 */}
                    <div className={s.box}>
                      <p>바프독을 시작하는 나이</p>
            
                      <div className={s.stick_box}>
                        <div className={s.stick}></div>
                        <div className={s.stick_red}></div>
                        <div className={s.stick}></div>
                        <div className={s.stick}></div>
                        <div className={s.stick}></div>
                      </div>
            
                      <div className={s.top_text_box}>
                        <div className={s.top_text_row1}>
                          <div className={s.left_text}>전체 평균</div>
                          <div className={s.right_text}>5.5살</div>
                        </div>
                        <div className={s.top_text_row2}>
                          <div className={s.left_text}>시호</div>
                          <div className={s.right_text}>3살</div>
                        </div>
                      </div>
                    </div>
          
                    {/* 가운데박스 */}
                    <div className={s.box}>
                      <p>소형견 평균 체중</p>
            
                      <div className={s.stick_box}>
                        <div className={s.stick}></div>
              
                        <div className={s.stick}></div>
                        <div className={s.stick}></div>
                        <div className={s.stick}></div>
                        <div className={s.stick_red}></div>
                      </div>
            
                      <div className={s.top_text_box}>
                        <div className={s.top_text_row1}>
                          <div className={s.left_text}>소형견 평균</div>
                          <div className={s.right_text}>6kg</div>
                        </div>
                        <div className={s.top_text_row2}>
                          <div className={s.left_text}>시호</div>
                          <div className={s.right_text}>3kg</div>
                        </div>
                      </div>
                    </div>
          
                    {/* 오른쪽 박스 */}
                    <div className={s.box}>
                      <p>소형견 평균 활동량</p>
            
                      <div className={s.stick_box}>
                        <div className={s.stick}></div>
              
                        <div className={s.stick}></div>
                        <div className={s.stick_red}></div>
                        <div className={s.stick}></div>
                        <div className={s.stick}></div>
                      </div>
            
                      <div className={s.top_text_box}>
                        <div className={s.top_text_row1}>
                          <div className={s.left_text}>전체 평균</div>
                          <div className={s.right_text}>보통이에요</div>
                        </div>
                        <div className={s.top_text_row2}>
                          <div className={s.left_text}>시호</div>
                          <div className={s.right_text}>많아요</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={s.left}>
                  <div className={s.left_title}>시호의 산책 점검</div>
        
                  <div className={s.left_flex_box1}>
                    <div className={s.left_box}>
                      <p>산책 점수</p>
                      <div className={s.left_box_text}>상위 5%</div>
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
                      <p>5회</p>
            
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
                      <p>6시간</p>
                    </div>
                  </div>
        
                  <div className={s.left_title}>
                    견종별 산책시간
                    <p>(일주일기준)</p>
                  </div>
        
                  <div className={s.left_flex_box2}>
                    <div className={s.content_box}>
                      <div className={s.left_stick_box}>
                        <div className={s.stick}></div>
                        <div className={s.stick_red}></div>
                      </div>
                      우리지역에서
                    </div>
          
                    <div className={s.content_box}>
                      <div className={s.left_stick_box}>
                        <div className={s.stick}></div>
                        <div className={s.stick_red}></div>
                      </div>
                      또래 중에서
                    </div>
          
                    <div className={s.content_box}>
                      <div className={s.left_stick_box}>
                        <div className={s.stick}></div>
                        <div className={s.stick_red}></div>
                      </div>
                      소형견 중에서
                    </div>
                  </div>
                </div>
      
                <div className={s.t_right}>
                  <div className={s.left_title}>견종별 간식 횟수</div>
        
                  <div className={s.t_right_grid_box}>
                    <div>대형견</div>
                    <div className={s.horizon_stick}></div>
                    <div>중형견</div>
                    <div className={s.horizon_stick}></div>
                    <div>소형견</div>
                    <div className={s.horizon_stick}></div>
                    <div className={s.hero_name}>시호</div>
                    <div className={s.horizon_stick_red}></div>
                  </div>
                </div>
      
                <div className={s.b_right}>
                  <div className={s.left_title}>바프독 생식기준 결과</div>
                  <div className={s.b_right_grid_box}>
                    <div className={s.right_text}>시호의 하루 권장 칼로리</div>
                    <div className={s.left_text}>479kacl</div>
                    <div className={s.right_text}>하루 권장 식사량</div>
                    <div className={s.left_text}>286g</div>
                    <div className={s.right_text}>
                      한끼 권장 식사량 <span>(하루 두끼 기준)</span>
                    </div>
                    <div className={s.left_text}>143g</div>
                  </div>
                </div>
              </div>
            </section>
  
            <section className={s.last_text}>
              <div>
                ※ 해당 결과지는 바프독 고객을 대상으로한 참고용 결과이니, <br />
              </div>
    
              <div>자세한 반려견의 건강상태는 수의사와 상담해 주세요.</div>
            </section>
  
            <section className={s.btn_box}>
              <div className={s.btn}>맞춤 플랜 확인하기</div>
            </section>
          </div>}
        
          
        </Wrapper>
      </Layout>
    </>
  );
}

const getSurveyReport = async (apiUrl) => {
  let DATA;
  try {
    const res = await getData(apiUrl);
    console.log(res);
    const data = res.data;
    const DATA = {
      dogId: 52,
      dogName: '김바프', //
      recommendRecipeDescription: '레시피 설명',
      recommendRecipeImgUrl: 'http://211.219.225.118:9999//display/recipes?filename=스타트1.jpg',
      uiNameKorean: '레시피 한글',
      uiNameEnglish: 'RECIPE ENGLISH',
      foodAnalysis: {
        oneDayRecommendKcal: 163.3593,
        oneDayRecommendGram: 202,
        oneMealRecommendGram: 101,
      },
      recipeDtoList: [
        {
          id: 13,
          name: '스타트',
          description: '레시피 설명',
          pricePerGram: 48.234,
          gramPerKcal: 1.23456,
          inStock: true,
          imgUrl: 'http://211.219.225.118:9999//display/recipes?filename=스타트2.jpg',
        },
        {
          id: 14,
          name: '터키비프',
          description: '레시피 설명',
          pricePerGram: 48.234,
          gramPerKcal: 1.23456,
          inStock: true,
          imgUrl: 'http://localhost:8080/display/recipes?filename=터키비프2.jpg',
        },
        {
          id: 15,
          name: '덕램',
          description: '레시피 설명',
          pricePerGram: 48.234,
          gramPerKcal: 1.23456,
          inStock: true,
          imgUrl: 'http://localhost:8080/display/recipes?filename=덕램2.jpg',
        },
        {
          id: 16,
          name: '램비프',
          description: '레시피 설명',
          pricePerGram: 48.234,
          gramPerKcal: 1.23456,
          inStock: true,
          imgUrl: 'http://localhost:8080/display/recipes?filename=램비프2.jpg',
        },
      ],
      plan: 'FULL',
      recipeName: '스타트,터키비프',
      oneMealRecommendGram: 101,
      nextPaymentDate: '2022-07-17',
      nextPaymentPrice: 120000,
      nextDeliveryDate: '2022-07-19',
    };
  } catch (err) {
    console.error(err);
    alert('데이터를 가져올 수 없습니다.');
  }

  return DATA;
};

export async function getServerSideProps(context) {
  const { req } = context;
  const cookie = req.headers.cookie;
  const key = 'userLoginCookie';
  let token;
  cookie.split(';').forEach((c) => {
    if (c.indexOf(key) >= 0) {
      const data = c.split('=')[1];
      token = data;
      console.log('dat: ', data);
    }
  });
  const apiUrl = '/api/surveyReports/261';
  // console.log(cookie)
  return { props: { cookie } };
}
