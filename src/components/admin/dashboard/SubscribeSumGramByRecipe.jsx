import React, { useEffect, useState } from 'react';

import Spinner from '/src/components/atoms/Spinner';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import useDeviceState from '/util/hook/useDeviceState';

import dynamic from 'next/dynamic';
const ResponsivePie = dynamic(
  () => import('@nivo/pie').then((m) => m.ResponsivePie),
  { ssr: false },
);

export default function SubscribeSumGramByRecipe({ chartData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  // const { isMobile, deviceWidth } = useDeviceState();

  useEffect(() => {
    const data = chartData?.map((item, idx) => ({
      id: item.recipeName,
      label: item.recipeName,
      value: Math.round(item.sum),
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
    }));
    setData(data);
  }, []);

  console.log('chartData>>>', chartData);
  // console.log('GRAPH DATA>>>', data);

  return (
    <>
      <div data-title={'chart-container'}>
        {isLoading ? (
          <AmdinErrorMessage loading={<Spinner />} />
        ) : (
          <div style={{ height: '28rem' }}>
            <ResponsivePie
              data={data}
              margin={{ top: 40, right: 240, bottom: 20, left: 0 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 0]],
              }}
              enableArcLinkLabels={false}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 2]],
              }}
              tooltip={({ datum }) => (
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div
                    style={{
                      padding: '0px 46px',
                      marginRight: '40px',
                      backgroundColor: datum.color,
                      display: 'inline',
                    }}
                  ></div>
                  {datum.label}:{' '}
                  <strong>{`${datum.value.toLocaleString()}`}</strong>g
                </div>
              )}
              legends={[
                {
                  anchor: 'right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: -20,
                  itemsSpacing: 10,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000',
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        )}
      </div>
    </>
  );
}
