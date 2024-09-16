import { useState } from 'react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import CustomTooltip from './CustomTooltip';

export interface DataItem {
  value: string;
  previousValue: string;
  date: string;
  index: number;
}

const CustomAreaChart = ({
  data,
  isFullYear,
  isCurrentMonth,
  isFetching,
}: {
  data: DataItem[];
  isFullYear: boolean;
  isCurrentMonth: boolean;
  isFetching: boolean;
}) => {
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseMove = (e: any) => {
    if (e && e.chartX !== undefined && e.chartY !== undefined) {
      setTooltipPos({ x: e.chartX, y: e.chartY });
    } else {
      setTooltipPos(null);
    }
  };

  const payloadData = data.map((item) => ({
    value: item.value,
    payload: {
      previousValue: item.previousValue,
      date: item.date,
      index: item.index,
      value: item.value,
    },
  }));

  const formatXAxis = (tickItem: string) => {
    const monthName = format(tickItem, 'LLLL', { locale: ru });
    return capitalizeFirstLetter(monthName);
  };

  const formatXAxisYear = (tickItem: string) => {
    const year = format(tickItem, 'yyyy', { locale: ru });
    return capitalizeFirstLetter(year);
  };

  const filterXAxisTicks = (
    tickItem: string,
    index: number,
    array: string[],
  ) => {
    return (
      index === 0 || format(tickItem, 'M') !== format(array[index - 1], 'M')
    );
  };

  const formatXAxisMonth = (tickItem: string, index: number) => {
    const monthName = format(tickItem, 'LLLL', { locale: ru });

    return index === 0
      ? capitalizeFirstLetter(monthName)
      : format(tickItem, 'd', { locale: ru });
  };

  return (
    <ResponsiveContainer
      width="100%"
      height={240}
      className="flex  justify-center"
    >
      <AreaChart
        data={data}
        margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
        onMouseLeave={() => setTooltipPos(null)}
        onMouseMove={handleMouseMove}
      >
        <defs>
          <linearGradient
            id="paint0_linear_0_11349"
            x1="250.5"
            y1="97.8217"
            x2="250.5"
            y2="195"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8979FF" stopOpacity="0.3" />
            <stop offset="1" stopColor="#8979FF" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          stroke="rgba(255, 255, 255, 0.35)"
          strokeDasharray="3"
        />

        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tickFormatter={
            isFullYear
              ? formatXAxisYear
              : isCurrentMonth
              ? formatXAxisMonth
              : formatXAxis
          }
          ticks={
            isFullYear || isCurrentMonth
              ? data.map((d) => d.date)
              : data.map((d) => d.date).filter(filterXAxisTicks)
          }
          tick={{
            fill: '#fff',
            fontSize: 12,
            fontWeight: 600,
          }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{
            fill: '#fff',
            fontSize: 12,
            fontWeight: 600,
          }}
          tickFormatter={(value) => `${value}`}
          tickCount={10}
        />
        <Tooltip
          cursor={false}
          content={
            <CustomTooltip
              position={tooltipPos}
              payload={payloadData}
              isYears={isFullYear}
              data={data}
            />
          }
          isAnimationActive={true}
        />

        {isFetching ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
              width="30"
              height="30"
              x="50%"
              y="35%"
            >
              <radialGradient
                id="a11"
                cx=".66"
                fx=".66"
                cy=".3125"
                fy=".3125"
                gradientTransform="scale(1.5)"
              >
                <stop offset="0" stop-color="#8979FF"></stop>
                <stop offset=".3" stop-color="#8979FF" stop-opacity=".9"></stop>
                <stop offset=".6" stop-color="#8979FF" stop-opacity=".6"></stop>
                <stop offset=".8" stop-color="#8979FF" stop-opacity=".3"></stop>
                <stop offset="1" stop-color="#8979FF" stop-opacity="0"></stop>
              </radialGradient>
              <circle
                transform-origin="center"
                fill="none"
                stroke="url(#a11)"
                stroke-width="15"
                stroke-linecap="round"
                stroke-dasharray="200 1000"
                stroke-dashoffset="0"
                cx="100"
                cy="100"
                r="70"
              >
                <animateTransform
                  type="rotate"
                  attributeName="transform"
                  calcMode="spline"
                  dur="0.5"
                  values="360;0"
                  keyTimes="0;1"
                  keySplines="0 0 1 1"
                  repeatCount="indefinite"
                ></animateTransform>
              </circle>
              <circle
                transform-origin="center"
                fill="none"
                opacity=".2"
                stroke="#8979FF"
                stroke-width="15"
                stroke-linecap="round"
                cx="100"
                cy="100"
                r="70"
              ></circle>
            </svg>
          </>
        ) : (
          <Area
            type="linear"
            dataKey="value"
            stroke="#8979FF"
            strokeWidth="1"
            fill="url(#paint0_linear_0_11349)"
            dot={{ fill: '#4379EE', stroke: '#4379EE', r: 0, fillOpacity: 1 }}
            activeDot={{ fill: '#4880ff', stroke: '#4880ff', r: 0 }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomAreaChart;
