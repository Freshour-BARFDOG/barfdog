import React, {useMemo} from 'react';
import { Line } from '@nivo/line';

import s from './chart.module.scss'
import { Defs, linearGradientDef } from '@nivo/core'

// make sure parent container have a define height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.



export const data = [
  {
    "id": "일반결제",
    "color": "hsl(53, 70%, 50%)",
    "data": [
      {
        "x": "2022-01-01",
        "y": 12
      },
      {
        "x": "2022-01-02",
        "y": 6
      },
      {
        "x": "2022-01-03",
        "y": 10
      },
      {
        "x": "2022-01-04",
        "y": 30
      },
      {
        "x": "2022-01-05",
        "y": 30
      },
      {
        "x": "2022-01-06",
        "y": 30
      },
      {
        "x": "2022-01-07",
        "y": 30
      },
      {
        "x": "2022-01-08",
        "y": 30
      },
    ]
  },
  {
    "id": "정기결제",
    "color": "hsl(7, 70%, 50%)",
    "data": [
      {
        "x": "2022-01-01",
        "y": 5
      },
      {
        "x": "2022-01-02",
        "y": 2
      },
      {
        "x": "2022-01-03",
        "y": 17
      },
      {
        "x": "2022-01-04",
        "y": 12
      },
      {
        "x": "2022-01-05",
        "y": 19
      },
      {
        "x": "2022-01-06",
        "y": 66
      },
      {
        "x": "2022-01-07",
        "y": 152
      },
    ]
  }
]




function LineChart ( { chartData } ) {
  return (
    <>
        <div className={s['chart-container']}>
          <Line
          data={chartData}
          width={700}
          height={800}
          margin={{ top: 50, right: 0, bottom: 100, left: 60 }}
          xScale={{
            type: 'time',
            format: '%Y-%m-%d',
            useUTC: false,
            precision: 'day',
          }}
          xFormat="time:%Y-%m-%d"
          yScale={{
            type: 'linear',
            stacked: Boolean('stacked', false),
          }}
          axisLeft={{
            legend: '판매량',
            legendOffset: -52,
          }}
          axisBottom={{
            format: '%b %d',
            tickValues: 'every 2 days',
            legend: 'time scale',
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
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        /></div>
    </>
  )
}


//
// function LineChart ( {data } ) {
//   return (
//     <>
//       <div className={s['chart-container']}>
//         <Line
//           data={data}
//           width={700}
//           height={800}
//           margin={{ top: 50, right: 0, bottom: 100, left: 60 }}
//           xScale={{ type: 'point' }}
//           yScale={{
//             type: 'linear',
//             min: 'auto',
//             max: 'auto',
//             stacked: true,
//             reverse: false
//           }}
//           yFormat=" >-.2f"
//           axisTop={null}
//           axisRight={null}
//           axisBottom={{
//             orient: 'bottom',
//             tickSize: 5,
//             tickPadding: 5,
//             tickRotation: 0,
//             legend: '날짜',
//             legendOffset: 38,
//             legendPosition: 'middle'
//           }}
//           axisLeft={{
//             orient: 'left',
//             tickSize: 5,
//             tickPadding: 5,
//             tickRotation: 0,
//             legend: '판매량',
//             legendOffset: -40,
//             legendPosition: 'middle'
//           }}
//           pointSize={10}
//           pointColor={{ theme: 'background' }}
//           pointBorderWidth={2}
//           pointBorderColor={{ from: 'serieColor' }}
//           pointLabelYOffset={-12}
//           useMesh={true}
//           legends={[
//             {
//               anchor: 'bottom-right',
//               direction: 'column',
//               justify: false,
//               translateX: 100,
//               translateY: 0,
//               itemsSpacing: 0,
//               itemDirection: 'left-to-right',
//               itemWidth: 80,
//               itemHeight: 20,
//               itemOpacity: 0.75,
//               symbolSize: 12,
//               symbolShape: 'circle',
//               symbolBorderColor: 'rgba(0, 0, 0, .5)',
//               effects: [
//                 {
//                   on: 'hover',
//                   style: {
//                     itemBackground: 'rgba(0, 0, 0, .03)',
//                     itemOpacity: 1
//                   }
//                 }
//               ]
//             }
//           ]}
//         /></div>
//     </>
//   )
// }


export default LineChart;