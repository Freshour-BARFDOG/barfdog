import React, { useEffect, useState } from 'react';
import Spinner from '/src/components/atoms/Spinner';

import dynamic from 'next/dynamic';
const ResponsiveCirclePacking = dynamic(
  () => import('@nivo/circle-packing').then((m) => m.ResponsiveCirclePacking),
  { ssr: false },
);

// const CustomLabel = ({ x, y, text, color, fontWeight }) => {
//   // 텍스트를 줄 바꿈을 적용하여 렌더링합니다.
//   const lines = text?.split('\n');
//   return (
//     <g transform={`translate(${x}, ${y})`}>
//       {lines?.map((line, index) => (
//         <text
//           key={index}
//           y={index * 20} // Line height
//           fill={color}
//           fontSize={16}
//           fontWeight={fontWeight}
//           textAnchor="middle"
//           dominantBaseline="middle"
//         >
//           {line}
//         </text>
//       ))}
//     </g>
//   );
// };

export default function StatusChart({ chartData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    // const data = {
    //   name: 'nivo',
    //   color: 'hsl(56, 70%, 50%)',
    //   loc: 2,
    //   children: [
    //     {
    //       name: 'viz',
    //       color: 'hsl(250, 70%, 50%)',
    //       loc: 2,
    //     },
    //   ],
    // };

    const data = {
      name: '',
      color: '#fff',
      children: [
        { id: '건강해요', loc: 10, color: '#ececec' },
        { id: '다이어트 필요', loc: 20, color: '#ececec' },
        { id: '심각한 비만', loc: 5, color: '#ececec' },
        { id: '말랐어요', loc: 5, color: '#FFC5C5' },
      ],
    };

    setData(data);
  }, []);

  const theme = {
    labels: {
      text: {
        fontSize: 16,
        fontWeight: 'normal',
      },
    },
  };

  console.log(data);

  return (
    <div
      data-title={'chart-container'}
      style={{
        width: '400px',
        height: '300px',
      }}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <div style={{ height: '20rem', width: '100%' }}>
          <ResponsiveCirclePacking
            data={data}
            id="id"
            value="loc"
            // colors="#fff"
            colors={(node) => node.data.color}
            padding={5}
            enableLabels={true}
            //   labelSkipWidth={100}
            //   labelSkipHeight={100}
            //   labelsSkipRadius={0}
            // labelTextColor={(node) => node.data.color}
            labelTextColor={(node) => {
              if (node.data.id === '말랐어요') {
                return '#fff'; // Specific color for '말랐어요'
              }
              return '#929292'; // Default color for other labels
            }}
            theme={theme}
            enableTooltip={false}
            tooltip={() => <></>}
            // label={(node) => {
            //   const { id } = node;
            //   console.log(node);
            //   const fontWeight = id === '말랐어요' ? 'bold' : 'normal';
            //   const labelColor = id === '말랐어요' ? '#fff' : '#929292';
            //   return (
            //     <CustomLabel
            //       x={node.x}
            //       y={node.y}
            //       text={id}
            //       color={labelColor}
            //       fontWeight={fontWeight}
            //     />
            //   );
            // }}
            // label={({ id, x, y, color }) => {
            //   const fontWeight = id === '말랐어요' ? 'bold' : 'normal'; // Font weight for specific label
            //   const labelColor = id === '말랐어요' ? '#fff' : '#929292'; // Color for specific label
            //   return (
            //     <CustomLabel
            //       x={100}
            //       y={20}
            //       text={id}
            //       color={labelColor}
            //       fontWeight={fontWeight}
            //     />
            //   );
            // }}
            // theme={{
            //   labels: {
            //     text: {
            //       fontSize: 14,
            //     },
            //   },
            // }}

            // label={({ id, x, y, color }) => {
            //   console.log('Label position:', { id, x, y, color }); // 디버깅
            //   return (
            //     <text
            //       x={x}
            //       y={y}
            //       fill={color || '#000000'}
            //       fontSize={16}
            //       textAnchor="middle"
            //       dominantBaseline="central"
            //     >
            //       {id}
            //     </text>
            //   );
            // }}

            // label={renderLabel}
            // label={({ id, x, y, color }) => {
            //   // Custom rendering of labels
            //   const isSpecial = id === '말랐어요'; // Check if label is '말랐어요'
            //   return (
            //     <text
            //       x={x}
            //       y={y}
            //       fill={isSpecial ? '#BE1A21' : '#000000'}
            //       fontSize={isSpecial ? 18 : 14} // Special font size for '말랐어요'
            //       fontFamily="Arial, sans-serif"
            //       textAnchor="middle"
            //       dominantBaseline="central"
            //     >
            //       {id}
            //     </text>
            //   );
            // }}

            //   defs={[
            //     {
            //       id: 'lines',
            //       type: 'patternLines',
            //       background: 'none',
            //       color: 'inherit',
            //       rotation: -45,
            //       lineWidth: 5,
            //       spacing: 8,
            //     },
            //   ]}
            //   motionConfig={{
            //     mass: 1,
            //     tension: 14,
            //     friction: 216,
            //     clamp: false,
            //     precision: 0.01,
            //     velocity: 0,
          />
        </div>
      )}
    </div>
  );
}
