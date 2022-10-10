import { TextField, InputAdornment, SvgIcon, TextFieldProps } from '@mui/material';

import { ReactComponent as SearchIcon } from '@assets/icons/ic-search.svg';

type Props = TextFieldProps;

const SearchField = (props: Props) => {
  return (
    <TextField
      sx={{
        flex: 1,
        py: '0px',
        '.MuiInputBase-root': {
          pl: '10px',
        },
        '.MuiInputBase-input': {
          padding: '8.5px 14px 8.5px  0px',
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment sx={{ mr: '3px' }} position="start">
            <SvgIcon width="20px" component={SearchIcon} />
          </InputAdornment>
        ),
      }}
      placeholder="Search"
      {...props}
    />
  );
};

export default SearchField;
