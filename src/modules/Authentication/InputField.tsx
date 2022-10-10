import { InputAdornment, TextField } from '@mui/material';
import { Controller, useController, useFormContext } from 'react-hook-form';

type Props = {
  name: string;
  label?: string;
  rightElement?: JSX.Element;
  leftElement?: JSX.Element;
  type?: string;
  defaultValue?: unknown;
};

const InputField = (props: Props) => {
  const { label, name, rightElement, leftElement, type = 'text', defaultValue } = props;

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
    <TextField
      onChange={onChange}
      onBlur={onBlur}
      name={name}
      value={value}
      InputProps={{
        startAdornment: leftElement && (
          <InputAdornment position="start">{leftElement}</InputAdornment>
        ),
        endAdornment: rightElement && (
          <InputAdornment position="end">{rightElement}</InputAdornment>
        ),
      }}
      type={type}
      sx={{
        my: '10px',
        '.MuiFilledInput-root': {
          boxSizing: 'border-box',
          border: '2px solid transparent',
          borderRadius: '4px',
          '&:before, :after, :hover:not(.Mui-disabled):before': {
            borderBottom: 0,
          },
          '&.Mui-focused': {
            border: '2px solid #9b57d3',
          },
          '&.Mui-error': {
            border: '2px solid #ff0000',
          },
          ' .MuiFilledInput-input': {
            padding: '23px 10px 6px 10px',
          },
        },
      }}
      error={Boolean(error?.message)}
      label={error?.message || label}
      variant="filled"
    />
  );
};

export default InputField;
