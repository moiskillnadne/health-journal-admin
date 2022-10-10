import { TenMp } from '@mui/icons-material';
import { Box, Divider, Typography } from '@mui/material';
import { useContext, useMemo } from 'react';
import ContentView from './components/ContentView';
import { GalleryContext } from './components/Layout';
import { useFetchSearchGalleryQuery } from './hooks';

type Props = {
  searchTypeContent?: string;
  view: string;
} & React.ComponentProps<typeof ContentView>;

const Item = ({ type, searchTypeContent, rows, isLoading, view }: Props) => {
  const isTab = view === 'tab';
  return (
    <>
      {(!searchTypeContent || searchTypeContent === type) && (
        <Box sx={{ mt: '20px', pb: '10px' }}>
          <Typography sx={{ mb: '10px', pl: '16px', textTransform: 'capitalize' }} variant="h6">
            {type}s
          </Typography>
          <ContentView type={type} isLoading={isLoading} rows={rows} />
          {isTab && <Divider sx={{ color: '#e7ecff', mt: '20px', mx: '16px' }} />}
        </Box>
      )}
    </>
  );
};

const SearchResults = () => {
  const { searchForm, view } = useContext(GalleryContext);
  const { data, isLoading } = useFetchSearchGalleryQuery(searchForm);
  const { type } = searchForm;

  const addIndexToArray = <T,>(el: T, index: number) => ({ ...el, index: ++index });

  const recipes = useMemo(() => data?.recipes?.map(addIndexToArray) || [], [data?.recipes]);
  const articles = useMemo(() => data?.articles?.map(addIndexToArray) || [], [data?.articles]);
  const videos = useMemo(() => data?.videos?.map(addIndexToArray) || [], [data?.videos]);

  return (
    <Box sx={{ backgroundColor: '#fff' }}>
      <Divider sx={{ color: '#e7ecff', mt: '20px', mx: '16px' }} />
      <Item searchTypeContent={type} view={view} type="video" isLoading={isLoading} rows={videos} />
      <Item
        searchTypeContent={type}
        view={view}
        type="recipe"
        isLoading={isLoading}
        rows={recipes}
      />
      <Item
        view={view}
        searchTypeContent={type}
        type="article"
        isLoading={isLoading}
        rows={articles}
      />
    </Box>
  );
};

export default SearchResults;
