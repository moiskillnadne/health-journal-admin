import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MuiDrawer from '@mui/material/Drawer';
import {
  SvgIcon,
  List,
  ListItemButton,
  ListItemIcon,
  styled,
  Theme,
  CSSObject,
} from '@mui/material';

import { ReactComponent as AnalyticsIcon } from '@assets/icons/ic-analytics.svg';
import { ReactComponent as TracksIcon } from '@assets/icons/ic-tracks.svg';
import { ReactComponent as ContentStorageIcon } from '@assets/icons/ic-content-storage.svg';
import { ReactComponent as LibraryIcon } from '@assets/icons/ic-library.svg';
import { ReactComponent as NotificationIcon } from '@assets/icons/ic-notification.svg';
import { ReactComponent as UsersIcon } from '@assets/icons/ic-users.svg';
import { useIsSuperAdmin } from '@app/hooks';

const drawerWidth = 248;
const closeDrawerWidth = 72;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${closeDrawerWidth}px + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${closeDrawerWidth}px + 1px)`,
  },
});

const StyledList = styled(List, { shouldForwardProp: prop => prop !== 'open' })({
  '&& .MuiButtonBase-root:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  '&& .Mui-selected': {
    backgroundColor: 'transparent',
  },
  '&& .MuiListItemButton-root': {
    color: 'white',
    paddingLeft: '24px',
  },
  '& .Mui-selected .selected': {
    top: '0px',
    left: '0px',
    position: 'absolute',
    width: '4px',
    height: '100%',
    backgroundColor: '#3ea832',
    borderRadius: '0px 2px 2px 0px',
  },
  '& .MuiList-root>li>a,': {
    color: 'white',
    fontWeight: 600,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': { backgroundImage: 'linear-gradient(to top, #8452b0, #3b2272)' },

    ...(open && {
      ...openedMixin(theme),
      '& .MuiListItemIcon-root': {
        minWidth: '34px',
      },
      '& .MuiDrawer-paper': {
        ...openedMixin(theme),
        backgroundImage: 'linear-gradient(to top, #8452b0, #3b2272)',
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        ...closedMixin(theme),
        backgroundImage: 'linear-gradient(to top, #8452b0, #3b2272)',
      },
    }),
  }),
);

type TNavLink = {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  path: string;
  text: string;
  isActive?: boolean;
};

const navigationMenu: TNavLink[] = [
  {
    icon: AnalyticsIcon,
    path: 'analytics',
    text: 'Analytics',
  },
  {
    icon: TracksIcon,
    path: 'tracks',
    text: 'Tracks',
  },
  {
    icon: ContentStorageIcon,
    path: 'content-storage',
    text: 'Content Storage',
  },
  {
    icon: LibraryIcon,
    path: 'gallery',
    text: 'Gallery',
  },
  {
    icon: NotificationIcon,
    path: 'notifications',
    text: 'Notifications',
  },
  {
    icon: UsersIcon,
    path: 'admin-users',
    text: 'Admin Users',
  },
];

const NavLink = ({ icon, text, path, isActive }: TNavLink) => {
  return (
    <li>
      <Link to={path} style={{ textDecoration: 'none' }}>
        <ListItemButton selected={isActive}>
          <div className="selected"></div>
          <ListItemIcon>
            <SvgIcon component={icon} viewBox="0 0 24 24" />
          </ListItemIcon>
          {text}
        </ListItemButton>
      </Link>
    </li>
  );
};

type Props = {
  open: boolean;
};

export default function Sidebar({ open }: Props) {
  const { pathname } = useLocation();
  const isAdmin = useIsSuperAdmin();

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        {open ? (
          <img width="104px" height="40px" src={require('../assets/images/logo-white.png')} />
        ) : (
          <img
            width="40px"
            height="40px"
            src={require('../assets/images/logo-white-collapsed.png')}
          />
        )}
      </DrawerHeader>
      <StyledList>
        {navigationMenu.map((el, index) => {
          if (!isAdmin && (!index || index === navigationMenu.length - 1)) {
            return null;
          }
          return <NavLink key={el.text} {...el} isActive={pathname.includes(el.path)} />;
        })}
      </StyledList>
    </Drawer>
  );
}
