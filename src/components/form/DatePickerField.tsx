import { DesktopDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { FormControl, FormHelperText, TextFieldProps, InputLabel, TextField } from '@mui/material';
import { useController, useFormContext } from 'react-hook-form';

type Props = {
  name: string;
  label?: string;
  defaultValue?: unknown;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  leftLabel?: boolean;
  disableFuture?: boolean;
};

const DatePicker = (props: Props) => {
  const { label, name, defaultValue, disabled, minDate, maxDate, disableFuture } = props;

  const { control } = useFormContext();

  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });
  return (
    <FormControl variant="standard" sx={{ width: '100%' }} error={Boolean(error?.message)}>
      <InputLabel
        disableAnimation
        shrink
        sx={{ transform: 'none', color: '#333333', fontWeight: 600 }}>
        {label}
      </InputLabel>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          inputFormat="MM/dd/yyyy"
          value={value === 'now' ? null : value || null}
          onChange={onChange}
          disableFuture={disableFuture}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          renderInput={(params: TextFieldProps) => {
            const { inputProps, ...other } = params;
            return (
              <TextField
                {...other}
                name={name}
                inputProps={{
                  ...inputProps,
                  sx: {
                    py: '8.5px',
                  },
                  error: Boolean(error?.message).toString(),
                  disabled,
                }}
                sx={{
                  padding: '0px',
                  mt: label ? '26px' : '0px',
                }}
              />
            );
          }}
        />
      </LocalizationProvider>
      {error && (
        <FormHelperText sx={{ position: 'absolute', mt: label ? '66px' : '40px' }} error>
          {error?.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default DatePicker;
