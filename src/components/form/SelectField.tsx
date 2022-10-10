import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { ReactComponent as CloseIcon } from '@assets/icons/ic-close.svg';
import { useController, useFormContext } from 'react-hook-form';
import { ArrowDropDownCircleOutlined } from '@mui/icons-material';

type Option = {
  value: any;
  label: string;
};

type Props = {
  name: string;
  label?: string;
  defaultValue?: unknown;
  disabled?: boolean;
  options?: Option[];
  placeHolder?: string;
  clearable?: boolean;
  clear?: boolean;
};

const SelectField = (props: Props) => {
  const { name, defaultValue, label, disabled, options, placeHolder, clearable } = props;

  const { control, resetField } = useFormContext();

  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });

  return (
    <FormControl sx={{ width: '100%' }} error={Boolean(error?.message)} disabled={disabled}>
      <InputLabel
        disableAnimation
        shrink
        sx={{
          transform: 'none',
          color: '#333333',
          fontWeight: '600',
          '&.Mui-focused': {
            color: '#333333',
          },
        }}>
        {label}
      </InputLabel>
      <Select
        onChange={onChange}
        onBlur={onBlur}
        displayEmpty
        name={name}
        value={value}
        endAdornment={
          clearable &&
          value !== defaultValue && (
            <InputAdornment
              position="end"
              sx={{
                display: value != null ? 'flex' : 'none',
                mr: '24px',
                cursor: 'pointer',
              }}
              onClick={() => resetField(name)}>
              <CloseIcon style={{ width: '20px', height: '20px' }} />
            </InputAdornment>
          )
        }
        sx={{
          padding: '0px',
          mt: '26px',
          '.MuiSelect-select': {
            py: '8.5px',
          },
        }}>
        {options?.map(({ value, label }) => {
          return (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          );
        })}
      </Select>

      {error && <FormHelperText sx={{ ml: '0px' }}>{error?.message}</FormHelperText>}
    </FormControl>
  );
};
export default SelectField;
