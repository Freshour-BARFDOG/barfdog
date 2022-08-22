import React, { useEffect, useMemo, useState } from 'react';
import { Line } from '@nivo/line';

import s from './chart.module.scss';
import { Defs, linearGradientDef } from '@nivo/core';
import { FullScreenLoading } from '../../atoms/FullScreenLoading';
import Spinner from '../../atoms/Spinner';
import AmdinErrorMessage from '../../atoms/AmdinErrorMessage';

// make sure parent container have a define height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

// Official Doc: https://nivo.rocks/line/


export default function LineChart({ chartData }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartData) return;

    const formData = [
      {
        id: '일반결제',
        color: 'hsl(53, 70%, 50%)',
        data: chartData?.general,
      },
      {
        id: '정기결제',
        color: 'hsl(7, 70%, 50%)',
        data: chartData?.subscribe,
      },
    ];

    // setData(DUMMY_formData); // TEST
    setData(formData);
    setIsLoading(false)
  }, [chartData]);

  if (!data) return;

  return (
    <>
      <div className={s['chart-container']}>
        {isLoading ? (
          <AmdinErrorMessage loading={<Spinner />}/>) : (
          <Line
            data={data}
            width={700}
            height={600}
            margin={{ top: 50, right: 0, bottom: 100, left: 60 }}
            xScale={{
              type: 'time',
              format: '%Y-%m',
              useUTC: false,
              precision: 'month',
              tickValues: 'every month'
            }}
            xFormat="time:%Y-%m"
            yScale={{
              type: 'linear',
              // stacked: Boolean('stacked', false),
            }}
            axisTop={null}
            axisRight={null}
            axisLeft={{
              legend: '월별 판매량',
              legendOffset: -48,
            }}
            axisBottom={{
              orient:'bottom',
              // format: '%b %d', // 월 일
              format: '%Y-%m',
              tickValues: 'every month',
              legend: '월',
              legendOffset: -12,
            }}
            curve="monotoneX"
            enablePointLabel={true}
            pointSize={12}
            // pointColor={{ theme: 'labels.text.fill' }}
            pointColor={{ from: 'color', modifiers: [] }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        )}
      </div>
    </>
  );
}





const DUMMY_formData = [
  {
    id: '일반결제',
    color: 'hsl(53, 70%, 50%)',
    data: [
      {
        x: '2022-08',
        y: 30,
      },
      {
        x: '2022-09',
        y: 50,
      },
      {
        x: '2022-10',
        y: 17,
      },
      {
        x: '2022-11',
        y: 217,
      },
      {
        x: '2022-12',
        y: 417,
      },
      {
        x: '2023-01',
        y: 317,
      },
      {
        x: '2023-02',
        y: 217,
      },
      {
        x: '2023-03',
        y: 817,
      },
      {
        x: '2023-05',
        y: 117,
      },
      {
        x: '2023-06',
        y: 212,
      },
      {
        x: '2023-07',
        y: 1543,
      },
    ],
  },
  {
    id: '정기결제',
    color: 'hsl(7, 70%, 50%)',
    data: [
      {
        x: '2022-08',
        y: 302,
      },
      {
        x: '2022-09',
        y: 1082,
      },
      {
        x: '2022-10',
        y: 400,
      },
      {
        x: '2022-11',
        y: 617,
      },
      {
        x: '2022-12',
        y: 317,
      },
      {
        x: '2023-01',
        y: 117,
      },
      {
        x: '2023-02',
        y: 0,
      },
      {
        x: '2023-03',
        y: 317,
      },
      {
        x: '2023-05',
        y: 1017,
      },
      {
        x: '2023-06',
        y: 317,
      },
      {
        x: '2023-07',
        y: 617,
      },
    ],
  },
];
