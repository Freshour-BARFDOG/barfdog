import React from 'react';
import s from './surveyStatistics.module.scss';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Label,
  XAxis,
  LabelList,
  Cell,
} from 'recharts';

export default function WalkingAnalysis({ surveyInfo }) {
  const data = [
    {
      name: '바프독 전체',
      hr: surveyInfo.walkingAnalysis.avgWalkingTimeInAllDogs,
    },
    {
      name: '또래(견)',
      hr: surveyInfo.walkingAnalysis.avgWalkingTimeInAge,
    },
    {
      name: '대형견',
      hr: surveyInfo.walkingAnalysis.avgWalkingTimeInDogSize,
    },
    {
      name: '같은 견종',
      hr: surveyInfo.walkingAnalysis.avgWalkingTimeInDogType,
    },
    {
      name: '왕멍멍이',
      hr: surveyInfo.walkingAnalysis.totalWalingTime,
    },
  ];

  return (
    <section className={s.walking_analysis}>
      <div>
        <div>
          {surveyInfo.myDogName}(이)의 산책 점검 <span>(일주일 기준)</span>
        </div>
        <div className={s.top_wrapper}>
          <div className={s.left_area}>
            <div className={s.title}>산책 점수</div>
            <p>
              상위
              <br /> {Math.round(surveyInfo.walkingAnalysis.highRankPercent)}%
            </p>
          </div>
          <div className={s.right_area}>
            <div>
              <div className={s.title_text}>평균 산책 횟수</div>
              <h1>
                {surveyInfo.walkingAnalysis.walkingCountPerWeek
                  ? surveyInfo.walkingAnalysis.walkingCountPerWeek + ' 회'
                  : '-'}{' '}
              </h1>
            </div>
            <div>
              <div className={s.title_text}>평균 총 산책 시간</div>
              <h1>
                {surveyInfo.walkingAnalysis.totalWalingTime
                  ? surveyInfo.walkingAnalysis.totalWalingTime + ' 시간'
                  : '-'}{' '}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className={s.walking_time_wrapper}>
        산책 시간 <span>(일주일 기준)</span>
        {/* graph */}
        <div
          style={{
            width: '600px',
            height: '300px',
            margin: '0px auto 0 auto',
            position: 'relative',
          }}
          className={s.walking_time_graph_wrapper}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={100}
              height={40}
              data={data}
              barSize={40}
              barGap={20}
              margin={{ top: 40, right: 0, bottom: 0, left: 0 }}
            >
              {/* x축 */}
              <XAxis
                dataKey="name"
                tick={({ x, y, payload, index }) => {
                  const isLastTick = index === data.length - 1; // 마지막 레이블 확인
                  return (
                    <text
                      x={x}
                      y={y + 20} // 라벨의 y축 위치 조정
                      fill={isLastTick ? '#BE1A21' : '#424242'} // 마지막 레이블의 색상 변경
                      fontSize="16px"
                      fontWeight={isLastTick ? 'bold' : 'normal'} // 마지막 레이블의 굵기 변경
                      textAnchor="middle"
                    >
                      {payload.value}
                    </text>
                  );
                }}
                tickLine={false}
              />

              <Bar dataKey="hr" fill="#D9D9D9">
                {/* 각 바의 색상을 개별적으로 설정 */}
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === data.length - 1 ? '#FFC5C5' : '#D9D9D9'} // 마지막 바 색상 변경
                  />
                ))}
                {/* 각 바에 값을 표시하는 LabelList */}
                <LabelList
                  dataKey="hr"
                  position="top"
                  content={({ x, y, value, index }) => (
                    <text
                      x={x + 24}
                      y={y - 16} // 라벨을 더 위로 올리기 위해 y축 위치 조정
                      fill={index === data.length - 1 ? '#BE1A21' : '#424242'} // 마지막 라벨의 색상 변경
                      fontSize="20px"
                      fontWeight={index === data.length - 1 ? 'bold' : 'normal'} // 마지막 라벨의 굵기 변경
                      textAnchor="middle"
                    >
                      {`${value}시간`}
                    </text>
                  )}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
