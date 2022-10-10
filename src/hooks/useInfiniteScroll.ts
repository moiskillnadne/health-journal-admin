import { useState, useEffect, useCallback } from 'react';
import { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';

import { ListQueryResponse } from '@app/types';

const useInfiniteScroll = (
  useGetDataListQuery: UseQuery<any>,
  { take = 50, ...queryParameters }: any,
) => {
  const [localPage, setLocalPage] = useState(1);
  const [combinedData, setCombinedData] = useState<any[]>([]);

  const queryResponse = useGetDataListQuery({
    page: localPage,
    take,
    ...queryParameters,
  });

  const {
    data: fetchData,
    meta: { page: remotePage, hasNextPage },
  } = (queryResponse?.data as ListQueryResponse) || { data: {}, meta: {} };

  useEffect(() => {
    if (fetchData?.length) {
      if (localPage === 1) {
        setCombinedData(fetchData);
      } else if (localPage === remotePage) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        setCombinedData(previousData => [...previousData, ...fetchData]);
      }
    }
  }, [fetchData, localPage, remotePage]);

  const refresh = useCallback(() => {
    setLocalPage(1);
  }, []);

  const loadMore = () => {
    if (hasNextPage && localPage === remotePage) {
      setLocalPage(page => page + 1);
    }
  };

  return {
    data: combinedData,
    page: localPage,
    loadMore,
    refresh,
    isLoading: queryResponse?.isLoading,
    isFetching: queryResponse?.isFetching,
  };
};

export default useInfiniteScroll;
