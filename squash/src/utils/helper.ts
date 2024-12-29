import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
}

export const timeDifference = (startTime: string, endTime: string) => {
  const today = dayjs().format('YYYY-MM-DD');

  const startDateTimeStr = `${today} ${startTime}`;
  const endDateTimeStr = `${today} ${endTime}`;

  const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
  const start = dayjs(startDateTimeStr, dateTimeFormat, true);
  const end = dayjs(endDateTimeStr, dateTimeFormat, true);

  const diff = end.diff(start);
  const diffDuration = dayjs.duration(diff);

  const hours = Math.floor(diffDuration.asHours());
  const minutes = diffDuration.minutes();

  if (hours >= 1) {
    return `${hours}hr ${minutes}m`;
  } else {
    return `${minutes} min`;
  }
}