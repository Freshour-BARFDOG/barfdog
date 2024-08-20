import React from 'react';
import s from './surveyStatistics.module.scss';
import Image from 'next/image';
import VerticalGraph from './VerticalGraph';
import StatusChart from './StatusChart';

export default function DogAnalysis({ surveyInfo, info }) {
  console.log('inf____', info);

  return (
    <section className={s.dog_analysis}>
      <div className={s.dog_analysis_wrapper_title}>
        <div className={s.dog_info_name}>
          <span className={s.under_text}>{surveyInfo.myDogName}</span> (이)의
          건강 종합 점수
        </div>
        <div className={s.dog_score_text}>
          ※ 해당 결과지는 바프독 고객을 대상으로한 참고용 결과이니, <br />
          자세한 반려견 건강 상태는 담당 수의사와 상담해 주세요.
        </div>
      </div>

      {/* 1. 몸무게 */}
      <div className={s.dog_analysis_wrapper}>
        <div className={s.dog_info_name}>
          몸무게<span className={s.compare_txt}></span>
        </div>

        <div className={s.graph_wrapper_scale}>
          <div className={s.img_wrapper}>
            <Image
              src={'/img/survey/statistics/scale1.png'}
              alt="scale"
              width={232 * 1.4}
              height={132 * 1.4}
            />
            <div className={s.needle}>
              <Image
                src={'/img/survey/statistics/needle.png'}
                alt="needle"
                width={15 * 1.4}
                height={79 * 1.4}
              />
            </div>
          </div>
        </div>

        <div className={s.dog_analysis_box}>
          <div className={s.dog_analysis_content}>
            <div>같은 견종 평균</div>
            <div>{info.weightAnalysis.avgWeight} kg</div>
          </div>
          <div className={`${s.dog_analysis_content} ${s.bold_text}`}>
            <div>{surveyInfo.myDogName}</div>
            {/* ! [추가] 내 몸무게 */}
            <div>{surveyInfo.myDogName} kg</div>
          </div>
        </div>
      </div>

      {/* 2. 현재 상태 */}
      <div className={s.dog_analysis_wrapper}>
        <div className={s.dog_info_name}>
          현재 상태<span className={s.compare_txt}> </span>
        </div>

        {/* ! [추가] 그래프  */}
        {/* <div className={s.graph_wrapper}> */}
        {/* <Image
            src={'/img/survey/statistics/scale1.png'}
            alt="scale"
            width={232}
            height={132}
          /> */}
        <StatusChart />
        {/* </div> */}

        <div className={s.dog_analysis_box}>
          <div className={s.dog_analysis_content}>
            <div>{info.dogSize} 평균</div>
            {/* ! [추가] 평균 상태 */}
            <div>{info.weightAnalysis.avgWeight} </div>
          </div>

          <div className={`${s.dog_analysis_content} ${s.bold_text}`}>
            <div>{surveyInfo.myDogName}</div>

            {/* ! [추가] 내 현재 상태 */}
            <div>{surveyInfo.dogStatus}</div>
          </div>
        </div>
      </div>

      {/* 3. 음수량 */}
      <div className={s.dog_analysis_wrapper}>
        <div className={s.dog_info_name}>
          음수량<span className={s.compare_txt}> </span>
        </div>

        <div className={s.graph_wrapper_water}>
          <div>
            <Image
              src={'/img/survey/statistics/water2.png'}
              alt="water"
              width={86 * 1.5}
              height={113 * 1.5}
            />
            <p className={s.avg_txt}> {info.dogSize} 평균</p>
          </div>
          <div>
            <Image
              src={'/img/survey/statistics/water1.png'}
              alt="water"
              width={86 * 1.5}
              height={113 * 1.5}
            />
            <p className={s.myDog_txt}> {surveyInfo.myDogName}</p>
          </div>
        </div>

        <div className={s.dog_analysis_box}>
          <div className={s.dog_analysis_content}>
            <div>{info.dogSize} 평균</div>
            {/* ! [추가] 평균 음수량 */}
            <div>{info.weightAnalysis.avgWeight}</div>
          </div>
          <div className={`${s.dog_analysis_content} ${s.bold_text}`}>
            <div>{surveyInfo.myDogName}</div>

            {/* ! [추가] 내 음수량 */}
            <div>{surveyInfo.waterCountLevel}</div>
          </div>
        </div>
      </div>

      {/* 4. 급여식단 */}
      <div className={s.dog_analysis_wrapper}>
        <div className={s.dog_info_name}>
          급여식단<span className={s.compare_txt}> </span>
        </div>

        {/* 그래프  */}
        <VerticalGraph />

        <div className={s.dog_analysis_box}>
          <div className={s.dog_analysis_content}>
            <div>{info.dogSize} 1위</div>
            {/* ! [추가] 1위 급여식단 */}
            <div>{info.weightAnalysis.avgWeight}</div>
          </div>
          <div className={`${s.dog_analysis_content} ${s.bold_text}`}>
            <div>{surveyInfo.myDogName}</div>

            {/* ! [추가] 내 급여식단 */}
            <div>{surveyInfo.myDogName}</div>
          </div>
        </div>
      </div>

      {/* 5. 영양제 급여량 */}
      <div className={s.dog_analysis_wrapper}>
        <div className={s.dog_info_name}>
          영양제 급여량<span className={s.compare_txt}></span>
        </div>

        {/*  그래프  */}
        <VerticalGraph />

        <div className={s.dog_analysis_box}>
          <div className={s.dog_analysis_content}>
            <div>{info.dogSize} 평균</div>
            {/* ! [추가] 평균 영양제 개수 */}
            <div>{info.weightAnalysis.avgWeight} 개</div>
          </div>
          <div className={`${s.dog_analysis_content} ${s.bold_text}`}>
            <div>{surveyInfo.myDogName}</div>
            {/* ! [추가] 내 영양제 개수/ */}
            <div>{surveyInfo.myDogName} 개</div>
          </div>
        </div>
      </div>

      {/* 6. 질병 */}
      <div className={s.dog_analysis_wrapper}>
        <div className={s.dog_info_name}>
          질병<span className={s.compare_txt}> </span>
        </div>

        {/* ! [추가] 그래프  */}
        <div className={s.graph_wrapper_disease}>
          <div>
            <Image
              src={'/img/survey/statistics/disease-good-active.png'}
              alt="disease"
              width={80 * 1.6}
              height={80 * 1.6}
            />
            <p className={s.avg_txt}> 좋아요</p>
          </div>
          <div>
            <Image
              src={'/img/survey/statistics/disease-bad.png'}
              alt="disease"
              width={80 * 1.6}
              height={80 * 1.6}
            />
            <p className={s.myDog_txt}>아파요</p>
          </div>
        </div>

        <div className={s.dog_analysis_box}>
          <div className={s.dog_analysis_content}>
            <div>{info.dogSize} 평균</div>
            {/* ! [추가] 평균 질병 개수 */}
            <div>{info.weightAnalysis.avgWeight} 개 보유</div>
          </div>
          <div className={`${s.dog_analysis_content} ${s.bold_text}`}>
            <div>{surveyInfo.myDogName}</div>
            <div>{surveyInfo.caution.split(',').length} 개 보유</div>
          </div>
        </div>
      </div>
    </section>
  );
}
