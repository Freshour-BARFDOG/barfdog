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

export default function SupplementGraph({ supplementInfo }) {
  const [isLoading, setIsLoading] = useState(false);

  // console.log(supplementInfo);

  const data = [
    {
      name: supplementInfo?.zero?.kor || '',
      count: supplementInfo?.zero?.count || 0,
    },
    {
      name: supplementInfo?.oneTwo?.kor || '',
      count: supplementInfo?.oneTwo?.count || 0,
    },
    {
      name: supplementInfo?.threeFour?.kor || '',
      count: supplementInfo?.threeFour?.count || 0,
    },
    {
      name: supplementInfo?.fiveSix?.kor || '',
      count: supplementInfo?.fiveSix?.count || 0,
    },
    {
      name: supplementInfo?.sevenEight?.kor || '',
      count: supplementInfo?.sevenEight?.count || 0,
    },
    {
      name: supplementInfo?.overNine?.kor || '',
      count: supplementInfo?.overNine?.count || 0,
    },
  ];

  const getBarColor = (name) => {
    return name === supplementInfo.myDogSupplement ? '#FFC5C5' : '#D9D9D9';
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
          className={s.supplement_graph_wrapper}
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
                  textAnchor: 'end',
                  dx: -10,
                  dy: 0, // 수직 위치 조정
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap', // 한 줄로 유지
                }}
                tickLine={false}
                width={80}
              />
              <XAxis
                type="number"
                tick={{ display: 'none' }}
                axisLine={false}
                tickLine={false}
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
