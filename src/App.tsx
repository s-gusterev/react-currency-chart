import { useState, useEffect, useCallback } from 'react';
import { lazy, Suspense } from 'react';

import { MoonLoader } from 'react-spinners';

const CustomAreaChartLazy = lazy(() => import('./components/CustomAreaChart'));

import {
  useGetValutesQuery,
  useGetValutesAllYearsQuery,
  IValutes,
} from './utils/api';
import createYearList from './utils/createYearList';

function App() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const currentDay = new Date().toISOString().split('T')[0];

  const [averageValue, setAverageValue] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);

  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);

  const [isFullYearData, setIsFullYearData] = useState(false);

  const [activeYear, setActiveYear] = useState(currentYear.toString());

  const [isCurrentMonth, setIsCurrentMonth] = useState(false);

  const years = createYearList(1998);

  const {
    data: Valutes,
    isSuccess,
    isFetching,
  } = useGetValutesQuery({
    charCode: 'USD',
    startDate: startDate,
    endDate: endDate,
  });

  const { data: getValutesAllYears, isSuccess: getValutesAllYearsSuccess } =
    useGetValutesAllYearsQuery();

  const makeAverageValue = useCallback(
    (valutes: IValutes[] | undefined) => {
      if (!valutes || valutes.length === 0) {
        setAverageValue(0);
        return;
      }

      const sum = valutes.reduce(
        (acc, val) => acc + (parseFloat(val.value) || 0),
        0,
      );
      const average = sum / valutes.length;

      setAverageValue(average);
    },
    [setAverageValue],
  );

  const makePercentageChange = useCallback(
    (valutes?: IValutes[]) => {
      if (!valutes || valutes.length < 2) {
        setPercentageChange(0);
        return;
      }

      const firstValue = parseFloat(valutes[0].value);
      const lastValue = parseFloat(valutes[valutes.length - 1].value);

      if (isNaN(firstValue) || isNaN(lastValue) || firstValue === 0) {
        setPercentageChange(0);
        return;
      }

      const percentageChange = ((lastValue - firstValue) / firstValue) * 100;
      setPercentageChange(percentageChange);
    },
    [setPercentageChange],
  );

  const updateMetrics = useCallback(
    (valutes: IValutes[] | undefined) => {
      if (valutes) {
        makeAverageValue(valutes);
        makePercentageChange(valutes);
      }
    },
    [makeAverageValue, makePercentageChange],
  );

  useEffect(() => {
    if ((isCurrentMonth && !isFullYearData) || Valutes) {
      updateMetrics(Valutes);
    }
  }, [Valutes, isCurrentMonth, isFullYearData, updateMetrics]);

  useEffect(() => {
    if (isFullYearData) {
      updateMetrics(getValutesAllYears);
    }
  }, [getValutesAllYears, isFullYearData, updateMetrics]);

  if (!Valutes) {
    return (
      <div className="container mx-auto h-screen relative flex flex-col items-center justify-center">
        <MoonLoader color="#8979FF" size={40} />
      </div>
    );
  }

  return (
    <div className="container mx-auto h-screen relative flex flex-col items-center justify-center">
      <div className="mb-4 text-white">
        Средний курс валюты: 1$ = {averageValue.toFixed(2)}
      </div>
      <div className="mb-6 text-white">
        <span>Изменение курса валюты: </span>
        <span
          className={percentageChange > 0 ? 'text-green-500' : 'text-red-500'}
        >
          {percentageChange > 0 ? '+' : ''}
          {+percentageChange.toFixed(2)}%
        </span>
      </div>

      {isSuccess && getValutesAllYearsSuccess && (
        <Suspense fallback={<MoonLoader color="#8979FF" size={40} />}>
          <CustomAreaChartLazy
            data={isFullYearData ? getValutesAllYears : Valutes}
            isFullYear={isFullYearData}
            isCurrentMonth={isCurrentMonth}
            isFetching={isFetching}
          />
        </Suspense>
      )}

      <div className="flex justify-center gap-3 flex-wrap mt-7 ">
        {years.map((year) => (
          <button
            key={year}
            className={`${
              activeYear === year && !isFullYearData && !isCurrentMonth
                ? 'bg-blue-500 cursor-default'
                : 'bg-violet-500 hover:bg-blue-500'
            }  text-white font-bold py-2 px-4 rounded`}
            onClick={() => {
              setStartDate(year + '-01-01');
              setEndDate(year + '-12-31');
              setIsFullYearData(false);
              setActiveYear(year);
              setIsCurrentMonth(false);
            }}
          >
            {year}
          </button>
        ))}

        <button
          className={`${
            isFullYearData
              ? 'bg-pink-600 cursor-default'
              : 'bg-violet-500 hover:bg-pink-600'
          }   text-white font-bold py-2 px-4 rounded`}
          onClick={() => {
            setIsFullYearData(true);
            setIsCurrentMonth(false);
          }}
        >
          За все время
        </button>
        <button
          className={`${
            isCurrentMonth && !isFullYearData
              ? 'bg-fuchsia-700 cursor-default'
              : 'bg-violet-500 hover:bg-fuchsia-700'
          }   text-white font-bold py-2 px-4 rounded`}
          onClick={() => {
            setStartDate(`${currentYear}-0${currentMonth + 1}-01`);
            setEndDate(currentDay);
            setIsFullYearData(false);
            setIsCurrentMonth(true);
          }}
        >
          Текущий месяц
        </button>
      </div>
    </div>
  );
}

export default App;
