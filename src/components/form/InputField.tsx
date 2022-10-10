import { FormControl, FormHelperText, InputAdornment, InputLabel, TextField } from '@mui/material';
import { useController, useFormContext } from 'react-hook-form';

type Props = {
  name: string;
  label?: string;
  rightElement?: JSX.Element;
  leftElement?: JSX.Element;
  type?: string;
  defaultValue?: unknown;
  multiline?: boolean;
  disabled?: boolean;
};

const InputField = (props: Props) => {
  const {
    label,
    name,
    type = 'text',
    defaultValue,
    leftElement,
    rightElement,
    multiline,
    disabled,
  } = props;

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
    <FormControl
      disabled={disabled}
      variant="standard"
      sx={{ width: '100%' }}
      error={Boolean(error?.message)}>
      <InputLabel
        disableAnimation
        shrink
        sx={{ transform: 'none', color: '#333333', fontWeight: 600 }}>
        {label}
      </InputLabel>
      <TextField
        minRows={4}
        maxRows={4}
        InputProps={{
          startAdornment: leftElement && (
            <InputAdornment position="start">{leftElement}</InputAdornment>
          ),
          endAdornment: rightElement && (
            <InputAdornment position="end">{rightElement}</InputAdornment>
          ),
        }}
        multiline={multiline}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        error={Boolean(error?.message)}
        value={value || ''}
        type={type}
        disabled={disabled}
        // defaultValue={defaultValue}
        inputProps={{
          sx: {
            py: '8.5px',
          },
        }}
        sx={{
          padding: '0px',
          mt: '26px',
        }}
      />
      {error && <FormHelperText error>{error?.message}</FormHelperText>}
    </FormControl>
  );
};

export default InputField;
