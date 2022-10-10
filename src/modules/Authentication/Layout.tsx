import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Bg from '@assets/images/bg-login.jpg';

export const Layout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        flex: 1,
        backgroundImage: `url(${Bg})`,
        backgroundSize: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Box
        sx={{
          backgroundColor: 'white',
          minWidth: '453px',
          padding: '20px 50px 50px ',
          textAlign: 'center',
        }}>
        <img
          src={require('@assets/images/logo-color.png')}
          width="120px"
          height="120px"
          style={{ marginBottom: '20px' }}
          alt="logo-color"
        />
        <Outlet />
      </Box>
    </Box>
  );
};
