import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from 'react';
import { MoonLoader } from 'react-spinners';

import CustomSelect from './components/CustomSelect';

import {
  useGetValutesQuery,
  useGetValutesAllYearsQuery,
  IValutes,
} from './utils/api';
import createYearList from './utils/createYearList';
import { format } from 'date-fns';
import { SelectChangeEvent } from '@mui/material/Select';

const CustomAreaChartLazy = lazy(() => import('./components/CustomAreaChart'));

function App() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = format(currentDate, 'yyyy-MM-dd');

  const years = useMemo(() => createYearList(1998), []);

  const [dateRange, setDateRange] = useState({
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear}-12-31`,
    isFullYearData: false,
    isCurrentMonth: false,
    activeYear: currentYear.toString(),
    isSelectOpen: false,
    selectYear: currentYear.toString(),
  });

  const {
    data: Valutes,
    isSuccess,
    isFetching,
  } = useGetValutesQuery({
    charCode: 'USD',
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const { data: getValutesAllYears, isSuccess: getValutesAllYearsSuccess } =
    useGetValutesAllYearsQuery();

  const [averageValue, setAverageValue] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);

  const makeAverageValue = useCallback((valutes: IValutes[] | undefined) => {
    if (!valutes || valutes.length === 0) {
      setAverageValue(0);
      return;
    }
    const sum = valutes.reduce(
      (acc, val) => acc + (parseFloat(val.value) || 0),
      0,
    );
    setAverageValue(sum / valutes.length);
  }, []);

  const makePercentageChange = useCallback((valutes?: IValutes[]) => {
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
    setPercentageChange(((lastValue - firstValue) / firstValue) * 100);
  }, []);

  const updateMetrics = useCallback(
    (valutes: IValutes[] | undefined) => {
      if (valutes) {
        makeAverageValue(valutes);
        makePercentageChange(valutes);
      }
    },
    [makeAverageValue, makePercentageChange],
  );

  const handleChangeYears = (event: SelectChangeEvent) => {
    setDateRange((prevState) => ({
      ...prevState,
      startDate: `${event.target.value}-01-01`,
      endDate: `${event.target.value}-12-31`,
      isFullYearData: false,
      isCurrentMonth: false,
      selectYear: event.target.value,
    }));
  };

  const handleSelectOpen = () => {
    setDateRange((prevState) => ({
      ...prevState,
      isSelectOpen: true,
    }));
  };

  const handleSelectClose = () => {
    setDateRange((prevState) => ({
      ...prevState,
      isSelectOpen: false,
    }));
  };

  const handleAllTimeClick = useCallback(() => {
    setDateRange((prevState) => ({
      ...prevState,
      isFullYearData: true,
      isCurrentMonth: false,
    }));
  }, []);

  const handleCurrentMonthClick = useCallback(() => {
    setDateRange((prevState) => ({
      ...prevState,
      startDate: `${currentYear}-0${currentMonth + 1}-01`,
      endDate: currentDay,
      isFullYearData: false,
      isCurrentMonth: true,
      activeYear: currentYear.toString(),
    }));
  }, [currentYear, currentMonth, currentDay]);

  console.log(dateRange);

  useEffect(() => {
    if ((dateRange.isCurrentMonth && !dateRange.isFullYearData) || Valutes) {
      updateMetrics(Valutes);
    }
  }, [Valutes, dateRange, updateMetrics]);

  useEffect(() => {
    if (dateRange.isFullYearData) {
      updateMetrics(getValutesAllYears);
    }
  }, [getValutesAllYears, dateRange.isFullYearData, updateMetrics]);

  if (!Valutes) {
    return (
      <div className="container mx-auto h-screen relative flex flex-col items-center justify-center">
        <MoonLoader color="#8979FF" size={40} />
      </div>
    );
  }

  return (
    <div className="container mx-auto h-screen relative flex flex-col items-center justify-center ">
      <div className="mb-4 text-white">
        Средний курс валюты: 1$ = {averageValue.toFixed(2)}
      </div>
      <div className="mb-6 text-white">
        <span>Изменение курса валюты: </span>
        <span
          className={percentageChange > 0 ? 'text-green-500' : 'text-red-500'}
        >
          {percentageChange > 0 ? '+' : ''}
          {percentageChange.toFixed(2)}%
        </span>
      </div>

      {isSuccess && getValutesAllYearsSuccess && (
        <Suspense fallback={<MoonLoader color="#8979FF" size={40} />}>
          <CustomAreaChartLazy
            data={dateRange.isFullYearData ? getValutesAllYears : Valutes}
            isFullYear={dateRange.isFullYearData}
            isCurrentMonth={dateRange.isCurrentMonth}
            isFetching={isFetching}
          />
        </Suspense>
      )}

      <div className="flex justify-center gap-3 flex-wrap mt-7">
        <CustomSelect
          value={dateRange.selectYear}
          onChange={handleChangeYears}
          selectValues={years}
          onOpen={handleSelectOpen}
          onClose={handleSelectClose}
        />
        <button
          className={`${
            dateRange.isCurrentMonth &&
            !dateRange.isFullYearData &&
            !dateRange.isSelectOpen
              ? 'bg-fuchsia-700 cursor-default'
              : 'bg-violet-500 hover:bg-fuchsia-700'
          } text-white font-bold py-2 px-4 rounded transition-colors  duration-300`}
          onClick={handleCurrentMonthClick}
        >
          Текущий месяц
        </button>
        <button
          className={`${
            dateRange.isFullYearData && !dateRange.isSelectOpen
              ? 'bg-pink-600 cursor-default'
              : 'bg-violet-500 hover:bg-pink-600'
          } text-white font-bold py-2 px-4 rounded transition-colors duration-300`}
          onClick={handleAllTimeClick}
        >
          За все время
        </button>
      </div>
    </div>
  );
}

export default App;
