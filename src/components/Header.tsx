import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { Avatar, Breadcrumbs, Button, MenuItem, Menu, SvgIcon, Box } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import { ReactComponent as Separator } from '@assets/icons/ic-arrow.svg';
import { ReactComponent as ArrowRight } from '@assets/icons/ic-arrow-right.svg';
import { ReactComponent as ArrowDown } from '@assets/icons/ic-arrowdown.svg';
import { avatarByName } from '../utils';
import { useAuth, useConfirmDialog } from '@app/hooks';
import { logout } from '@app/state';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 10px 0 rgba(51, 51, 51, 0.05)',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    flexDirection: 'row',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const AvatarBlock = styled(Box)({
  display: 'flex',
  flex: 1,
  justifyContent: 'flex-end',
  paddingRight: '20px',
  '& .MuiButton-root': {
    paddingLeft: '10px',
    textTransform: 'capitalize',
    color: '#3a4364',
    fontWeight: 600,
  },
  '& .MuiButton-root svg': {
    fontSize: '12px',
    paddingLeft: '6px',
  },
});

const StyledBreadcrumbs = styled(Breadcrumbs)({
  paddingLeft: '18px',
  fontSize: '18px',
  fontWight: 600,
  '& a': {
    color: '#3a4364',
    textDecoration: 'none',
    fontWight: 600,
    textTransform: 'capitalize',
  },
  '& .MuiBreadcrumbs-separator': {
    marginLeft: '5px',
    marginRight: '5px',
  },
  '& .MuiBreadcrumbs-separator svg': {
    fontSize: '20px',
  },
});

type Props = {
  open: boolean;
  onToggleMenu: React.MouseEventHandler;
};
const Header = ({ onToggleMenu, open }: Props) => {
  const openConfirmDialog = useConfirmDialog();

  const { user } = useAuth();
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const fullName = `${user?.firstName} ${user?.lastName}`;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const onLogout = () => {
    openConfirmDialog({
      title: 'Are you sure you would like to Log Out?',
      onConfirm: () => {
        dispatch(logout());
      },
    });
  };

  const breadcrumbs = useBreadcrumbs();

  const preparedBreadCrumbs = useMemo(
    () => breadcrumbs.filter((_, index) => index > 1),
    [breadcrumbs],
  );

  return (
    <AppBar position="sticky" open={open}>
      <Button
        onClick={onToggleMenu}
        color="secondary"
        variant="contained"
        sx={{
          height: '64px',
          minWidth: '16px',
          width: '16px',
          padding: '0px',
          borderRadius: '0px 4px 4px 0px',
          boxShadow: 'none',
        }}>
        <SvgIcon
          component={ArrowRight}
          viewBox="0 0 12 12"
          sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: '1rem' }}
        />
      </Button>
      <StyledBreadcrumbs separator={<SvgIcon component={Separator} viewBox="0 0 18 18" />}>
        <Link to={'#'} style={{ pointerEvents: 'none' }}>
          Admin Panel
        </Link>
        {preparedBreadCrumbs.map(({ breadcrumb, key }) => {
          return (
            <Link key={key} to={key}>
              {breadcrumb}
            </Link>
          );
        })}
      </StyledBreadcrumbs>
      <AvatarBlock>
        <Button ref={menuButton} variant="text" onClick={toggleMenu}>
          <Avatar {...avatarByName(fullName)} style={{ marginRight: '10px' }} />
          {fullName} <SvgIcon component={ArrowDown} viewBox="0 0 12 12" />
        </Button>
        <Menu
          anchorEl={menuButton?.current}
          open={menuOpen}
          onClose={toggleMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}>
          {/* <MenuItem onClick={toggleMenu}>Profile</MenuItem>
          <MenuItem onClick={toggleMenu}>My account</MenuItem> */}
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>
      </AvatarBlock>
    </AppBar>
  );
};

export default Header;
