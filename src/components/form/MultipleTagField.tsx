import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Stack,
  TextField,
  Box,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Chip from '../Chip';

type Props = {
  name: string;
  label?: string;
  rightElement?: JSX.Element;
  leftElement?: JSX.Element;
  type?: string;
  defaultValue?: unknown;
};

const MultipleTagField = (props: Props) => {
  const { label, name, type = 'text', defaultValue } = props;
  const { control } = useFormContext();
  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });

  const [val, setValue] = useState<string[]>((value as string[]) || []);

  const [inputValue, setInputValue] = useState<string>('');

  const onDelete = (id: string) => {
    setValue(val.filter((option: string) => option !== id));
  };

  const onAdd = () => {
    if (!val.includes(inputValue) && inputValue.trim()) {
      setValue((state: string[]) => [...state, inputValue]);
      setInputValue('');
    }
  };

  useEffect(() => {
    onChange(val);
  }, [val]);

  return (
    <Stack direction={'row'} spacing={'10px'}>
      <FormControl variant="standard" sx={{ flex: 1 }} error={Boolean(error?.message)}>
        <InputLabel
          disableAnimation
          shrink
          sx={{ transform: 'none', color: '#333333', fontWeight: 600 }}>
          {label}
        </InputLabel>
        <TextField
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onBlur={onBlur}
          name={name}
          error={Boolean(error?.message)}
          type={type}
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
        {inputValue.length >= 128 && (
          <FormHelperText error> This field cannot be more than 128 characters</FormHelperText>
        )}
        {error && <FormHelperText error>{error?.message}</FormHelperText>}
        <Box sx={{ display: 'flex', mt: '1px', flexWrap: 'wrap' }}>
          {value &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            value?.map((option: string, index: number) => (
              <Chip onDelete={() => onDelete(option)} key={index} label={option} />
            ))}
        </Box>
      </FormControl>
      <Button
        sx={{ borderRadius: '8px', maxHeight: '40px', px: '35px', marginTop: '24px !important' }}
        variant="contained"
        disabled={inputValue.length >= 128}
        onClick={onAdd}
        color="secondary">
        Add
      </Button>
    </Stack>
  );
};

export default MultipleTagField;
