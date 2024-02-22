import { DateRange } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';

const compareDates = (dateArray: DateRange<Dayjs>) => {
  if (dateArray.length !== 2) {
    return null;
  }

  const [startDate, endDate] = dateArray;

  const diffInDays = endDate?.diff(startDate, 'day');
  const diffInMonths = endDate?.diff(startDate, 'month');

  if (diffInDays === 0) {
    return 'day';
  } if (diffInDays === 7) {
    return 'week';
  } if (diffInMonths === 1 && startDate?.date() === endDate?.date()) {
    return 'month';
  }
  return null;
};

export default compareDates;
