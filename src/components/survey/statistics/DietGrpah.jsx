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

export default function DietGrpah({ dietInfo }) {
  const [isLoading, setIsLoading] = useState(false);

  const data = [
    {
      name: dietInfo?.raw?.kor || '',
      count: dietInfo?.raw?.count || 0,
    },
    {
      name: dietInfo?.freezeDried?.kor || '',
      count: dietInfo?.freezeDried?.count || 0,
    },
    {
      name: dietInfo?.homemade?.kor || '',
      count: dietInfo?.homemade?.count || 0,
    },
    {
      name: dietInfo?.cooked?.kor || '',
      count: dietInfo?.cooked?.count || 0,
    },
    {
      name: dietInfo?.wetCanned?.kor || '',
      count: dietInfo?.wetCanned?.count || 0,
    },
    {
      name: dietInfo?.dry?.kor || '',
      count: dietInfo?.dry?.count || 0,
    },
  ];

  const getBarColor = (name) => {
    return name === dietInfo.myDogDiet ? '#FFC5C5' : '#D9D9D9';
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div
          style={{
            width: '400px',
            height: '300px',
            margin: '0 100px 0 auto',
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={100}
              height={40}
              data={data}
              barSize={20}
              barGap={20}
              layout="vertical"
              margin={{ top: 0, right: 0, bottom: 0, left: 50 }}
            >
              <YAxis
                type="category"
                dataKey="name"
                tick={{
                  fontSize: '16px',
                  fill: '#424242',
                  fontWeight: 'normal',
                  textAnchor: 'end', // 라벨을 오른쪽으로 정렬
                  dx: -10, // 라벨을 오른쪽으로 이동
                }}
                tickLine={false}
                interval={0} // 모든 라벨 표시
              />
              <XAxis
                type="number"
                tick={{ display: 'none' }} // X축 라벨 숨기기
                axisLine={false} // X축 선 숨기기
                tickLine={false} // X축 틱 라인 숨기기
              />
              <Bar dataKey="count" fill="#D9D9D9">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
