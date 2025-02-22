import { useState, useMemo, useCallback } from 'react';
import { MoonLoader } from 'react-spinners';
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

  const handleMouseMove = useCallback(
    (e: { chartX?: number; chartY?: number }) => {
      if (e?.chartX !== undefined && e?.chartY !== undefined) {
        setTooltipPos({ x: e.chartX, y: e.chartY });
      } else {
        setTooltipPos(null);
      }
    },
    [],
  );

  const payloadData = useMemo(
    () =>
      data.map((item) => ({
        value: item.value,
        payload: {
          previousValue: item.previousValue,
          date: item.date,
          index: item.index,
          value: item.value,
        },
      })),
    [data],
  );

  const formatXAxis = useCallback(
    (tickItem: string, index: number) => {
      const date = new Date(tickItem);
      const monthName = capitalizeFirstLetter(
        format(date, 'LLLL', { locale: ru }),
      );
      if (isFullYear) {
        return format(date, 'yyyy', { locale: ru });
      }
      if (isCurrentMonth) {
        return index === 0 ? monthName : format(tickItem, 'd', { locale: ru });
      }

      return monthName;
    },
    [isFullYear, isCurrentMonth],
  );

  const filterXAxisTicks = useCallback(
    (tickItem: string, index: number, array: string[]) => {
      return (
        index === 0 ||
        format(new Date(tickItem), 'M') !==
          format(new Date(array[index - 1]), 'M')
      );
    },
    [],
  );

  const xTicks = useMemo(
    () =>
      isFullYear || isCurrentMonth
        ? data.map((d) => d.date)
        : data.map((d) => d.date).filter(filterXAxisTicks),
    [data, isFullYear, isCurrentMonth, filterXAxisTicks],
  );

  return (
    <ResponsiveContainer
      width="100%"
      height={240}
      className="flex justify-center"
    >
      {isFetching ? (
        <div className="flex flex-col justify-center items-center gap-6">
          <span className="text-white text-xs">Загрузка...</span>
          <MoonLoader color="#8979FF" size={20} />
        </div>
      ) : (
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
            strokeWidth="1"
            strokeDasharray="3"
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tickFormatter={formatXAxis}
            ticks={xTicks}
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
            tickCount={5}
          />
          <Tooltip
            cursor={{
              stroke: 'rgba(255, 255, 255, 0.35)',
              strokeWidth: 1,
              strokeDasharray: '3',
            }}
            content={
              <CustomTooltip
                position={tooltipPos}
                payload={payloadData}
                isYears={isFullYear}
                data={data}
              />
            }
          />

          <Area
            type="linear"
            dataKey="value"
            stroke="#8979FF"
            strokeWidth="1"
            fill="url(#paint0_linear_0_11349)"
            dot={{ fill: '#4379EE', stroke: '#4379EE', r: 0, fillOpacity: 1 }}
            activeDot={{
              fill: '#8B5CF6',
              stroke: '#8B5CF6',
              r: 1,
            }}
          />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
};

export default CustomAreaChart;
