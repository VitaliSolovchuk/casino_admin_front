import React, { FC, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Button } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { DateRange, DateRangePicker } from '@mui/x-date-pickers-pro';
import styles from './DataRangeFilter.module.scss';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';
import useFilterDateRange from '../model/dateRangeStore';

// type FilterChangeHandler = (dates: Record<string, any>) => void;

interface DateRangeFilterProps {
  // onFilterChange: FilterChangeHandler;
  onSubmit: () => void
  // currentFilters: Record<string, any>;
}

const DateRangeFilter: FC<DateRangeFilterProps> = (
  {
    onSubmit,
  },
) => {
  const today = dayjs();
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([today, today]);
  const {
    filterDate,
    setFilterDate,
  } = useFilterDateRange((state) => state);
  const handleMonthClick = () => {
    const newStartDate = today.subtract(1, 'month');
    setDateRange([newStartDate, today]);
  };

  const handleWeekClick = () => {
    const newStartDate = today.subtract(1, 'week');
    setDateRange([newStartDate, today]);
  };

  const handleOneDayClick = () => {
    setDateRange([today, today]);
  };

  const handleOkClick = () => {
    setFilterDate(dateRange);
    onSubmit();
  };

  // const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
  //   {
  //     label: 'Day',
  //     getValue: () => [today, today],
  //   },
  //   {
  //     label: 'Week',
  //     getValue: () => [today.subtract(1, 'week'), today],
  //   },
  //   {
  //     label: 'Month',
  //     getValue: () => [today.subtract(1, 'month'), today],
  //   },
  // ];

  return (
    <div className={styles.filters}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <DateRangePicker
          calendars={1}
          value={dateRange}
          onChange={(newValue) => setDateRange(newValue)}
        />
        <Button onClick={handleMonthClick}>Month</Button>
        <Button onClick={handleWeekClick}>Week</Button>
        <Button onClick={handleOneDayClick}>Day</Button>
        <Button onClick={handleOkClick}>OK</Button>
      </LocalizationProvider>
    </div>
  );
};

export default DateRangeFilter;
