import { useState } from 'react';
import { useFetchGalleryArticleQuery } from './hooks';

import ContentView from './components/ContentView';

const Articles = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useFetchGalleryArticleQuery({
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
        type="article"
        isLoading={isLoading}
        rowCount={rowCount}
        rows={rows}
        page={page}
        setPage={setPage}
      />
    </>
  );
};
export default Articles;
