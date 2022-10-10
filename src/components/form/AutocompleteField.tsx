import React, { ForwardedRef, forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { Autocomplete, Box, debounce, FormControl, InputLabel, TextField } from '@mui/material';
import { useController, useFormContext } from 'react-hook-form';
import Chip from '../Chip';

type Option = {
  id: string;
  label: string;
};

type Props = {
  placeholder?: string;
  onSearch?: (e: string) => void;
  label?: string;
  options: Option[];
  name: string;
  defaultValue?: unknown;
  disableClearable?: boolean;
  multiple?: boolean;
};

type ListBoxProps = React.HTMLAttributes<HTMLUListElement>;

type NullableUlElement = HTMLUListElement | null;

const ListBox = forwardRef(function ListBoxBase(
  props: ListBoxProps,
  ref: ForwardedRef<HTMLUListElement>,
) {
  const { children, ...rest } = props;

  const innerRef = useRef<HTMLUListElement>(null);

  useImperativeHandle<NullableUlElement, NullableUlElement>(ref, () => innerRef.current);

  return (
    <ul {...rest} ref={innerRef} role="list-box">
      {children}
    </ul>
  );
});

const AutocompleteField = ({
  onSearch,
  label,
  options,
  defaultValue,
  disableClearable,
  name,
  placeholder,
  multiple,
}: Props) => {
  const { control } = useFormContext();

  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });

  const onDelete = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const newVal = value.filter((option: Option) => option.id !== id);
    onChange(newVal);
  };

  const onSearchDebounce = useCallback(
    debounce((_, newValue: string) => onSearch?.(newValue.toLocaleLowerCase()), 600),
    [],
  );

  return (
    <FormControl sx={{ flex: 1, width: '100%' }} variant="standard" error={Boolean(error?.message)}>
      <InputLabel
        disableAnimation
        shrink
        sx={{ transform: 'none', color: '#333333', fontWeight: 600 }}>
        {label}
      </InputLabel>
      <Autocomplete
        // autoSelect={true}
        multiple={multiple}
        sx={{
          flex: 1,
          py: '0px',
          mt: '26px',
        }}
        options={options}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_, newValue) => {
          onChange(newValue);
        }}
        onBlur={onBlur}
        value={value || (multiple ? [] : null)}
        ListboxComponent={ListBox}
        disableClearable={disableClearable}
        getOptionLabel={(option: Option) => option.label}
        renderTags={() => null}
        onInputChange={onSearchDebounce}
        renderInput={params => {
          return (
            <TextField
              name={name}
              placeholder={placeholder}
              sx={{
                flex: 1,
                '.MuiInputBase-root': {
                  py: '1px !important',
                },
              }}
              {...params}
              error={Boolean(error?.message)}
              helperText={error?.message}
              FormHelperTextProps={{
                sx: {
                  ml: '0px',
                },
              }}
            />
          );
        }}
      />
      {multiple && (
        <Box sx={{ display: 'flex', mt: '1px', flexWrap: 'wrap' }}>
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            value?.map((option: Option, index: number) => (
              <Chip onDelete={() => onDelete(option.id)} key={option.id} label={option.label} />
            ))
          }
        </Box>
      )}
    </FormControl>
  );
};

export default AutocompleteField;
