import { useState, PropsWithChildren, useEffect, useContext } from 'react';
import { Drawer, Stack, SvgIcon, Button } from '@mui/material';
import { Box } from '@mui/system';
import { ReactComponent as CloseIcon } from '@assets/icons/ic-close.svg';
import { ReactComponent as SearchIcon } from '@assets/icons/ic-search.svg';
import { useAppForm } from '@app/hooks';
import { SearchSchema } from '../schemas';
import { InputField, SelectField } from '@app/components/form';
import { FormProvider } from 'react-hook-form';

import { TSearchGalleryRequest, TVideo, TRecipe } from '../types';

import { useLocation, useNavigate } from 'react-router-dom';

import { GalleryContext } from './Layout';

type Props = {
  onClose: () => void;
  show?: boolean;
  width: string;
  onSearch: (state: TSearchGalleryRequest) => void;
};

const SearchSideBar = ({ onClose, show, width, onSearch }: PropsWithChildren<Props>) => {
  const { searchForm } = useContext(GalleryContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const form = useAppForm(
    {
      defaultValues: {
        search: '',
        type: searchForm?.type ? searchForm?.type : 'any',
        isPublished: searchForm?.isPublished ? searchForm?.isPublished : 'any',
      },
    },
    {
      schema: SearchSchema,
    },
  );

  const { handleSubmit, reset } = form;

  const onSubmit = ({ search, type, isPublished }: TSearchGalleryRequest) => {
    onSearch({
      search,
      type: type === 'any' ? undefined : type,
      isPublished: isPublished === 'any' ? undefined : isPublished,
    });
    if (!pathname.includes('search-results')) {
      navigate('/admin/gallery/search-results');
    }
  };

  return (
    <Drawer
      open={show}
      variant="persistent"
      anchor="right"
      hideBackdrop={false}
      sx={{
        ':root': {
          mt: '90px',
        },
        backgroundColor: '#ffffff',
        '.MuiPaper-root': {
          maxWidth: width,
        },
      }}>
      <Box sx={{ mt: '85px', p: '20px 10px ', display: 'flex', flex: 1, flexDirection: 'column' }}>
        <SvgIcon
          sx={{
            color: '#dee0e6',
            cursor: 'pointer',
          }}
          onClick={onClose}
          component={CloseIcon}
        />
        <Stack spacing={'20px'} sx={{ flex: 1 }}>
          <FormProvider {...form}>
            <InputField name="search" leftElement={<SearchIcon />} />
            <SelectField
              name="type"
              label="Content Item"
              placeHolder="Any"
              clearable
              options={[
                { value: 'any', label: 'Any' },
                { value: 'video', label: 'Video' },
                { value: 'article', label: 'Article' },
                { value: 'recipe', label: 'Recipe' },
              ]}
              defaultValue="any"
            />
            <SelectField
              name="isPublished"
              label="Status"
              placeHolder="Any"
              clearable
              options={[
                { value: 'any', label: 'Any' },
                { value: true, label: 'Published' },
                { value: false, label: 'Unpublished' },
              ]}
              defaultValue="any"
            />
          </FormProvider>
          <Button variant="contained" onClick={handleSubmit(onSubmit)} color="secondary">
            Apply
          </Button>
        </Stack>
        <Button
          variant="tertiary"
          onClick={() =>
            reset({
              search: '',
              type: 'any',
              isPublished: 'any',
            })
          }>
          Reset
        </Button>
      </Box>
    </Drawer>
  );
};
export default SearchSideBar;
