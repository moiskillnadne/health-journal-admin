import * as React from 'react';
import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';
import Header from './Header';

const HEADER_HEIGHT = '64px';

export default function Layout() {
  const [open, setOpen] = React.useState(true);

  const onClickToggler = () => {
    setOpen(state => !state);
  };
  return (
    <Box sx={{ display: 'flex', flex: 1, height: '100%' }}>
      <Sidebar open={open} />
      <Box component="main" sx={{ flex: 1, flexGrow: 1, bgcolor: '#f8f8f8' }}>
        <Header onToggleMenu={onClickToggler} open={open} />
        <Box
          p="10px"
          sx={{
            flex: 1,
            height: `calc(100% - ${HEADER_HEIGHT})`,
            display: 'flex',
            flexDirection: 'column',
          }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
