import React, { FC, useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Button, ButtonGroup } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DateRange, DateRangePicker } from '@mui/x-date-pickers-pro';
import Box from '@mui/material/Box';
import { useMediaQuery } from 'react-responsive';
import styles from './DataRangeFilter.module.scss';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';
import useFilterDateRange from '../model/dateRangeStore';
import compareDates from '../lib/compareDates';

dayjs.extend(utc);
const DateRangeFilter: FC = () => {
  const today = dayjs().startOf('day');
  // const tomorrow = today.add(1, 'day');
  // Начало текущего дня
  const startOfToday = dayjs().startOf('day');
  // Конец текущего дня
  const endOfToday = dayjs().endOf('day');

  const { filterDate, setFilterDate } = useFilterDateRange((state) => state);
  const [dateRangeLocal, setDateRangeLocal] = useState<DateRange<Dayjs>>([startOfToday, endOfToday]);
  const { dateRange } = filterDate;
  const [shouldShowConfirmButton, setShouldShowConfirmButton] = useState(false);

  const [activeButton, setActiveButton] = useState<string | null>(null);
  const month = today.subtract(1, 'month');
  const week = today.subtract(1, 'week');

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const handleMonthClick = () => {
    setDateRangeLocal([month, endOfToday]);
  };

  const handleWeekClick = () => {
    setDateRangeLocal([week, endOfToday]);
  };

  const handleOneDayClick = () => {
    setDateRangeLocal([startOfToday, endOfToday]);
  };

  const handleOkClick = () => {
    setFilterDate(dateRangeLocal);
  };

  const handleResetClick = () => {
    setDateRangeLocal([null, null]);
    setFilterDate([null, null]);
    setShouldShowConfirmButton(false);
  };

  useEffect(() => {
    setDateRangeLocal([dayjs(dateRange[0]), dayjs(dateRange[1])]);
  }, [dateRange]);

  useEffect(() => {
    const range = compareDates(dateRangeLocal);
    setActiveButton(range);
  }, [dateRangeLocal]);

  useEffect(() => {
    const isDateRangeEqual = (
      (String(dateRange[0]) === 'null' && String(dateRangeLocal[0]) === 'Invalid Date')
        ? false
        : (String(dateRange[0]) !== String(dateRangeLocal[0]) || String(dateRange[1]) !== String(dateRangeLocal[1])
        ));

    if (isDateRangeEqual !== shouldShowConfirmButton) {
      setShouldShowConfirmButton(isDateRangeEqual);
    }
  }, [dateRange, dateRangeLocal, shouldShowConfirmButton]);
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
          slotProps={{
            textField: {
              size: isMobile ? 'small' : 'medium',
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
          }}
        >
          <ButtonGroup variant="text" sx={{ m: 1 }}>
            <Button
              variant={activeButton === 'month' ? 'contained' : 'text'}
              size={isMobile ? 'small' : 'medium'}
              onClick={handleMonthClick}
            >
              Month
            </Button>
            <Button
              variant={activeButton === 'week' ? 'contained' : 'text'}
              size={isMobile ? 'small' : 'medium'}
              onClick={handleWeekClick}
            >
              Week
            </Button>
            <Button
              variant={activeButton === 'day' ? 'contained' : 'text'}
              size={isMobile ? 'small' : 'medium'}
              onClick={handleOneDayClick}
            >
              Day
            </Button>
          </ButtonGroup>
          <ButtonGroup
            variant="outlined"
            sx={{
              m: 1,
              '& .MuiButton-root:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
          >
            {shouldShowConfirmButton && (
              <Button
                variant="contained"
                size={isMobile ? 'small' : 'medium'}
                onClick={handleOkClick}
              >
                Confirm
              </Button>
            )}
            <Button
              size={isMobile ? 'small' : 'medium'}
              onClick={handleResetClick}
            >
              Reset
            </Button>
          </ButtonGroup>
        </Box>
      </LocalizationProvider>
    </div>
  );
};

export default DateRangeFilter;
