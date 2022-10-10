import React, { ForwardedRef, forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { Autocomplete, Box, debounce, FormControl, InputLabel, TextField } from '@mui/material';
import Chip from './Chip';

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
    <ul {...rest} style={{ maxHeight: '250px' }} ref={innerRef} role="list-box">
      {children}
    </ul>
  );
});

type Option = {
  id: string;
  label: string;
};

type Props = {
  onChange: (e: Option[] | Option | null) => void;
  onBlur: (e: any) => void;
  placeholder?: string;
  onSearch: (e: string) => void;
  label?: string;
  options: Option[];
  name: string;
  loadMore?: () => void;
  isLoading?: boolean;
  defaultValue?: unknown;
  disableClearable?: boolean;
  multiple?: boolean;
  value: Option[] | Option | null;
  error?: string;
};

const AutocompleteInput = ({
  onSearch,
  label,
  loadMore,
  isLoading,
  options,
  defaultValue,
  disableClearable,
  name,
  placeholder,
  multiple,
  value,
  onChange,
  onBlur,
  error,
}: Props) => {
  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    const listboxNode = event.currentTarget;
    const position = listboxNode.scrollTop + listboxNode.clientHeight;

    if (listboxNode.scrollHeight - position <= 1) {
      loadMore && loadMore();
    }
  };
  const onDelete = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (Array.isArray(value)) {
      const newVal = value?.filter((option: Option) => option.id !== id);
      onChange(newVal);
    }
  };
  const onSearchDebounce = useCallback(
    debounce((_, newValue: string) => onSearch(newValue.toLocaleLowerCase()), 1000),
    [],
  );
  return (
    <FormControl sx={{ flex: 1, width: '100%' }} error={Boolean(error)} variant="standard">
      <InputLabel
        disableAnimation
        shrink
        sx={{ transform: 'none', color: '#333333', fontWeight: 600 }}>
        {label}
      </InputLabel>
      <Autocomplete
        loading={isLoading}
        multiple={multiple}
        sx={{
          flex: 1,
          py: '0px',
          mt: label ? '26px' : '0px',
        }}
        options={options}
        onChange={(_, newValue) => {
          onChange(newValue);
        }}
        value={value || (multiple ? [] : null)}
        ListboxProps={{
          onScroll: handleScroll,
        }}
        onBlur={onBlur}
        freeSolo={false}
        ListboxComponent={ListBox}
        disableClearable={disableClearable}
        getOptionLabel={(option: Option) => option.label}
        isOptionEqualToValue={(option, value) => option.id === value.id}
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
              FormHelperTextProps={{
                sx: {
                  ml: '0px',
                },
              }}
              {...params}
              error={Boolean(error)}
              helperText={error}
            />
          );
        }}
      />
      {/* {error && <FormHelperText error>{error}</FormHelperText>} */}
      <Box sx={{ display: 'flex', mt: '1px', flexWrap: 'wrap' }}>
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          Array.isArray(value) &&
            value?.map((option: Option, index: number) => (
              <Chip onDelete={() => onDelete(option.id)} key={option.id} label={option.label} />
            ))
        }
      </Box>
    </FormControl>
  );
};

export default AutocompleteInput;
