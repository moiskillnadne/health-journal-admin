/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createApi } from '@reduxjs/toolkit/query/react';
import { REHYDRATE } from 'redux-persist';

import createBaseQuery from './createBaseQuery';
import { TFile, TTableMeta } from '@app/types';

export type TSearchFileRequest = {
  search: string;
  type: 'video' | 'image';
  page?: number;
  take?: number;
};

export type TListResponse = {
  data: TFile[];
  meta: TTableMeta;
};

const api = createApi({
  baseQuery: createBaseQuery(),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return action.payload?.[reducerPath];
    }
  },
  endpoints: builder => ({
    fetchSearchFile: builder.query<TListResponse, TSearchFileRequest>({
      query: data => {
        const { type, ...params } = data;
        return {
          url: `storage/${type}`,
          method: 'GET',
          params,
        };
      },
    }),
  }),
});

export default api;
