import { PropsWithChildren } from 'react';

import RouteProvider from './RouteProvider';
import StateProvider from './StateProvider';
import ThemeProvider from './ThemeProvider';
import { CssBaseline } from '@mui/material';
import { setLocale } from 'yup';
import { ConfirmDialogProvider } from 'react-mui-confirm';

type Props = PropsWithChildren<unknown>;

setLocale({
  mixed: {
    required: 'This field is required',
  },
  string: {
    max: 'This field cannot be more than ${max} characters',
  },
  array: {
    min: 'This field is required',
  },
});

function ApplicationProvider({ children }: Props) {
  return (
    <ThemeProvider>
      <RouteProvider>
        <CssBaseline />
        <ConfirmDialogProvider>
          <StateProvider>{children}</StateProvider>
        </ConfirmDialogProvider>
      </RouteProvider>
    </ThemeProvider>
  );
}

export default ApplicationProvider;
