import { createContext, useContext } from 'react';
import { useState, useRef } from 'react';
import { Link, Outlet } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

import { Box } from '@mui/system';
import {
  Button,
  Stack,
  SvgIcon,
  Menu,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Drawer,
} from '@mui/material';

import { ReactComponent as AddIcon } from '@assets/icons/ic-add.svg';
import { ReactComponent as ListViewIcon } from '@assets/icons/ic-view-list.svg';
import { ReactComponent as TabViewIcon } from '@assets/icons/ic-view-tabs.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/ic-filter.svg';
import SearchSideBar from './SearchSideBar';

import { TSearchGalleryRequest } from '../types';

type ContextProps = {
  view: 'list' | 'tab';
  searchForm: TSearchGalleryRequest;
};

export const GalleryContext = createContext<ContextProps>({
  view: 'list',
  searchForm: {
    search: '',
  },
});

const menuWidth = '248px';

const linkStyle = {
  textDecoration: 'none',
  color: '#333333',
};

const Layout = () => {
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showDropDown, setShowDropDawn] = useState(false);
  const [searchForm, setSearchForm] = useState<TSearchGalleryRequest>({ search: '' });

  const menuButton = useRef(null);
  const [viewType, setViewType] = useState<'list' | 'tab'>('list');
  const onChangeViewType = (event: React.MouseEvent<HTMLElement>, newValue: 'list' | 'tab') => {
    if (newValue !== null) {
      setViewType(newValue);
    }
  };

  const toggleDropDown = () => {
    setShowDropDawn(!showDropDown);
  };
  const toggleSearchMenu = () => {
    setShowSearchMenu(!showSearchMenu);
  };
  const breadcrumbs = useBreadcrumbs();

  const title = breadcrumbs[breadcrumbs.length - 1]?.breadcrumb;
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        height: '100%',
        borderRadius: '4px',
        mr: showSearchMenu ? menuWidth : '0px',
        transition: '225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
      }}>
      <GalleryContext.Provider
        value={{
          view: viewType,
          searchForm: searchForm,
        }}>
        <Stack
          direction="row"
          sx={{
            py: '10px',
            px: '16px',
          }}>
          <Typography sx={{ flex: 1 }} variant={'h5'}>
            {title}
          </Typography>
          <Button
            ref={menuButton}
            onClick={toggleDropDown}
            startIcon={<SvgIcon component={AddIcon} />}
            variant="contained"
            sx={{
              borderRadius: '8px',
            }}
            color="secondary">
            add
            <Menu
              anchorEl={menuButton?.current}
              sx={{
                py: '5px',
                '.MuiMenuItem-root': {
                  py: '5px',
                },
              }}
              open={showDropDown}
              onClose={toggleDropDown}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}>
              <Link style={linkStyle} to="/admin/gallery/videos/add-video">
                <MenuItem>Video</MenuItem>
              </Link>
              <Link style={linkStyle} to="/admin/gallery/articles/add-article">
                <MenuItem>Article</MenuItem>
              </Link>
              <Link style={linkStyle} to="/admin/gallery/food-is-medicine/recipes/add-recipe">
                <MenuItem>Recipe</MenuItem>
              </Link>
              <Link
                style={linkStyle}
                to="/admin/gallery/food-is-medicine/all-things-food/add-food-video">
                <MenuItem>Food Video</MenuItem>
              </Link>
            </Menu>
          </Button>
          <ToggleButtonGroup
            sx={{ ml: '10px' }}
            exclusive
            value={viewType}
            onChange={onChangeViewType}
            aria-label="view">
            <ToggleButton value="list" aria-label="list">
              <ListViewIcon />
            </ToggleButton>
            <ToggleButton value="tab" aria-label="tab">
              <TabViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButton
            value="menu"
            sx={{ ml: '10px' }}
            selected={showSearchMenu}
            onChange={toggleSearchMenu}>
            <FilterIcon />
          </ToggleButton>
        </Stack>
        <SearchSideBar
          width={menuWidth}
          show={showSearchMenu}
          onClose={toggleSearchMenu}
          onSearch={setSearchForm}
        />
        <Outlet />
      </GalleryContext.Provider>
    </Box>
  );
};

export default Layout;
