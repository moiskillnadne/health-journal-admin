import { useState } from 'react';

import { useFetchGalleryRecipeQuery } from './hooks';

import ContentView from './components/ContentView';

const Recipes = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useFetchGalleryRecipeQuery({
    page,
    take: 10,
    order: 'updateAt DESC',
  });

  const rows = data?.data || [];

  const meta = data?.meta;

  const rowCount = meta?.itemCount || 0;

  return (
    <>
      <ContentView
        type="recipe"
        isLoading={isLoading}
        rows={rows}
        rowCount={rowCount}
        page={page}
        setPage={setPage}
      />
    </>
  );
};
export default Recipes;
