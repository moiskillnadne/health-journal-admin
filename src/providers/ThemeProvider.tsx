import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import { PropsWithChildren } from 'react';

// createTheme
type Props = PropsWithChildren<unknown>;
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    delete: true;
    tertiary: true;
  }
  // interface TextFieldPropsVariantOverrides {
  //   simple: true;
  // }
}

// ThemeProvider
const theme = createTheme({
  typography: {
    fontFamily: 'Open Sans',
    h6: {
      color: '#3a4364',
    },
    h5: {
      color: '#3a4364',
      fontWeight: 600,
      fontSize: '22px',
      textTransform: 'capitalize',
    },
  },
  palette: {
    primary: {
      main: '#9b57d3',
    },
    secondary: {
      main: '#3ea832',
    },
  },
  components: {
    MuiTextField: {
      variants: [
        {
          props: { variant: 'standard' },
          style: {
            ':root': {
              top: '20px',
              border: '1px solid #ccc',
              outline: '1px solid #ccc',
              padding: '0px',
              '&$focused': {
                border: '1px solid #ccc',
                outline: '1px solid #ccc',
              },
            },
          },
        },
      ],
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'delete' },
          style: {
            textTransform: 'capitalize',
            backgroundColor: '#fee5ea',
            color: '#e28289',
            ':disabled': {
              backgroundColor: '#f2f2f2',
            },
          },
        },
        {
          props: { variant: 'tertiary' },
          style: {
            textTransform: 'capitalize',
            backgroundColor: '#f2f2f2',
            color: '#3a4364',
          },
        },
      ],
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '16px',
          textTransform: 'capitalize',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 0,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: '150px',
          backgroundColor: '#f2f2f2',
          textTransform: 'capitalize',
          alignItems: 'flex-start',
          fontWeight: '600',
          fontSize: '18px',
          '&.Mui-selected': {
            color: '#3a4364',
            backgroundColor: '#fff',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          title: {
            fontSize: '16px',
          },
        },
        paper: {
          padding: '20px 24px',
          maxWidth: '478px',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: '60px',
          paddingTop: '15px',
          paddingBottom: '11px',
        },
        thumb: {
          width: '24px',
          height: '24px',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: '8px',
          color: '#d3d4da',
          height: '40px',
          width: '40px',
          padding: '5px',
          backgroundColor: 'transparent',
          '&.Mui-selected': {
            backgroundColor: '#3da832',
            borderRadius: '8px !important',
            // margin: '0px 1px',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgb(43, 117, 35);',
            },
          },
        },
      },
    },
  },
});

export default function (props: Props) {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}
