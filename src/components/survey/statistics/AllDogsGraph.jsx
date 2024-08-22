import React, { useState } from 'react';
import s from './surveyStatistics.module.scss';
import Spinner from '/src/components/atoms/Spinner';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Label,
  XAxis,
  LabelList,
  Cell,
  YAxis,
} from 'recharts';

export default function AllDogsGraph({ surveyInfo, avg }) {
  const [isLoading, setIsLoading] = useState(false);

  // console.log(supplementInfo);

  const data = [
    {
      score: surveyInfo.score || 0,
      avg: avg || 0,
    },
  ];

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div
          style={{
            width: '400px',
            height: '80px',
            margin: '30px 100px 0 auto',
            position: 'relative',
          }}
          className={s.all_dogs_graph_wrapper}
        >
          <div className={s.avg_text_wrapper}>
            <div
              className={s.avg_text}
              style={{
                left: `${surveyInfo.avgScoreAmongAllDogs}%`,
              }}
            >
              평균
              <br />▼
            </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={100}
              height={30}
              data={data}
              barSize={20}
              barGap={20}
              layout="vertical"
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <YAxis
                type="category"
                dataKey="name"
                tick={{
                  fontSize: '16px',
                  fill: '#424242',
                  fontWeight: 'normal',
                  textAnchor: 'end',
                  dx: -10,
                  dy: 0, // 수직 위치 조정
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap', // 한 줄로 유지
                  display: 'none',
                }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <XAxis
                type="number"
                tick={{
                  fontWeight: 'normal',
                  fontSize: '16px',
                  fill: '#B8B6B6',
                }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                ticks={[0, 100]}
              />
              <Bar
                dataKey="score"
                fill="#FFC5C5"
                background={{
                  fill: '#eee',
                }}
              >
                {/* <LabelList
                  dataKey="avg"
                  position="center"
                  style={{
                    fill: '#000',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                /> */}
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
