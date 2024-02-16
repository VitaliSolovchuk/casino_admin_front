import React, { FC, SetStateAction, useState } from 'react';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/lab';
import {
  FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps,
  TextField,
  TextFieldVariants,
} from '@mui/material';

type FilterChangeHandler = (dates: SetStateAction<[Date | null, Date | null]>) => void;
interface DateRangeFilterProps {
  onFilterChange: FilterChangeHandler; // Указываем тип параметра onFilterChange
}
interface DateFilterProps {
  value?: Date;
  onChange: (date: Date | null) => void;
}

export const DateRangeFilter: FC<DateRangeFilterProps> = ({ onFilterChange }) => {
  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([null, null]);
  const handleDateChange = (newDates: SetStateAction<[Date | null, Date | null]>) => {
    setSelectedDates(newDates);
    onFilterChange(newDates);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangeCalendar
        calendars={1}
        value={selectedDates}
        onChange={(newValue) => handleDateChange(newValue)}
      />
    </LocalizationProvider>
  );
};


export const DateFilter: FC<DateFilterProps> = ({ value, onChange }) => (
  <DatePicker
    value={value}
    onChange={(date: Date | null) => onChange(date)}
    renderInput={(params: React.JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, 'variant'>) => <TextField {...params} />}
  />
);
