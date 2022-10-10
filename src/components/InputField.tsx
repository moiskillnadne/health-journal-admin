import { FormControl, InputAdornment, InputLabel, TextField } from '@mui/material';

type Props = {
  name: string;
  label?: string;
  rightElement?: JSX.Element;
  leftElement?: JSX.Element;
  type?: string;
  defaultValue?: unknown;
};

const InputField = (props: Props) => {
  const { label, rightElement, leftElement, type = 'text', defaultValue } = props;
  return (
    <FormControl variant="standard">
      <InputLabel
        disableAnimation
        shrink
        sx={{ transform: 'none', color: '#333333', fontWeight: 600 }}>
        {label}
      </InputLabel>
      <TextField
        type={type}
        inputProps={{
          sx: {
            py: '8.5px',
          },
        }}
        defaultValue={defaultValue}
        sx={{
          padding: '0px',
          mt: '26px',
        }}
        InputProps={{
          startAdornment: leftElement && (
            <InputAdornment position="start">{leftElement}</InputAdornment>
          ),
          endAdornment: rightElement && (
            <InputAdornment position="end">{rightElement}</InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
};

export default InputField;
