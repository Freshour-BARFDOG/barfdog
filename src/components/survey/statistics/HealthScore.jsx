import React, { useState } from 'react';
import s from './surveyStatistics.module.scss';
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
import Image from 'next/image';
import { Modal_HealthScore } from '../../modal/Modal_HealthScore';

export default function HealthScore({ surveyInfo, scoreInfo, info }) {
  const data = [
    { name: 'Group C', value: scoreInfo.scoreNumber },
    { name: 'Group A', value: 100 - scoreInfo.scoreNumber },
    // { name: 'Group B', value: 100 },
  ];

  const COLORS = [scoreInfo.color, '#e5e5e5'];

  const [activeModal, setActiveModal] = useState(false);

  const onActiveAlertModalHandler = () => {
    setActiveModal(true);
  };

  console.log(scoreInfo);
  console.log(surveyInfo);

  return (
    <>
      <section className={s.health_score}>
        <div className={s.dog_info_wrapper}>
          <div className={s.dog_info_name}>
            <span className={s.under_text}>{surveyInfo.myDogName}</span> (이)의
            건강 종합 점수
            <Image
              src={'/img/survey/statistics/info.svg'}
              alt="info"
              width={20}
              height={20}
              style={{ cursor: 'pointer' }}
              onClick={onActiveAlertModalHandler}
            />
          </div>
          <div className={s.dog_score_text}>
            ※ 해당 결과지는 바프독 고객을 대상으로한 참고용 결과이니, <br />
            자세한 반려견 건강 상태는 담당 수의사와 상담해 주세요.
          </div>
        </div>

        {/* graph */}
        <div
          style={{
            width: '400px',
            height: '400px',
            margin: '10px auto 0 auto',
            position: 'relative',
          }}
          className={s.health_score_graph_wrapper}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                startAngle={180}
                endAngle={0}
                innerRadius={140}
                outerRadius={170}
                paddingAngle={0}
                dataKey="value"
                cornerRadius={0}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <Label
                  position="center"
                  style={{
                    transform: 'translateY(-100px)',
                    fontSize: '22px',
                    fill: '#424242',
                  }}
                >
                  건강 종합 점수
                </Label>

                <Label
                  position="center"
                  style={{
                    // textAnchor: 'middle',
                    fontSize: '90px',
                    fill: scoreInfo.color,
                    transform: 'translateX(-20px) translateY(-40px)',
                  }}
                >
                  {scoreInfo.scoreNumber}
                </Label>
                <Label
                  position="center"
                  style={{
                    // textAnchor: 'middle',
                    fontSize: '46px',
                    fill: scoreInfo.color,
                    transform: 'translateX(66px) translateY(-30px)',
                  }}
                >
                  점
                </Label>
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* label */}
          <div
            className={s.score_label}
            style={{
              border: `1px solid ${scoreInfo.color}`,
              color: scoreInfo.color,
            }}
          >
            {scoreInfo.text}
          </div>
          <div className={s.description_label}>
            {surveyInfo.avgScoreAmongSameSizeDog === scoreInfo.scoreNumber &&
              `${info.dogSize} 평균 점수와 내 점수는 같아요!`}

            {surveyInfo.avgScoreAmongSameSizeDog - scoreInfo.scoreNumber !==
              0 && (
              <>
                {info.dogSize} 평균 점수&nbsp;<b>80점</b>&nbsp;대비 내
                반려견은&nbsp;
                <b>
                  {Math.abs(
                    Math.round(
                      surveyInfo.avgScoreAmongSameSizeDog -
                        scoreInfo.scoreNumber,
                    ),
                  )}
                  점
                </b>
                &nbsp;
                {surveyInfo.avgScoreAmongSameSizeDog < scoreInfo.scoreNumber
                  ? '높아요!'
                  : '낮아요!'}
              </>
            )}
          </div>
        </div>
      </section>

      {activeModal && <Modal_HealthScore onModalActive={setActiveModal} />}
    </>
  );
}
