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
  const formatDate = (date: string) => {
    return format(date, 'd MMMM yyyy', { locale: ru });
  };

  if (active && payload && payload.length) {
    const currentValue = payload[0].value;
    const previousValue = payload[0].payload.previousValue;
    let percentageDiff = null;

    if (
      payload[0].payload &&
      payload[0].payload.previousValue !== '0' &&
      payload[0].payload.previousValue !== '5960'
    ) {
      if (previousValue !== undefined && previousValue !== null) {
        percentageDiff = isYears
          ? ((+previousValue - +currentValue) / +currentValue) * 100
          : ((+currentValue - +previousValue) / +previousValue) * 100;
      }
    }

    const december = isYears
      ? `${payload[0].payload.date}-12-31`
      : payload[0].payload.date;

    const currentDate = new Date();

    const isLastDateinYear =
      payload[0].payload.index === data.length - 1 && isYears;

    const lastDate = isLastDateinYear
      ? formatDate(currentDate.toDateString())
      : formatDate(december);

    return (
      <div
        className="flex items-center flex-col justify-center w-max bg-[#8979FF] pt-1 pb-2 px-3 text-xs text-white rounded relative font-semibold"
        style={{
          position: 'absolute',
          left: position?.x,
          top: position?.y !== undefined ? position?.y - 20 : 0,
          pointerEvents: 'none',
          transform: 'translate(-50%, -100%)',
        }}
      >
        <span className=" text-sm">
          1&#36; = {Number(isYears ? previousValue : currentValue).toFixed(2)}
          &#8381;
        </span>
        <span>{isYears ? lastDate : formatDate(payload[0].payload.date)}</span>
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
  }

  return null;
};

export default CustomTooltip;
