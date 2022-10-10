import { baseApi } from '@app/state';

import { TFile } from '../types';
import { TTableMeta } from '@app/types';

export type TUploadRequest = {
  file: File;
};

export type TDeleteRequest = {
  ids: string[];
};

export type TListRequest = {
  page: number;
  take: number;
  order?: string;
  search: string;
};
export type TListResponse = {
  data: TFile[];
  meta: TTableMeta;
};

export type TUploadFile = {
  form: FormData;
  type: 'image' | 'video';
};

export const api = baseApi
  .enhanceEndpoints({
    addTagTypes: ['Videos', 'Images'],
  })
  .injectEndpoints({
    endpoints: builder => ({
      uploadFile: builder.mutation<TFile[], TUploadFile>({
        query: data => {
          const { type, form } = data;
          return {
            url: `storage/${type}/upload`,
            method: 'POST',
            body: form,
          };
        },

        invalidatesTags: (result, error) => {
          if (result?.length) {
            const type = result[0]?.contentType;
            return [type === 'image' ? 'Images' : 'Videos'];
          }
          return [];
        },
      }),
      deleteFile: builder.mutation<unknown, TDeleteRequest>({
        query: data => {
          return {
            url: 'storage/batchDelete',
            method: 'DELETE',
            body: data,
          };
        },
      }),
      fetchVideos: builder.query<TListResponse, TListRequest>({
        query: params => {
          return {
            url: 'storage/video',
            method: 'GET',
            params: params,
          };
        },
        providesTags: ['Videos'],
      }),
      fetchImages: builder.query<TListResponse, TListRequest>({
        query: params => {
          return {
            url: 'storage/image',
            method: 'GET',
            params: params,
          };
        },
        providesTags: ['Images'],
      }),
    }),
  });
