import React, { FC, useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Button, ButtonGroup } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DateRange, DateRangePicker } from '@mui/x-date-pickers-pro';
import styles from './DataRangeFilter.module.scss';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';
import useFilterDateRange from '../model/dateRangeStore';
import compareDates from '../lib/compareDates';

interface DateRangeFilterProps {
  onSubmit: () => void;
}

dayjs.extend(utc);
const DateRangeFilter: FC<DateRangeFilterProps> = (
  {
    onSubmit,
  },
) => {
  const today = dayjs();
  const [dateRangeLocal, setDateRangeLocal] = useState<DateRange<Dayjs>>([null, null]);
  const {
    filterDate,
    setFilterDate,
  } = useFilterDateRange((state) => state);
  const { dateRange } = filterDate;

  const [activeButton, setActiveButton] = useState<string | null>(null);
  const month = today.subtract(1, 'month');
  const week = today.subtract(1, 'week');
  const handleMonthClick = () => {
    setDateRangeLocal([month, today]);
  };

  const handleWeekClick = () => {
    setDateRangeLocal([week, today]);
  };

  const handleOneDayClick = () => {
    setDateRangeLocal([today, today]);
  };

  const handleOkClick = () => {
    setFilterDate(dateRangeLocal);
    onSubmit();
  };

  const handleResetClick = () => {
    setDateRangeLocal([null, null]);
    setFilterDate([null, null]);
    onSubmit();
  };

  useEffect(() => {
    setDateRangeLocal([dayjs(dateRange[0]), dayjs(dateRange[1])]);
  }, [dateRange]);

  useEffect(() => {
    const range = compareDates(dateRangeLocal);
    setActiveButton(range);
  }, [dateRangeLocal]);

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
          timezone="UTC"
          value={dateRangeLocal}
          onChange={(newValue) => setDateRangeLocal(newValue)}
        />
        <ButtonGroup variant="text" sx={{ m: 1 }}>
          <Button
            variant={activeButton === 'month' ? 'contained' : 'text'}
            onClick={handleMonthClick}
          >
            Month
          </Button>
          <Button
            variant={activeButton === 'week' ? 'contained' : 'text'}
            onClick={handleWeekClick}
          >
            Week
          </Button>
          <Button
            variant={activeButton === 'day' ? 'contained' : 'text'}
            onClick={handleOneDayClick}
          >
            Day
          </Button>
        </ButtonGroup>
        <ButtonGroup variant="text" sx={{ m: 1 }}>
          <Button onClick={handleOkClick}>OK</Button>
          <Button onClick={handleResetClick}>Reset</Button>
        </ButtonGroup>
      </LocalizationProvider>
    </div>
  );
};

export default DateRangeFilter;
