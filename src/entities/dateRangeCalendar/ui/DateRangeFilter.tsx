import React, { FC, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Button } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { DateRange, DateRangePicker } from '@mui/x-date-pickers-pro';
import styles from './DataRangeFilter.module.scss';

type FilterChangeHandler = (dates: Record<string, any>) => void;

interface DateRangeFilterProps {
  onFilterChange: FilterChangeHandler;
  onSubmit: () => void
  currentFilters: Record<string, any>;
}

const DateRangeFilter: FC<DateRangeFilterProps> = ({ onFilterChange, onSubmit, currentFilters }) => {
  const today = dayjs();
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([today, today]);

  const handleMonthClick = () => {
    const newStartDate = today.subtract(1, 'month');
    setDateRange([newStartDate, today]);
  };

  const handleWeekClick = () => {
    const newStartDate = today.subtract(1, 'week');
    setDateRange([newStartDate, today]);
  };

  const handleThreeDaysClick = () => {
    const newStartDate = today.subtract(3, 'day');
    setDateRange([newStartDate, today]);
  };

  const handleOkClick = () => {
    const updatedFilters: Record<string, any> = {
      ...currentFilters,
      dateRange,
    };
    onFilterChange(updatedFilters);
    onSubmit();
  };

  return (
    <div className={styles.filters}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateRangePicker
          calendars={1}
          value={dateRange}
          onChange={(newValue) => setDateRange(newValue)}
        />
        <Button onClick={handleMonthClick}>Month</Button>
        <Button onClick={handleWeekClick}>Week</Button>
        <Button onClick={handleThreeDaysClick}>3 Days</Button>
        <Button onClick={handleOkClick}>OK</Button>
      </LocalizationProvider>
    </div>
  );
};

export default DateRangeFilter;
