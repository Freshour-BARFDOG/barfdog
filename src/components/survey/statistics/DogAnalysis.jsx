import React, { useEffect, useState } from 'react';
import s from './surveyStatistics.module.scss';
import Image from 'next/image';
import VerticalGraph from './DietGrpah';
import StatusChart from './StatusChart';
import { dogSnackCountLevelType } from '../../../../store/TYPE/dogSnackCountLevelType';
import { dogPhysicalStatusType } from '../../../../store/TYPE/dogPhysicalStatusType';
import DietGrpah from './DietGrpah';
import SupplementGraph from './SupplementGraph';

export default function DogAnalysis({ surveyInfo, info }) {
  const weight =
    surveyInfo.weightAnalysis.weightInLastReport > 60
      ? 60
      : surveyInfo.weightAnalysis.weightInLastReport;
  const degreePerKg = 180 / 60;
  const rotation = weight * degreePerKg;

  const [scaleNum, setScaleNum] = useState(1);
  const [waterNum, setWaterNum] = useState({});
  const [dietInfo, setDietInfo] = useState({});
  const [supplementInfo, setSupplementInfo] = useState({});

  useEffect(() => {
    const avgWeight = surveyInfo.weightAnalysis.avgWeight;
    let scaleNum, avgWaterNum, myDogWaterNum;

    //* 몸무게 이미지
    switch (true) {
      case avgWeight >= 0 && avgWeight <= 5:
        scaleNum = 1;
        break;
      case avgWeight > 5 && avgWeight <= 10:
        scaleNum = 2;
        break;
      case avgWeight > 10 && avgWeight <= 15:
        scaleNum = 3;
        break;
      case avgWeight > 15 && avgWeight <= 20:
        scaleNum = 4;
        break;
      case avgWeight > 20 && avgWeight <= 25:
        scaleNum = 5;
        break;
      case avgWeight > 25 && avgWeight <= 30:
        scaleNum = 6;
        break;
      case avgWeight > 30 && avgWeight <= 35:
        scaleNum = 7;
        break;
      case avgWeight > 35 && avgWeight <= 40:
        scaleNum = 8;
        break;
      case avgWeight > 40 && avgWeight <= 45:
        scaleNum = 9;
        break;
      case avgWeight > 45 && avgWeight <= 50:
        scaleNum = 10;
        break;
      case avgWeight > 50 && avgWeight <= 55:
        scaleNum = 11;
        break;
      case avgWeight > 55:
        scaleNum = 12;
        break;
      default:
        scaleNum = 1;
        break;
    }
    setScaleNum(scaleNum);

    //* 평균 음수량 이미지
    switch (true) {
      case surveyInfo.topWaterCountLevelAmongSameSizeDog === 'LITTLE':
        avgWaterNum = 1;
        break;
      case surveyInfo.topWaterCountLevelAmongSameSizeDog === 'NORMAL':
        avgWaterNum = 2;
        break;
      case surveyInfo.topWaterCountLevelAmongSameSizeDog === 'MUCH':
        avgWaterNum = 3;
        break;
      default:
        avgWaterNum = 2;
        break;
    }

    //* 나의 음수량 이미지
    switch (true) {
      case surveyInfo.waterCountLevel === 'LITTLE':
        myDogWaterNum = 1;
        break;
      case surveyInfo.waterCountLevel === 'NORMAL':
        myDogWaterNum = 2;
        break;
      case surveyInfo.waterCountLevel === 'MUCH':
        myDogWaterNum = 3;
        break;
      default:
        myDogWaterNum = 2;
        break;
    }

    setWaterNum({
      avg: avgWaterNum,
      myDog: myDogWaterNum,
    });

    //* 평균 질병 이미지
    switch (true) {
      case surveyInfo.topWaterCountLevelAmongSameSizeDog === 'LITTLE':
        avgWaterNum = 1;
        break;
      case surveyInfo.topWaterCountLevelAmongSameSizeDog === 'NORMAL':
        avgWaterNum = 2;
        break;
      case surveyInfo.topWaterCountLevelAmongSameSizeDog === 'MUCH':
        avgWaterNum = 3;
        break;
      default:
        avgWaterNum = 2;
        break;
    }

    //* 나의 질병 이미지
    switch (true) {
      case surveyInfo.waterCountLevel === 'LITTLE':
        myDogWaterNum = 1;
        break;
      case surveyInfo.waterCountLevel === 'NORMAL':
        myDogWaterNum = 2;
        break;
      case surveyInfo.waterCountLevel === 'MUCH':
        myDogWaterNum = 3;
        break;
      default:
        myDogWaterNum = 2;
        break;
    }

    setWaterNum({
      avg: avgWaterNum,
      myDog: myDogWaterNum,
    });

    //* 급여식단
    const dietNumList = [
      surveyInfo.rawDietCountAmongSameSizeDog,
      surveyInfo.freezeDriedDietCountAmongSameSizeDog,
      surveyInfo.homemadeDietCountAmongSameSizeDog,
      surveyInfo.cookedDietCountAmongSameSizeDog,
      surveyInfo.wetCannedDietCountAmongSameSizeDog,
      surveyInfo.dryDietCountAmongSameSizeDog,
    ];

    // 배열에서 최대값 찾기
    const maxDietNum = Math.max(...dietNumList);

    // 최대값에 따라 식단 설정
    let dietType;
    switch (maxDietNum) {
      case surveyInfo.rawDietCountAmongSameSizeDog:
        dietType = '생식';
        break;
      case surveyInfo.freezeDriedDietCountAmongSameSizeDog:
        dietType = '동결건조사료';
        break;
      case surveyInfo.homemadeDietCountAmongSameSizeDog:
        dietType = '수제사료';
        break;
      case surveyInfo.cookedDietCountAmongSameSizeDog:
        dietType = '화식';
        break;
      case surveyInfo.wetCannedDietCountAmongSameSizeDog:
        dietType = '습식캔';
        break;
      case surveyInfo.dryDietCountAmongSameSizeDog:
        dietType = '건사료';
        break;
      default:
        dietType = '-';
        break;
    }

    setDietInfo({
      topDiet: dietType,
      myDogDiet: surveyInfo.currentMeal,
      raw: { kor: '생식', count: surveyInfo.rawDietCountAmongSameSizeDog },
      freezeDried: {
        kor: '동결건조사료',
        count: surveyInfo.freezeDriedDietCountAmongSameSizeDog,
      },
      homemade: {
        kor: '수제사료',
        count: surveyInfo.homemadeDietCountAmongSameSizeDog,
      },
      cooked: {
        kor: '화식',
        count: surveyInfo.cookedDietCountAmongSameSizeDog,
      },
      wetCanned: {
        kor: '습식캔',
        count: surveyInfo.wetCannedDietCountAmongSameSizeDog,
      },
      dry: { kor: '건사료', count: surveyInfo.dryDietCountAmongSameSizeDog },
    });

    //* 영양제 급여량
    const supplementList = [
      surveyInfo.supplementZero,
      surveyInfo.supplementOneTwo,
      surveyInfo.supplementThreeFour,
      surveyInfo.supplementFiveSix,
      surveyInfo.supplementSevenEight,
      surveyInfo.supplementOverNine,
    ];

    const maxSupplementNum = Math.max(...supplementList);

    // 최대값에 따라 영양제 급여량 설정
    let supplementType, myDogSupplementType;
    switch (maxSupplementNum) {
      case surveyInfo.supplementZero:
        supplementType = '0개';
        break;
      case surveyInfo.supplementOneTwo:
        supplementType = '1~2개';
        break;
      case surveyInfo.supplementThreeFour:
        supplementType = '3~4개';
        break;
      case surveyInfo.supplementFiveSix:
        supplementType = '5~6개';
        break;
      case surveyInfo.supplementSevenEight:
        supplementType = '7~8개';
        break;
      case surveyInfo.supplementOverNine:
        supplementType = '9개 이상';
        break;
      default:
        supplementType = '-';
        break;
    }

    // 내 영양제
    switch (true) {
      case surveyInfo.supplementCount === 0:
        myDogSupplementType = '0개';
        break;
      case surveyInfo.supplementCount >= 1 && surveyInfo.supplementCount <= 2:
        myDogSupplementType = '1~2개';
        break;
      case surveyInfo.supplementCount >= 3 && surveyInfo.supplementCount <= 4:
        myDogSupplementType = '3~4개';
        break;
      case surveyInfo.supplementCount >= 5 && surveyInfo.supplementCount <= 6:
        myDogSupplementType = '5~6개';
        break;
      case surveyInfo.supplementCount >= 7 && surveyInfo.supplementCount <= 8:
        myDogSupplementType = '7~8개';
        break;
      case surveyInfo.supplementCount >= 9:
        myDogSupplementType = '9개 이상';
        break;
      default:
        myDogSupplementType = '-';
        break;
    }

    setSupplementInfo({
      topSupplement: supplementType,
      myDogSupplement: myDogSupplementType,
      zero: { kor: '0개', count: surveyInfo.supplementZero },
      oneTwo: { kor: '1~2개', count: surveyInfo.supplementOneTwo },
      threeFour: { kor: '3~4개', count: surveyInfo.supplementThreeFour },
      fiveSix: { kor: '5~6개', count: surveyInfo.supplementFiveSix },
      sevenEight: { kor: '7~8개', count: surveyInfo.supplementSevenEight },
      overNine: { kor: '9개 이상', count: surveyInfo.supplementOverNine },
    });
  }, []);

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
              src={`/img/survey/statistics/scale${scaleNum}.png`}
              alt="scale"
              width={232 * 1.4}
              height={132 * 1.4}
            />
            <div
              className={s.needle}
              style={{
                transform: `translate(-50%, -50%) rotate(calc(-90deg + ${rotation}deg))`,
              }}
            >
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
            <div>{surveyInfo.weightAnalysis.avgWeight} kg</div>
          </div>
          <div className={`${s.dog_analysis_content} ${s.bold_text}`}>
            <div>{surveyInfo.myDogName}</div>
            <div>{surveyInfo.weightAnalysis.weightInLastReport} kg</div>
          </div>
        </div>
      </div>

      {/* 2. 현재 상태 */}
      <div className={s.dog_analysis_wrapper}>
        <div className={s.dog_info_name}>
          현재 상태<span className={s.compare_txt}> </span>
        </div>

        <StatusChart />

        <div className={s.dog_analysis_box}>
          <div className={s.dog_analysis_content}>
            <div>{info.dogSize} 1위</div>
            <div>
              {
                dogPhysicalStatusType.KOR[
                  surveyInfo.topDogStatusAmongSameSizeDog
                ]
              }
            </div>
          </div>

          <div className={`${s.dog_analysis_content} ${s.bold_text}`}>
            <div>{surveyInfo.myDogName}</div>
            <div>{dogPhysicalStatusType.KOR[surveyInfo.dogStatus]}</div>
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
              src={`/img/survey/statistics/water${waterNum.avg}.png`}
              alt="water"
              width={86 * 1.5}
              height={113 * 1.5}
            />
            <p className={s.avg_txt}> {info.dogSize} 1위</p>
          </div>
          <div>
            <Image
              src={`/img/survey/statistics/water${waterNum.myDog}.png`}
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
            <div>
              {
                dogSnackCountLevelType.KOR[
                  surveyInfo.topWaterCountLevelAmongSameSizeDog
                ]
              }
            </div>
          </div>
          <div className={`${s.dog_analysis_content} ${s.bold_text}`}>
            <div>{surveyInfo.myDogName}</div>

            <div>{dogSnackCountLevelType.KOR[surveyInfo.waterCountLevel]}</div>
          </div>
        </div>
      </div>

      {/* 4. 급여식단 */}
      <div className={s.dog_analysis_wrapper}>
        <div className={s.dog_info_name}>
          급여식단<span className={s.compare_txt}> </span>
        </div>

        {/* 그래프  */}
        <DietGrpah dietInfo={dietInfo} />

        <div className={s.dog_analysis_box}>
          <div className={s.dog_analysis_content}>
            <div>{info.dogSize} 1위</div>
            <div>{dietInfo.topDiet}</div>
          </div>
          <div className={`${s.dog_analysis_content} ${s.bold_text}`}>
            <div>{surveyInfo.myDogName}</div>
            <div>{surveyInfo.currentMeal}</div>
          </div>
        </div>
      </div>

      {/* 5. 영양제 급여량 */}
      <div className={s.dog_analysis_wrapper}>
        <div className={s.dog_info_name}>
          영양제 급여량<span className={s.compare_txt}></span>
        </div>

        <SupplementGraph supplementInfo={supplementInfo} />

        <div className={s.dog_analysis_box}>
          <div className={s.dog_analysis_content}>
            <div>{info.dogSize} 평균</div>
            <div>
              {surveyInfo.avgSupplementCountAmongSameSizeDog >= 0
                ? Math.round(surveyInfo.avgSupplementCountAmongSameSizeDog) +
                  '개'
                : '-'}
            </div>
          </div>
          <div className={`${s.dog_analysis_content} ${s.bold_text}`}>
            <div>{surveyInfo.myDogName}</div>
            <div>
              {surveyInfo.supplementCount >= 0
                ? surveyInfo.supplementCount + '개'
                : '-'}
            </div>
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
            <div>
              {surveyInfo.avgCautionCountAmongSameSizeDog >= 0
                ? Math.round(surveyInfo.avgCautionCountAmongSameSizeDog) +
                  '개 보유'
                : '-'}
            </div>
          </div>
          <div className={`${s.dog_analysis_content} ${s.bold_text}`}>
            <div>{surveyInfo.myDogName}</div>
            <div>
              {surveyInfo.cautionCount >= 0
                ? surveyInfo.cautionCount + '개 보유'
                : '-'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
