import { useState } from 'react';

import { useFetchGalleryVideoQuery } from './hooks';

import ContentView from './components/ContentView';

type Props = {
  typeVideo: 'regular' | 'food';
};

const Videos = ({ typeVideo }: Props) => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useFetchGalleryVideoQuery({
    page,
    take: 10,
    type: typeVideo,
    order: 'updateAt DESC',
  });

  const rows = data?.data || [];

  const meta = data?.meta;

  const rowCount = meta?.itemCount || 0;

  return (
    <ContentView
      type={typeVideo === 'regular' ? 'video' : 'foodVideo'}
      isLoading={isLoading}
      rowCount={rowCount}
      rows={rows}
      page={page}
      setPage={setPage}
    />
  );
};
export default Videos;
