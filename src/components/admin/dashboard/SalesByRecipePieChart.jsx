import React, { useEffect, useState } from 'react';

import Spinner from '/src/components/atoms/Spinner';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import useDeviceState from '/util/hook/useDeviceState';

import dynamic from 'next/dynamic';
const ResponsivePie = dynamic(
  () => import('@nivo/pie').then((m) => m.ResponsivePie),
  { ssr: false },
);

export default function SalesByRecipePieChart({ chartData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  // const { isMobile, deviceWidth } = useDeviceState();

  useEffect(() => {
    if (!chartData) return;

    const data = Object.entries(chartData).map(([key, value]) => ({
      id: key,
      label: key,
      value: value,
      color: `hsl(${Math.floor(Math.random() * 10)}, 70%, 50%)`,
    }));

    setData(data);
  }, [chartData]);

  // console.log('chartData>>>', chartData);
  // console.log('GRAPH DATA>>>', data);

  return (
    <>
      <div data-title={'chart-container'}>
        {isLoading ? (
          <AmdinErrorMessage loading={<Spinner />} />
        ) : (
          <div style={{ height: '22rem', width: '26rem' }}>
            <ResponsivePie
              data={data}
              margin={{ top: 0, right: 160, bottom: 0, left: 0 }}
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
                    padding: '0',
                    background: 'white',
                    border: '1px solid #ccc',
                  }}
                >
                  {datum.id} :{' '}
                  <strong>{`${datum.value.toLocaleString()}원`}</strong>
                </div>
              )}
              legends={[
                {
                  anchor: 'right',
                  direction: 'column',
                  justify: false,
                  translateX: 140,
                  translateY: 0,
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
