import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { DataItem } from './CustomAreaChart';

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: string;
    payload: {
      previousValue: string;
      date: string;
      index: number;
      value: string;
    };
  }[];
  label?: string;
  position?: { x: number; y: number } | null;
  isYears?: boolean;
  data: DataItem[];
}

const CustomTooltip = ({
  active,
  payload,
  position,
  isYears,
  data,
}: CustomTooltipProps) => {
  const formatDate = (date: string | Date) =>
    format(date, 'd MMMM yyyy', { locale: ru });

  const calculatePercentageChange = (
    currentValue: string,
    previousValue: string | null,
    isYears: boolean,
  ) => {
    if (!previousValue || previousValue === '0' || previousValue === '5960')
      return null;

    const previous = parseFloat(previousValue);
    const current = parseFloat(currentValue);

    if (!isNaN(previous) && !isNaN(current) && previous !== 0) {
      return isYears
        ? ((previous - current) / current) * 100
        : ((current - previous) / previous) * 100;
    }
    return null;
  };

  if (!active || !payload || !payload.length || !payload[0]?.payload)
    return null;

  const currentValue = payload[0].value;
  const previousValue = payload[0].payload.previousValue;
  const { date, index } = payload[0].payload;

  const percentageDiff = calculatePercentageChange(
    currentValue,
    previousValue,
    isYears || false,
  );

  const DECEMBER_SUFFIX = '-12-31';
  const formattedDate = isYears ? `${date}${DECEMBER_SUFFIX}` : date;

  const currentDate = new Date();
  const isLastDateInYear = index === data.length - 1 && isYears;
  const displayDate = isLastDateInYear
    ? formatDate(currentDate)
    : formatDate(formattedDate);

  return (
    <div
      className="flex items-center flex-col justify-center w-max bg-[#8979FF] pt-1 pb-2 px-3 text-xs text-white rounded relative font-semibold"
      style={{
        position: 'absolute',
        left: position?.x,
        top: position?.y !== undefined ? position.y - 20 : 0,
        pointerEvents: 'none',
        transform: 'translate(-50%, -100%)',
      }}
    >
      <span className="text-sm">
        1&#36; = {Number(isYears ? previousValue : currentValue).toFixed(2)}
        &#8381;
      </span>
      <span>{displayDate}</span>
      {percentageDiff !== null && (
        <span
          className={`block mt-1 ${
            percentageDiff > 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {percentageDiff > 0 ? '+' : ''}
          {percentageDiff.toFixed(2)}%
        </span>
      )}
    </div>
  );
};

export default CustomTooltip;
